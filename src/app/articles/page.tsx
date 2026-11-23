import type { Metadata } from "next";
import { ContentItem, getAllContent } from "@/lib/content";
import { ArticleExplorer } from "@/components/article-explorer";

export const metadata: Metadata = {
  title: "Articles",
  description: "Short explainers, reflections and practical observations by Harsh Mishra.",
};

export default function ArticlesPage() {
  const items = getAllContent("articles");
  return (
    <section className="page-shell container">
      <div className="section-kicker"><span>02</span> / THE JOURNAL</div>
      <div className="page-hero">
        <p className="eyebrow">WRITING & REFLECTIONS</p>
        <h1>Thinking on paper.<br/><em>Learning out loud.</em></h1>
        <p className="page-lede">
          Longer explanations, practical observations and reflections from the
          subjects I study and the environments where pharmacy is practised.
        </p>
      </div>
      <ArticleExplorer items={items} />
    </section>
  );
}
