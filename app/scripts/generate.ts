import { Pool } from "pg";

import { allBlogs } from ".contentlayer/generated/index.mjs";
import { cleanMDXFile, splitIntoChunks } from "./utils";
import { getChangedFiles } from "./git";
import { getEmbeddingsRemote } from "./embeddings";
import { parseArgs } from "node:util";
import cliProgress from "cli-progress";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createEmbeddingsTable() {
  const client = await pool.connect();

  try {
    await client.query(`
      create extension if not exists vector with schema public;

      create table if not exists "public"."documents" (
        id UUID primary key default gen_random_uuid(),
        title text,
        content text,
        slug text,
        embedding vector(1024)
      );
    `);
    console.log("Embedding tables created if not exist successfully");
  } catch (error) {
    console.error("Error creating Embedding tables:", error);
  } finally {
    client.release();
  }
}

export async function storeEmbeddings(
  text: string,
  slug: string,
  title: string
) {
  const client = await pool.connect();

  try {
    const vector = await getEmbeddingsRemote(text);
    if (!vector) return;

    await client.query(
      `insert into "public"."documents" (content, slug, title, embedding) values ($1, $2, $3, $4::vector)`,
      [text, slug, title, vector]
    );
  } catch (error) {
    console.error(`Error storing ${title}:`, error);
  } finally {
    client.release();
  }
}

async function deleteExistingEmbeddings(slug: string) {
  const client = await pool.connect();

  try {
    await client.query(`delete from "public"."documents" where slug = $1`, [
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
    .filter((blog) => deletes.includes(`content/${blog._raw.sourceFilePath}`))
    .forEach((blog) =>
      deleteExistingEmbeddings(
        blog.structuredData.url.split(`blog/`).pop() as string
      )
    );

  let changedBlogs = allBlogs.filter((blog) =>
    allChanges.includes(`content/${blog._raw.sourceFilePath}`)
  );

  if (shouldRefresh) {
    console.log("Refreshing all embeddings");
    const client = await pool.connect();
    await client.query(`drop table if exists "public"."documents"`);
    changedBlogs = allBlogs;
  }

  await createEmbeddingsTable();
  const multibar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: "{bar} | {percentage}% | {value}/{total} | {title}",
  });

  const blogBar = multibar.create(changedBlogs.length, 0, {
    title: "Blogs Progress",
  });

  for (const blog of changedBlogs) {
    const { url, headline } = blog.structuredData;
    const slug = url.split(`blog/`).pop() as string;
    if (!shouldRefresh) {
      await deleteExistingEmbeddings(slug);
    }
    const text = cleanMDXFile(blog.body.raw);
    const chunks = await splitIntoChunks(text);

    for (const chunk of chunks) {
      await storeEmbeddings(chunk.text, slug, headline);
      await delay(1000);
    }
    blogBar.increment();
  }

  multibar.stop();
}

generate();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
