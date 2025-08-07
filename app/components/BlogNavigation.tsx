"use client";

import Link from "next/link";
import { allBlogs, Blog } from "contentlayer/generated";
import { compareDesc } from "date-fns";

interface BlogNavigationProps {
  currentBlog: Blog;
}

export default function BlogNavigation({ currentBlog }: BlogNavigationProps) {
  const sortedBlogs = allBlogs.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );

  const currentIndex = sortedBlogs.findIndex(
    (blog) => blog.slug === currentBlog.slug
  );

  const previousBlog = currentIndex > 0 ? sortedBlogs[currentIndex - 1] : null;
  const nextBlog =
    currentIndex < sortedBlogs.length - 1
      ? sortedBlogs[currentIndex + 1]
      : null;

  if (!previousBlog && !nextBlog) {
    return null;
  }

  return (
    <nav className="mt-8 flex flex-col space-y-2 w-full text-sm text-gray-500">
      {nextBlog && (
        <div>
          <span className="mb-1 mr-2">➡️ next: </span>
          <Link
            href={`/blog/${nextBlog.slug}`}
            className="no-underline font-normal"
          >
            <span>{nextBlog.title}</span>
          </Link>
        </div>
      )}
      {previousBlog && (
        <div>
          <span className="mb-1 mr-2">⬅️ previous: </span>
          <Link
            href={`/blog/${previousBlog.slug}`}
            className="no-underline font-normal"
          >
            <span>{previousBlog.title}</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
