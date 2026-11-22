import { getAllContent } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harshmishra759.vercel.app";
const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (char) => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
}[char] ?? char));

export function GET() {
  const items = getAllContent().map((item) => {
    const url = `${siteUrl}/${item.kind}/${item.slug.replace(/--/g, "/")}`;
    return `<item><title>${escapeXml(item.title)}</title><link>${url}</link><guid>${url}</guid><description>${escapeXml(item.description)}</description><pubDate>${new Date(item.date || Date.now()).toUTCString()}</pubDate></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Harsh Mishra · Pharmaceutical Sciences</title><link>${siteUrl}</link><description>Learning notes and writing from a B.Pharm student.</description><language>en-IN</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" } });
}
