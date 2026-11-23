"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Bookmark, BookmarkCheck, CheckCircle2, RotateCcw, Trash2 } from "lucide-react";

export type StudyItem = {
  slug: string;
  title: string;
  category: string;
  href: string;
};

type StoredStudyItem = StudyItem & { savedAt: string };

const BOOKMARKS_KEY = "harsh-gpat-bookmarks-v1";
const COMPLETED_KEY = "harsh-gpat-revised-v1";

function readItems(key: string): StoredStudyItem[] {
  try {
    const value = window.localStorage.getItem(key);
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.slug === "string" && typeof item.title === "string") as StoredStudyItem[] : [];
  } catch {
    return [];
  }
}

function writeItems(key: string, items: StoredStudyItem[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Keep the current session usable if browser storage is unavailable.
  }
}

export function StudyActions({ item }: { item: StudyItem }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [revised, setRevised] = useState(false);

  useEffect(() => {
    setBookmarked(readItems(BOOKMARKS_KEY).some((entry) => entry.slug === item.slug));
    setRevised(readItems(COMPLETED_KEY).some((entry) => entry.slug === item.slug));
  }, [item.slug]);

  function toggle(key: string, active: boolean, setActive: (value: boolean) => void) {
    const entries = readItems(key).filter((entry) => entry.slug !== item.slug);
    if (!active) entries.unshift({ ...item, savedAt: new Date().toISOString() });
    writeItems(key, entries);
    setActive(!active);
  }

  return (
    <div className="study-actions" aria-label="Study tracking">
      <button type="button" className={`study-action ${bookmarked ? "is-active" : ""}`} onClick={() => toggle(BOOKMARKS_KEY, bookmarked, setBookmarked)} aria-pressed={bookmarked}>
        {bookmarked ? <BookmarkCheck size={15}/> : <Bookmark size={15}/>}
        {bookmarked ? "Saved for revision" : "Save for revision"}
      </button>
      <button type="button" className={`study-action ${revised ? "is-active" : ""}`} onClick={() => toggle(COMPLETED_KEY, revised, setRevised)} aria-pressed={revised}>
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
  const [bookmarks, setBookmarks] = useState<StoredStudyItem[]>([]);
  const [completed, setCompleted] = useState<StoredStudyItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBookmarks(readItems(BOOKMARKS_KEY));
    setCompleted(readItems(COMPLETED_KEY));
    setLoaded(true);
  }, []);

  function removeBookmark(slug: string) {
    const next = bookmarks.filter((item) => item.slug !== slug);
    setBookmarks(next);
    writeItems(BOOKMARKS_KEY, next);
  }

  function markNotRevised(item: StoredStudyItem) {
    const next = completed.filter((entry) => entry.slug !== item.slug);
    setCompleted(next);
    writeItems(COMPLETED_KEY, next);
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
