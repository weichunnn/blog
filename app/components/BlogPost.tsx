import { format } from "date-fns";
import { Blog } from "@/lib/blog";
import { compileMDX } from "@/lib/mdx";
import Link from "next/link";
import Header from "./Header";
import MDXComponents from "./MDXComponents";
import BlogNavigation from "./BlogNavigation";

export default async function BlogPost({ blog, minimal }: { blog: Blog; minimal?: boolean }) {
  const MDXContent = await compileMDX(blog.body.raw);
  const publishedAt = new Date(blog.publishedAt);

  const timestampInformation = `${format(publishedAt, "MMMM do, y")}`;
  return (
    <article className="prose dark:prose-invert prose-xs prose-slate m-0 max-w-[2000px]">
      <Link className="no-underline" href={`/blog/${blog.slug}`}>
        <Header title={blog.title} className="mb-0" />
      </Link>
      <MDXContent components={MDXComponents} />
      <p className="my-2 text-gray-500">{timestampInformation}</p>
      {!minimal && <BlogNavigation currentBlog={blog} />}
    </article>
  );
}
