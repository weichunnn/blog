import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings, {
  type Options as AutolinkOptions,
} from "rehype-autolink-headings";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";

const HOST = "https://www.wchun.xyz";

const blogs = defineCollection({
  name: "blogs",
  typeName: "Blog",
  directory: "content",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string().nullish(),
    tags: z.array(z.string()).nullish(),
    image: z.string().nullish(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ["anchor"],
            },
          } satisfies Partial<AutolinkOptions>,
        ],
        [
          rehypePrettyCode,
          {
            theme: {
              dark: "one-dark-pro",
            },
          } satisfies Partial<PrettyCodeOptions>,
        ],
      ],
    });

    const slug = document._meta.path;
    const wordsPerMinute = 200;
    const noOfWords = document.content.split(/\s/g).length;
    const readTime = Math.ceil(noOfWords / wordsPerMinute);

    const structuredData = {
      "@context": "https://schema.org" as const,
      "@type": "Article" as const,
      headline: document.title,
      url: `${HOST}/blog/${slug}`,
      datePublished: document.publishedAt,
      dateModified: document.publishedAt,
      description: document.summary ?? undefined,
      author: {
        "@type": "Person" as const,
        name: "Wei Chun",
        url: HOST,
      },
    };

    return {
      ...document,
      mdx,
      slug,
      readTime,
      structuredData,
    };
  },
});

export default defineConfig({
  content: [blogs],
});
