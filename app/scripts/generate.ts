import { Pool } from "pg";

import { allBlogs } from "../lib/blog";
import { getChangedFiles } from "./git";
import { getEmbeddingsBatch } from "./embeddings";
import { parseArgs } from "node:util";
import cliProgress from "cli-progress";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createEmbeddingsTable() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

      CREATE TABLE IF NOT EXISTS "public"."documents" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT,
        content TEXT,
        slug TEXT UNIQUE,
        embedding vector(1024)
      );

      CREATE INDEX IF NOT EXISTS documents_embedding_idx
        ON "public"."documents"
        USING hnsw (embedding vector_cosine_ops);
    `);
    console.log("Embedding tables and indexes created successfully");
  } catch (error) {
    console.error("Error creating Embedding tables:", error);
  } finally {
    client.release();
  }
}

async function deleteExistingEmbeddings(slug: string) {
  const client = await pool.connect();

  try {
    await client.query(`DELETE FROM "public"."documents" WHERE slug = $1`, [
      slug,
    ]);
    console.log(`Deleted existing embeddings for slug: ${slug}`);
  } catch (error) {
    console.error(`Error deleting embeddings for slug ${slug}:`, error);
  } finally {
    client.release();
  }
}

const args = parseArgs({
  options: {
    refresh: {
      type: "boolean",
    },
  },
});

async function generate() {
  const shouldRefresh = Boolean(args.values.refresh);

  const { allChanges, deletes } = getChangedFiles("mdx");

  allBlogs
    .filter((blog) => deletes.includes(`content/${blog.slug}.mdx`))
    .forEach((blog) => deleteExistingEmbeddings(blog.slug));

  let changedBlogs = allBlogs.filter((blog) =>
    allChanges.includes(`content/${blog.slug}.mdx`)
  );

  if (shouldRefresh) {
    console.log("Refreshing all embeddings");
    const client = await pool.connect();
    await client.query(`DROP TABLE IF EXISTS "public"."documents"`);
    client.release();
    changedBlogs = allBlogs;
  }

  await createEmbeddingsTable();

  if (changedBlogs.length === 0) {
    console.log("No blog changes to process");
    await pool.end();
    return;
  }

  const bar = new cliProgress.SingleBar({
    clearOnComplete: false,
    hideCursor: true,
    format: "{bar} | {percentage}% | {value}/{total} blogs",
  });
  bar.start(changedBlogs.length, 0);

  const BATCH_SIZE = 20;
  for (let i = 0; i < changedBlogs.length; i += BATCH_SIZE) {
    const batch = changedBlogs.slice(i, i + BATCH_SIZE);

    const texts = batch.map((blog) => {
      return `${blog.title}\n\n${blog.body.raw}`;
    });

    const vectors = await getEmbeddingsBatch(texts, "document");
    if (!vectors) {
      console.error(`\nFailed to embed batch starting at index ${i}`);
      bar.increment(batch.length);
      continue;
    }

    const client = await pool.connect();
    try {
      const values: string[] = [];
      const params: unknown[] = [];
      let paramIdx = 1;

      for (let j = 0; j < batch.length; j++) {
        const blog = batch[j];
        values.push(
          `($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2}, $${paramIdx + 3}::vector)`
        );
        params.push(texts[j], blog.slug, blog.title, vectors[j]);
        paramIdx += 4;
      }

      if (!shouldRefresh) {
        const slugs = batch.map((blog) => blog.slug);
        await client.query(
          `DELETE FROM "public"."documents" WHERE slug = ANY($1)`,
          [slugs]
        );
      }

      await client.query(
        `INSERT INTO "public"."documents" (content, slug, title, embedding) VALUES ${values.join(", ")}`,
        params
      );
    } catch (error) {
      console.error(`\nError storing batch starting at index ${i}:`, error);
    } finally {
      client.release();
    }

    bar.increment(batch.length);
  }

  bar.stop();
  await pool.end();
}

generate();
