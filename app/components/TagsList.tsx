import { allBlogs } from "contentlayer/generated";
import Tag from "./Tag";

export default function TagList({
  tags,
  prefix,
}: {
  tags: string[];
  prefix: string;
}) {
  let allTags: string[] = tags.sort();

  return (
    <div className="flex flex-wrap gap-1 mb-4">
      {allTags.map((tag, index) => {
        return <Tag key={index} tag={tag} prefix={prefix} />;
      })}
    </div>
  );
}
