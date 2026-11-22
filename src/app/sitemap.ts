import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixedRoutes = ["", "/about", "/experience", "/projects", "/articles", "/learning", "/contact"];
  const staticEntries = fixedRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
  const contentEntries = getAllContent().map((item) => ({
    url: `${siteUrl}/${item.kind}/${item.slug.replace(/--/g, "/")}`,
    lastModified: item.date ? new Date(item.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: item.featured ? 0.8 : 0.6,
  }));
  return [...staticEntries, ...contentEntries];
}
