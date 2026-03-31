import { evaluate, type EvaluateOptions } from "@mdx-js/mdx";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings, {
  type Options as AutolinkOptions,
} from "rehype-autolink-headings";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";

export async function compileMDX(source: string) {
  const { default: MDXContent } = await evaluate(source, {
    Fragment,
    jsx: jsx as EvaluateOptions["jsx"],
    jsxs: jsxs as EvaluateOptions["jsxs"],
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

  return MDXContent;
}
