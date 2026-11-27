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
const mdxComponents = {
  Callout, Definition, DrugCard, Formula, ProcessFlow, QuickCheck, LessonQuiz,
  table: (props: ComponentProps<"table">) => <div className="table-scroll" role="region" aria-label="Scrollable data table" tabIndex={0}><table {...props}/></div>,
};
export default async function ContentPage({ params }: Props) {
  const result = await resolve(params);
  if (!result) notFound();
  const { content } = await compileMDX({ source: result.source, components: mdxComponents, options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm] } } });
  const { item } = result;
  const siblings = getAllContent(item.kind).filter((entry) => entry.category === item.category);
  const currentIndex = siblings.findIndex((entry) => entry.slug === item.slug);
  const previousItem = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;
  const sectionLabel = item.kind === "articles" ? "article" : "lesson";
  const formattedDate = item.date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.date)) : "Student notes";
  return <article className="article-shell"><ReadingProgress/><header className="article-heading reading-container"><span className="tag">{item.kind === "articles" ? "Journal" : "Learning note"} · {item.category}</span><p className="eyebrow">{item.kind === "articles" ? "WRITING & REFLECTIONS" : "LEARNING STUDIO"} · {item.readTime}</p><h1>{item.title}</h1><p className="article-description">{item.description}</p><div className="article-meta"><span>{formattedDate}</span><span>{item.level ?? "Pharmacy learning"}</span></div><StudyActions item={{ slug: item.slug, title: item.title, category: item.category, href: `/${item.kind}/${item.slug.split("--").join("/")}` }}/></header><div className="mdx-prose reading-container">{content}</div><div className="article-end"><span>END OF NOTE</span><span>Educational material · Verify with standard references</span></div><nav className="content-pagination reading-container" aria-label={`More ${item.kind}`}><Link href={`/${item.kind}`} className="content-pagination-home">← Back to {item.kind === "articles" ? "articles" : "learning notes"}</Link><div className="content-pagination-items">{previousItem ? <Link href={`/${item.kind}/${previousItem.slug.split("--").join("/")}`}><span>← PREVIOUS {sectionLabel.toUpperCase()}</span><strong>{previousItem.title}</strong></Link> : <span/>}{nextItem ? <Link href={`/${item.kind}/${nextItem.slug.split("--").join("/")}`}><span>NEXT {sectionLabel.toUpperCase()} →</span><strong>{nextItem.title}</strong></Link> : <span/>}</div></nav></article>;
}
