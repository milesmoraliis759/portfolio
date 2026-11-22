"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type SearchEntry = {
  slug: string;
  kind: "articles" | "learning";
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
};

export function SearchPanel({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return entries.filter((entry) =>
      [entry.title, entry.description, entry.category, entry.kind].join(" ").toLowerCase().includes(term)
    );
  }, [entries, query]);

  return (
    <>
      <label className="search-form">
        <span className="sr-only">Search notes and articles</span>
        <span className="search-field-icon"><Search size={17}/></span>
        <input className="search-input" type="search" autoFocus placeholder="Try HPLC, pharmacology, dissolution…" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <div className="search-results" aria-live="polite">
        {!query.trim() ? <p className="muted">Search across published learning notes and articles.</p> :
          results.length ? results.map((entry) => <Link className="search-result" key={`${entry.kind}-${entry.slug}`} href={`/${entry.kind}/${entry.slug.replace(/--/g, "/")}`}>
            <span className="tag">{entry.kind === "learning" ? "Learning note" : "Article"} · {entry.category}</span>
            <h2>{entry.title}</h2><p>{entry.description}</p>
            <span className="search-result-meta">{entry.date} · {entry.readTime}</span>
          </Link>) : <div className="empty-state">No matches yet. Try a broader pharmacy topic.</div>}
      </div>
    </>
  );
}
