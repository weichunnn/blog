import { allBlogs } from "contentlayer/generated";
import Header from "@/components/Header";
import BlogList from "@/components/BlogList";
import BlogTags from "@/components/BlogTags";

export default function Page() {
  const numberOfBlogs = allBlogs.length;
  const numberOfWords = allBlogs.reduce((acc, blog) => {
    return acc + blog.body.raw.split(" ").length;
  }, 0);

  return (
    <>
      <Header title="archives" className="mb-4" />
      {/* <BlogTags /> */}
      <p className="text-sm text-gray-500 mb-4">
        {numberOfBlogs} posts / {numberOfWords} words counting on
      </p>
      <BlogList blogs={allBlogs} />
    </>
  );
}
