import { allBlogs } from "content-collections";
import Header from "@/components/Header";
import BlogList from "@/components/BlogList";

export default function Page() {
  const numberOfBlogs = allBlogs.length;
  const numberOfWords = allBlogs.reduce((acc, blog) => {
    return acc + blog.content.split(" ").length;
  }, 0);

  return (
    <>
      <Header title="archives" className="mb-4" />
      <p className="text-sm text-gray-500 mb-4">
        {numberOfBlogs} posts / {numberOfWords} words counting on
      </p>
      <BlogList blogs={allBlogs} />
    </>
  );
}
