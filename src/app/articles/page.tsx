import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import { getAllContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Short explainers, reflections and practical observations by Harsh Mishra.",
};

export default function ArticlesPage() {
  const items = getAllContent("articles");
  const categories = Array.from(new Set(items.map((item) => item.category)));
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
      <div className="library-toolbar"><span>{items.length} PUBLISHED {items.length === 1 ? "PIECE" : "PIECES"}</span><span>{categories.length} TOPICS</span></div>
      {items.length ? <div className="content-grid">{items.map((item, index) => <ContentCard item={item} index={index} key={item.slug}/>)}</div> :
        <div className="empty-state">The journal is getting started. New writing will appear here when it is ready.</div>}
    </section>
  );
}
