import { allBlogs } from "contentlayer/generated";
import TagList from "@/components/TagsList";

export default function BlogTags() {
  const uniqueTags: Set<string> = new Set();
  allBlogs.forEach((blog) => {
    blog.tags && blog.tags.forEach((tag) => uniqueTags.add(tag));
  });
  const allTags: string[] = Array.from(uniqueTags).sort();

  return <TagList tags={allTags} prefix="tag" />;
}
