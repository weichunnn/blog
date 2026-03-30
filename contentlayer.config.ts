import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { Article, WithContext } from "schema-dts";

import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings, {
  type Options as AutolinkOptions,
} from "rehype-autolink-headings";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

const HOST = "https://www.wchun.xyz";

const structuredData = (doc: any): WithContext<Article> => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: doc.title,
  url: `${HOST}/blog/${doc._raw.flattenedPath}`,
  datePublished: doc.publishedAt,
  dateModified: doc.publishedAt,
  description: doc.summary,
  author: {
    "@type": "Person",
    name: "Tan Wei Chun",
    url: HOST,
  },
});

export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    publishedAt: {
      type: "string",
      required: true,
    },
    summary: {
      type: "string",
    },
    tags: {
      type: "list",
      of: { type: "string" },
    },
    image: {
      type: "string",
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath,
    },
    readTime: {
      type: "number",
      resolve: (doc) => {
        const wordsPerMinute = 200;
        const noOfWords = doc.body.raw.split(/\s/g).length;
        const minutes = noOfWords / wordsPerMinute;
        const readTime = Math.ceil(minutes);
        return readTime;
      },
    },
    structuredData: {
      type: "json",
      resolve: (doc) => structuredData(doc),
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Blog],
  mdx: {
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
            // light: "github-light",
            dark: "one-dark-pro",
          },
        } satisfies Partial<PrettyCodeOptions>,
      ],
    ],
  },
});
