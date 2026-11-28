import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ComponentProps } from "react";
import remarkGfm from "remark-gfm";
import { getAllContent, getContentBySlug, type ContentKind } from "@/lib/content";
import { ReadingProgress } from "@/components/reading-progress";
import { Callout, Definition, DrugCard, Formula, ProcessFlow } from "@/components/pharmacy-mdx";
import { QuickCheck } from "@/components/quick-check";
import { LessonQuiz } from "@/components/lesson-quiz";
import { StudyActions } from "@/components/study-tools";
import { ArticleToc, type TocItem } from "@/components/article-toc";
import { ArticleAudioPlayer } from "@/components/article-audio-player";

type Props = { params: Promise<{ kind: string; slug: string[] }> };
export const dynamicParams = false;

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
  const pathname = result ? `/${result.item.kind}/${result.item.slug.split("--").join("/")}` : undefined;
  return result ? {
    title: result.item.title,
    description: result.item.description,
    alternates: { canonical: pathname },
    openGraph: { type: "article", url: pathname, title: result.item.title, description: result.item.description },
    twitter: { card: "summary_large_image", title: result.item.title, description: result.item.description },
  } : { title: "Not found" };
}
function slugifyHeading(value: string) {
  return value.toLowerCase().trim().replace(/[`*_~]/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}
function extractHeadings(source: string): TocItem[] {
  const counts = new Map<string, number>();
  return source.split("\n").flatMap((line) => {
    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!match) return [];
    const title = match[2].replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/`(.*?)`/g, "$1").trim();
    const base = slugifyHeading(title);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return [{ id: count ? `${base}-${count}` : base, title, level: match[1].length as 2 | 3 }];
  });
}
function addHeadingIds() {
  return (tree: any) => {
    const counts = new Map<string, number>();
    const visit = (node: any) => {
      if (node.type === "heading" && (node.depth === 2 || node.depth === 3)) {
        const readText = (part: any): string => part.value ?? (part.children ?? []).map(readText).join("");
        const title = (node.children ?? []).map(readText).join("");
        const base = slugifyHeading(title);
        const count = counts.get(base) ?? 0;
        counts.set(base, count + 1);
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: count ? `${base}-${count}` : base } };
      }
      for (const child of node.children ?? []) visit(child);
    };
    visit(tree);
  };
}
const mdxComponents = {
  Callout, Definition, DrugCard, Formula, ProcessFlow, QuickCheck, LessonQuiz,
  table: (props: ComponentProps<"table">) => <div className="table-scroll" role="region" aria-label="Scrollable data table" tabIndex={0}><table {...props}/></div>,
};
export default async function ContentPage({ params }: Props) {
  const result = await resolve(params);
  if (!result) notFound();
  const { content } = await compileMDX({ source: result.source, components: mdxComponents, options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm, addHeadingIds] } } });
  const { item } = result;\n  const headings = extractHeadings(result.source);
  const siblings = getAllContent(item.kind).filter((entry) => entry.category === item.category);
  const currentIndex = siblings.findIndex((entry) => entry.slug === item.slug);
  const previousItem = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;
  const sectionLabel = item.kind === "articles" ? "article" : "lesson";
  const formattedDate = item.date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.date)) : "Student notes";
  return <article className="article-shell"><ReadingProgress/><header className="article-heading reading-container"><span className="tag">{item.kind === "articles" ? "Journal" : "Learning note"} · {item.category}</span><p className="eyebrow">{item.kind === "articles" ? "WRITING & REFLECTIONS" : "LEARNING STUDIO"} · {item.readTime}</p><h1>{item.title}</h1><p className="article-description">{item.description}</p><div className="article-meta"><span>{formattedDate}</span><span>{item.level ?? "Pharmacy learning"}</span></div><StudyActions item={{ slug: item.slug, title: item.title, category: item.category, href: `/${item.kind}/${item.slug.split("--").join("/")}` }}/></header><ArticleToc items={headings}/><div id="article-audio-content" className="mdx-prose reading-container">{content}</div><div className="article-end"><span>END OF NOTE</span><span>Educational material · Verify with standard references</span></div><nav className="content-pagination reading-container" aria-label={`More ${item.kind}`}><Link href={`/${item.kind}`} className="content-pagination-home">← Back to {item.kind === "articles" ? "articles" : "learning notes"}</Link><div className="content-pagination-items">{previousItem ? <Link href={`/${item.kind}/${previousItem.slug.split("--").join("/")}`}><span>← PREVIOUS {sectionLabel.toUpperCase()}</span><strong>{previousItem.title}</strong></Link> : <span/>}{nextItem ? <Link href={`/${item.kind}/${nextItem.slug.split("--").join("/")}`}><span>NEXT {sectionLabel.toUpperCase()} →</span><strong>{nextItem.title}</strong></Link> : <span/>}</div></nav></article>;
}
