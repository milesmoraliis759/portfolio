"use client";

import { useState } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";

export type TocItem = { id: string; title: string; level: 2 | 3 };

export function ArticleToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);
  if (items.length < 3) return null;

  return (
    <nav className={`article-toc reading-container ${open ? "is-open" : "is-closed"}`} aria-label="Table of contents">
      <div className="article-toc-header">
        <div className="article-toc-title"><List size={17} aria-hidden="true"/><span>ON THIS PAGE</span><small>{items.length} sections</small></div>
        <button type="button" className="article-toc-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          {open ? "Collapse" : "Show contents"} {open ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
        </button>
      </div>
      {open && <ol className="article-toc-list">
        {items.map((item) => <li key={item.id} className={item.level === 3 ? "is-nested" : ""}>
          <a href={`#${item.id}`} onClick={(event) => {
            const target = document.getElementById(item.id);
            if (target) {
              event.preventDefault();
              target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
              window.history.replaceState(null, "", `#${item.id}`);
            }
          }}>{item.title}</a>
        </li>)}
      </ol>}
    </nav>
  );
}
