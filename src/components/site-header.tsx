"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/learning", label: "Learning" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand" aria-label="Harsh Mishra home">Harsh Mishra<span className="brand-dot">.</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className={isActive(link.href) ? "nav-active" : ""} aria-current={isActive(link.href) ? "page" : undefined}>{link.label}</Link>)}
          <span className="nav-divider" aria-hidden="true" />
          <Link href="/search" className={`icon-link${isActive("/search") ? " nav-active" : ""}`} aria-label="Search the site" title="Search" aria-current={isActive("/search") ? "page" : undefined}><Search size={16} strokeWidth={1.7}/></Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
