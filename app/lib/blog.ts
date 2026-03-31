import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article, WithContext } from "schema-dts";

const SITE_URL = "https://www.wchun.xyz";
const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Blog {
  title: string;
  publishedAt: string;
  summary?: string;
  tags?: string[];
  image?: string;
  slug: string;
  readTime: number;
  structuredData: WithContext<Article>;
  body: {
    raw: string;
  };
}

function computeStructuredData(
  title: string,
  slug: string,
  publishedAt: string,
  summary?: string,
): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: publishedAt,
    dateModified: publishedAt,
    description: summary,
    author: {
      "@type": "Person",
      name: "Tan Wei Chun",
      url: SITE_URL,
    },
  };
}

export function getBlogPosts(): Blog[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  return files.map((filename) => {
    const filePath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const slug = filename.replace(/\.mdx$/, "");

    const publishedAt =
      data.publishedAt instanceof Date
        ? data.publishedAt.toISOString()
        : String(data.publishedAt);

    const wordsPerMinute = 200;
    const noOfWords = content.split(/\s/g).length;
    const readTime = Math.ceil(noOfWords / wordsPerMinute);

    return {
      title: data.title,
      publishedAt,
      summary: data.summary,
      tags: data.tags,
      image: data.image,
      slug,
      readTime,
      structuredData: computeStructuredData(
        data.title,
        slug,
        publishedAt,
        data.summary,
      ),
      body: { raw: content },
    };
  });
}

export const allBlogs: Blog[] = getBlogPosts();
