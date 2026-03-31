import { HOST } from "@/constants/constant";
import { allBlogs } from "content-collections";
import { MetadataRoute } from "next";

const postsSitemap: MetadataRoute.Sitemap = allBlogs.map((blog) => ({
  url: `${HOST}/blog/${blog.slug}`,
  lastModified: blog.publishedAt,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: HOST as string,
      lastModified: new Date(),
    },
    ...postsSitemap,
  ];
}
