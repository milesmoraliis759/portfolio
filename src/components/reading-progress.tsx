"use client";

import { useEffect } from "react";

export function ReadingProgress() {
  useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      root.style.setProperty("--reading-progress", `${Math.min(100, Math.max(0, progress))}%`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.documentElement.style.removeProperty("--reading-progress");
    };
  }, []);
  return <div className="reading-progress" aria-hidden="true" />;
}
