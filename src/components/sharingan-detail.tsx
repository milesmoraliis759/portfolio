"use client";
import { useState } from "react";

export function SharinganDetail() {
  const [revealed, setRevealed] = useState(false);
  return (
    <button type="button" className={`sharingan-detail${revealed ? " is-revealed" : ""}`}
      aria-label={revealed ? "Hide the hidden crimson detail" : "Reveal a hidden crimson detail"}
      aria-pressed={revealed} title="A small secret" onClick={() => setRevealed((value) => !value)}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className="sharingan-ring" cx="24" cy="24" r="19" />
        <circle className="sharingan-core" cx="24" cy="24" r="4" />
        <path className="sharingan-tomoe" d="M24 10c5 0 8 4 7 8-1 3-4 4-7 4-2 0-3-2-3-4 0-2 2-3 3-3 1 0 2 1 2 2" />
        <path className="sharingan-tomoe" d="M36 31c-2 4-7 5-10 2-2-2-2-5-1-7 1-2 3-2 5-1 2 1 2 3 1 4-1 1-2 1-3 0" />
        <path className="sharingan-tomoe" d="M12 31c-3-4-1-9 3-10 3-1 5 1 6 4 1 2 0 4-2 5-2 1-3 0-4-1" />
      </svg>
      <span className="sharingan-hint">{revealed ? "THE WILL" : "SECRET"}</span>
    </button>
  );
}
