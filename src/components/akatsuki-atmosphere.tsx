"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AkatsukiAtmosphere() {
  const pathname = usePathname();
  const rainyPage = pathname === "/search" || pathname.startsWith("/articles") || pathname.startsWith("/learning/");

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };
    const parallax = () => {
      if (reducedMotion.matches) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--moon-parallax-y", `${Math.min(window.scrollY * 0.055, 72)}px`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", parallax, { passive: true });
    parallax();
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", parallax);
      if (frame) cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty("--pointer-x");
      document.documentElement.style.removeProperty("--pointer-y");
      document.documentElement.style.removeProperty("--moon-parallax-y");
    };
  }, []);

  return (
    <div className={`akatsuki-atmosphere${rainyPage ? " akatsuki-atmosphere--rain" : ""}`} aria-hidden="true">
      <div className="akatsuki-moon" />
      <div className="akatsuki-cloudscape akatsuki-cloudscape--distant" />
      <div className="akatsuki-cloudscape akatsuki-cloudscape--near" />
      <svg className="akatsuki-cloud-mark akatsuki-cloud-mark--one" viewBox="0 0 160 92" fill="none"><path d="M17 56c-8-4-10-13-4-20 5-6 13-8 22-6 1-13 13-22 27-20 9 1 16 7 19 16 11-7 25-5 32 4 5 7 5 16 0 22 9 1 16 7 17 15 1 10-8 18-20 18H37c-13 0-23-8-23-18 0-5 1-8 3-11Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/></svg>
      <svg className="akatsuki-cloud-mark akatsuki-cloud-mark--two" viewBox="0 0 160 92" fill="none"><path d="M17 56c-8-4-10-13-4-20 5-6 13-8 22-6 1-13 13-22 27-20 9 1 16 7 19 16 11-7 25-5 32 4 5 7 5 16 0 22 9 1 16 7 17 15 1 10-8 18-20 18H37c-13 0-23-8-23-18 0-5 1-8 3-11Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/></svg>
      <div className="akatsuki-cursor-glow" />
      <div className="akatsuki-grain" />
      <div className="akatsuki-rain" />
    </div>
  );
}
