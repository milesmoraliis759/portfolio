import type { Metadata } from "next";
import { SearchPanel } from "@/components/search-panel";
import { getAllContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Harsh Mishra's pharmaceutical science learning notes and articles.",
};

export default function SearchPage() {
  const entries = getAllContent().map(({ slug, kind, title, description, category, date, readTime }) =>
    ({ slug, kind, title, description, category, date, readTime })
  );
  return (
    <section className="page-shell container">
      <div className="section-kicker"><span>00</span> / SITE SEARCH</div>
      <div className="page-hero">
        <p className="eyebrow">FIND A CONCEPT</p>
        <h1>Look it <em>up.</em></h1>
        <p className="page-lede">Search the published notes and writing by topic, subject or title.</p>
      </div>
      <SearchPanel entries={entries}/>
    </section>
  );
}
