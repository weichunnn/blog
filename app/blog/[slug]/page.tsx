import { allBlogs, Blog } from "contentlayer/generated";
import { Metadata } from "next";
import { HOST } from "@/constants/constant";
import BlogPost from "@/components/BlogPost";

export async function generateStaticParams() {
  return allBlogs.map((blog: Blog) => ({
    slug: blog.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = allBlogs.find((blog: Blog) => blog._raw.flattenedPath === slug);
  if (!blog) throw new Error(`Blog not found for slug: ${slug}`);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blog.structuredData),
        }}
      />
      <BlogPost blog={blog} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = allBlogs.find((blog) => blog.slug === slug);

  if (!blog) return {};

  const { title, summary, publishedAt } = blog;
  const description =
    summary || "a piece of writing about a particular subject";
  const ogImage = {
    url: `${HOST}/api/og?title=${title}`,
  };

  return {
    metadataBase: new URL(HOST),
    title,
    description,
    openGraph: {
      type: "article",
      url: `${HOST}/blog/${slug}`,
      title,
      description,
      images: [ogImage],
      publishedTime: publishedAt,
      siteName: "personal blog of @_weichunnn",
      authors: ["wei chun"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage,
    },
  };
}
