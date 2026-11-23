"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowUpRight, Bookmark, BookmarkCheck, CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import { useLocalStorageSnapshot, writeLocalStorageSnapshot } from "@/lib/local-storage";

export type StudyItem = {
  slug: string;
  title: string;
  category: string;
  href: string;
};

type StoredStudyItem = StudyItem & { savedAt: string };

const BOOKMARKS_KEY = "harsh-gpat-bookmarks-v1";
const COMPLETED_KEY = "harsh-gpat-revised-v1";

function parseItems(value: string | null): StoredStudyItem[] {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.slug === "string" && typeof item.title === "string") as StoredStudyItem[]
      : [];
  } catch {
    return [];
  }
}

export function StudyActions({ item }: { item: StudyItem }) {
  const bookmarksSnapshot = useLocalStorageSnapshot(BOOKMARKS_KEY);
  const completedSnapshot = useLocalStorageSnapshot(COMPLETED_KEY);
  const bookmarked = useMemo(() => parseItems(bookmarksSnapshot).some((entry) => entry.slug === item.slug), [bookmarksSnapshot, item.slug]);
  const revised = useMemo(() => parseItems(completedSnapshot).some((entry) => entry.slug === item.slug), [completedSnapshot, item.slug]);

  function toggle(key: string, snapshot: string | null, active: boolean) {
    const entries = parseItems(snapshot).filter((entry) => entry.slug !== item.slug);
    if (!active) entries.unshift({ ...item, savedAt: new Date().toISOString() });
    writeLocalStorageSnapshot(key, JSON.stringify(entries));
  }

  return (
    <div className="study-actions" aria-label="Study tracking">
      <button type="button" className={`study-action ${bookmarked ? "is-active" : ""}`} onClick={() => toggle(BOOKMARKS_KEY, bookmarksSnapshot, bookmarked)} aria-pressed={bookmarked}>
        {bookmarked ? <BookmarkCheck size={15}/> : <Bookmark size={15}/>}
        {bookmarked ? "Saved for revision" : "Save for revision"}
      </button>
      <button type="button" className={`study-action ${revised ? "is-active" : ""}`} onClick={() => toggle(COMPLETED_KEY, completedSnapshot, revised)} aria-pressed={revised}>
        <CheckCircle2 size={15}/>
        {revised ? "Revised" : "Mark as revised"}
      </button>
    </div>
  );
}

function StudyList({ title, items, empty, onRemove, onToggle }: {
  title: string;
  items: StoredStudyItem[];
  empty: string;
  onRemove?: (slug: string) => void;
  onToggle?: (item: StoredStudyItem) => void;
}) {
  return (
    <section className="revision-section">
      <div className="revision-section-heading"><h2>{title}</h2><span>{String(items.length).padStart(2, "0")}</span></div>
      {items.length ? <div className="revision-list">
        {items.map((item) => <article className="revision-item" key={item.slug}>
          <div className="revision-item-copy"><span className="tag">{item.category}</span><Link href={item.href}><h3>{item.title}</h3></Link></div>
          <div className="revision-item-actions">
            {onToggle ? <button type="button" className="revision-icon-button" onClick={() => onToggle(item)} aria-label="Mark as not revised" title="Mark as not revised"><RotateCcw size={15}/></button> : null}
            {onRemove ? <button type="button" className="revision-icon-button" onClick={() => onRemove(item.slug)} aria-label="Remove bookmark" title="Remove bookmark"><Trash2 size={15}/></button> : null}
            <Link href={item.href} className="revision-open" aria-label={`Open ${item.title}`}><ArrowUpRight size={17}/></Link>
          </div>
        </article>)}
      </div> : <p className="revision-empty">{empty}</p>}
    </section>
  );
}

export function RevisionDashboard() {
  const bookmarksSnapshot = useLocalStorageSnapshot(BOOKMARKS_KEY);
  const completedSnapshot = useLocalStorageSnapshot(COMPLETED_KEY);
  const bookmarks = useMemo(() => parseItems(bookmarksSnapshot), [bookmarksSnapshot]);
  const completed = useMemo(() => parseItems(completedSnapshot), [completedSnapshot]);
  const loaded = bookmarksSnapshot !== null && completedSnapshot !== null;

  function removeBookmark(slug: string) {
    writeLocalStorageSnapshot(BOOKMARKS_KEY, JSON.stringify(bookmarks.filter((item) => item.slug !== slug)));
  }

  function markNotRevised(item: StoredStudyItem) {
    writeLocalStorageSnapshot(COMPLETED_KEY, JSON.stringify(completed.filter((entry) => entry.slug !== item.slug)));
  }

  return (
    <div className="revision-dashboard">
      <div className="revision-stats">
        <div><span>BOOKMARKED</span><strong>{loaded ? bookmarks.length : "—"}</strong></div>
        <div><span>REVISED</span><strong>{loaded ? completed.length : "—"}</strong></div>
      </div>
      {!loaded ? <p className="revision-empty">Loading your revision desk…</p> : <>
        <StudyList title="Saved for revision" items={bookmarks} empty="No saved notes yet. Open a learning note and choose “Save for revision”." onRemove={removeBookmark}/>
        <StudyList title="Marked as revised" items={completed} empty="Nothing marked as revised yet. Use the study controls inside any learning note." onToggle={markNotRevised}/>
      </>}
      <p className="revision-privacy">Your bookmarks and revision marks are stored only in this browser on this device. Clearing browser site data will clear this list.</p>
    </div>
  );
}
