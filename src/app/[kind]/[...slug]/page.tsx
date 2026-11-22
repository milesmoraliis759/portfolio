import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ComponentProps } from "react";
import remarkGfm from "remark-gfm";
import { getAllContent, getContentBySlug, type ContentKind } from "@/lib/content";
import { ReadingProgress } from "@/components/reading-progress";

type Props = { params: Promise<{ kind: string; slug: string[] }> };
export function generateStaticParams() {
  return getAllContent().map((item) => ({ kind: item.kind, slug: item.slug.split("--") }));
}
async function resolve(params: Props["params"]) {
  const { kind, slug } = await params;
  if (kind !== "articles" && kind !== "learning") return null;
  return getContentBySlug(kind as ContentKind, slug.join("--"));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await resolve(params);
  return result ? {
    title: result.item.title,
    description: result.item.description,
    openGraph: { type: "article", title: result.item.title, description: result.item.description },
  } : { title: "Not found" };
}
const mdxComponents = {
  table: (props: ComponentProps<"table">) => <div className="table-scroll"><table {...props}/></div>,
};
export default async function ContentPage({ params }: Props) {
  const result = await resolve(params);
  if (!result) notFound();
  const { content } = await compileMDX({
    source: result.source,
    options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm] } },
    components: mdxComponents,
  });
  const { item } = result;
  const formattedDate = item.date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.date)) : "Student notes";
  return (
    <article className="article-shell">
      <ReadingProgress/>
      <header className="article-heading reading-container">
        <span className="tag">{item.kind === "articles" ? "Journal" : "Learning note"} · {item.category}</span>
        <p className="eyebrow">{item.kind === "articles" ? "WRITING & REFLECTIONS" : "LEARNING STUDIO"} · {item.readTime}</p>
        <h1>{item.title}</h1>
        <p className="article-description">{item.description}</p>
        <div className="article-meta"><span>{formattedDate}</span><span>{item.level ?? "Pharmacy learning"}</span></div>
      </header>
      <div className="mdx-prose">{content}</div>
      <div className="article-end"><span>END OF NOTE</span><span>Educational material · Verify with standard references</span></div>
    </article>
  );
}
