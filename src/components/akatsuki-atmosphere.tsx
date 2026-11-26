"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AkatsukiAtmosphere() {
  const pathname = usePathname();
  const rainyPage = pathname === "/search" || pathname.startsWith("/articles") || pathname.startsWith("/learning/");
  const scene = pathname === "/" ? "home"
    : pathname.startsWith("/learning") ? "learning"
    : pathname.startsWith("/articles") ? "articles"
    : pathname.startsWith("/about") ? "about"
    : pathname.startsWith("/experience") ? "experience"
    : pathname.startsWith("/search") ? "search"
    : pathname.startsWith("/contact") ? "contact"
    : "dojo";

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pointerFrame = 0;
    let scrollFrame = 0;
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };
    const parallax = () => {
      if (reducedMotion.matches || scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--scene-parallax-y", `${Math.min(window.scrollY * 0.035, 48)}px`);
        scrollFrame = 0;
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", parallax, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", parallax);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      document.documentElement.style.removeProperty("--pointer-x");
      document.documentElement.style.removeProperty("--pointer-y");
      document.documentElement.style.removeProperty("--scene-parallax-y");
    };
  }, []);

  return (
    <div className={`akatsuki-atmosphere akatsuki-atmosphere--${scene}${rainyPage ? " akatsuki-atmosphere--rain" : ""}`} aria-hidden="true">
      <div className="akatsuki-cursor-glow" />
      <div className="akatsuki-grain" />
      <div className="akatsuki-rain" />
    </div>
  );
}
