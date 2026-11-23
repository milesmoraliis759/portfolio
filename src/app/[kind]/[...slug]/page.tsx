import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  const formattedDate = item.date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(item.date)) : "Student notes";
  return <article className="article-shell"><ReadingProgress/><header className="article-heading reading-container"><span className="tag">{item.kind === "articles" ? "Journal" : "Learning note"} · {item.category}</span><p className="eyebrow">{item.kind === "articles" ? "WRITING & REFLECTIONS" : "LEARNING STUDIO"} · {item.readTime}</p><h1>{item.title}</h1><p className="article-description">{item.description}</p><div className="article-meta"><span>{formattedDate}</span><span>{item.level ?? "Pharmacy learning"}</span></div><StudyActions item={{ slug: item.slug, title: item.title, category: item.category, href: `/${item.kind}/${item.slug.split("--").join("/")}` }}/></header><div className="mdx-prose">{content}</div><div className="article-end"><span>END OF NOTE</span><span>Educational material · Verify with standard references</span></div></article>;
}
