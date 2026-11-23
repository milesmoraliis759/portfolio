"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ContentCard } from "@/components/content-card";
import type { ContentItem } from "@/lib/content";

export function ArticleExplorer({ items }: { items: ContentItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((item) => item.category))).sort()], [items]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const haystack = [item.title, item.description, item.category].join(" ").toLowerCase();
      return matchesCategory && (!needle || haystack.includes(needle));
    });
  }, [items, query, category]);

  return (
    <>
      <div className="article-explorer">
        <label className="article-search">
          <Search size={16} aria-hidden="true"/>
          <span className="sr-only">Search articles</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics, ideas or keywords…" />
        </label>
        <div className="article-filter-label"><SlidersHorizontal size={14}/> FILTER BY TOPIC</div>
        <div className="article-filters" aria-label="Filter articles by topic">
          {categories.map((value) => <button key={value} type="button" className={category === value ? "is-active" : ""} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}
        </div>
      </div>
      <div className="library-toolbar"><span>{filtered.length} {filtered.length === 1 ? "ARTICLE" : "ARTICLES"}</span><span>{items.length} PUBLISHED</span></div>
      {filtered.length ? <div className="content-grid">{filtered.map((item, index) => <ContentCard item={item} index={index} key={item.slug}/>)}</div> :
        <div className="empty-state">No articles match that search. Try another keyword or choose “All”.</div>}
    </>
  );
}
