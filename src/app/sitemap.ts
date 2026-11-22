import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harshmishra759.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/experience", "/articles", "/learning", "/contact"];
  return [
    ...routes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...getAllContent().map((item) => ({
      url: `${siteUrl}/${item.kind}/${item.slug.replace(/--/g, "/")}`,
      lastModified: item.date ? new Date(item.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: item.featured ? 0.8 : 0.6,
    })),
  ];
}
