import { allBlogs, Blog } from "contentlayer/generated";
import BlogList from "@/components/BlogList";
import Header from "@/components/Header";
import BlogTags from "@/components/BlogTags";

// export async function generateStaticParams() {
//   const uniqueTags = new Set();
//   allBlogs.forEach((blog) => {
//     blog.tags.forEach((tag) => uniqueTags.add(tag));
//   });
//   return Array.from(uniqueTags).map((tag) => ({ slug: tag }));
// }

export default async function Page() {
  // const { slug } = params;
  // const blogs = allBlogs.filter((blog: Blog) => blog.tags.includes(slug));

  return (
    <>
      {/* <Header title={`Tag: ${slug} (${blogs.length})`} className="mb-4" />
      <BlogTags />
      <BlogList blogs={blogs} /> */}
    </>
  );
}
