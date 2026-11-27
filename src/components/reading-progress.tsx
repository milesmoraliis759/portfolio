"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [percentage, setPercentage] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const root = document.documentElement;
        const max = root.scrollHeight - window.innerHeight;
        const value = max > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100))) : 0;
        root.style.setProperty("--reading-progress", `${value}%`);
        setPercentage(value);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.documentElement.style.removeProperty("--reading-progress");
    };
  }, []);
  return <>
    <div className="reading-progress" role="progressbar" aria-label="Article reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}/>
    <span className="reading-progress-label" aria-live="off">{percentage}% read</span>
  </>;
}
