import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/learning", label: "Learning" },
  { href: "/practice", label: "Practice" },
  { href: "/articles", label: "Writing" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand" aria-label="Harsh Mishra home">Harsh Mishra<span className="brand-dot">.</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          <span className="nav-divider" aria-hidden="true" />
          <Link href="/search" className="icon-link" aria-label="Search the site" title="Search"><Search size={16} strokeWidth={1.7}/></Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
