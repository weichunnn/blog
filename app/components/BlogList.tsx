import { compareDesc, format } from "date-fns";
import Link from "next/link";

interface Blog {
  title: string;
  slug: string;
  publishedAt: string;
}

export default function BlogList({
  blogs,
  sorted = true,
}: {
  blogs: Blog[];
  sorted?: boolean;
}) {
  const sortedBlogs = blogs.toSorted((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );

  return (
    <div className="grid grid-cols-1 gap-2">
      {(sorted ? sortedBlogs : blogs).map((blog) => (
        <Link key={blog.slug} href={`/blog/${blog.slug}`}>
          <div className="flex flex-row justify-between gap-4">
            <span className="flex-1">
              {blog.title.toLowerCase()}
            </span>
            <span>
              {format(new Date(blog.publishedAt.split("T")[0]), "MMM dd, yyyy")}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
