import { allBlogs } from "content-collections";
import TagList from "@/components/TagsList";

export default function BlogTags() {
  const uniqueTags: Set<string> = new Set();
  allBlogs.forEach((blog) => {
    blog.tags?.forEach((tag: string) => uniqueTags.add(tag));
  });
  const allTags: string[] = Array.from(uniqueTags).sort();

  return <TagList tags={allTags} prefix="tag" />;
}
