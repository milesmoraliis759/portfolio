"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ContentCard } from "@/components/content-card";
import type { ContentItem } from "@/lib/content";

export function LearningExplorer({ items }: { items: ContentItem[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All subjects");
  const subjects = useMemo(
    () => ["All subjects", ...Array.from(new Set(items.map((item) => item.category))).sort()],
    [items],
  );
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return items.filter((item) => {
      const matchesSubject = subject === "All subjects" || item.category === subject;
      const searchable = [item.title, item.description, item.category, ...item.tags].join(" ").toLocaleLowerCase();
      return matchesSubject && (!needle || searchable.includes(needle));
    });
  }, [items, query, subject]);

  return (
    <section className="learning-explorer" aria-label="Browse learning notes">
      <div className="learning-explorer-tools">
        <label className="learning-search">
          <Search size={17} aria-hidden="true"/>
          <span className="sr-only">Search learning notes</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a concept, drug, instrument or topic…"/>
          {query ? <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={15}/></button> : null}
        </label>
        <div className="learning-filter-label"><SlidersHorizontal size={14}/> BROWSE BY SUBJECT</div>
        <div className="learning-subject-filters" role="group" aria-label="Filter notes by subject">
          {subjects.map((value) => <button key={value} type="button" className={subject === value ? "is-active" : ""} aria-pressed={subject === value} onClick={() => setSubject(value)}>{value}</button>)}
        </div>
      </div>
      <div className="library-toolbar" aria-live="polite">
        <span>{filtered.length} {filtered.length === 1 ? "NOTE" : "NOTES"}</span>
        <span>{subject === "All subjects" ? "ALL SUBJECTS" : subject.toUpperCase()}</span>
      </div>
      {filtered.length ? (
        <div className="content-grid">{filtered.map((item, index) => <ContentCard item={item} index={index} key={item.slug}/>)}</div>
      ) : (
        <div className="empty-state">
          <strong>No notes found.</strong>
          <p>Try a different keyword or clear the subject filter.</p>
          <button type="button" onClick={() => { setQuery(""); setSubject("All subjects"); }}>Clear filters</button>
        </div>
      )}
    </section>
  );
}
