"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/learning", label: "Learning" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [selectedHref, setSelectedHref] = useState(pathname);

  useEffect(() => {
    setSelectedHref(pathname);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand" aria-label="Harsh Mishra home">Harsh Mishra<span className="brand-dot">.</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map((link) => {
            const active = selectedHref === link.href || selectedHref.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "nav-item is-active" : "nav-item"}
                aria-current={active ? "page" : undefined}
                onClick={() => setSelectedHref(link.href)}
              >
                {link.label}
              </Link>
            );
          })}
          <span className="nav-divider" aria-hidden="true" />
          <Link href="/search" className="icon-link" aria-label="Search the site" title="Search"><Search size={16} strokeWidth={1.7}/></Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
