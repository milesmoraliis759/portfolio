import Link from "next/link";
import { ArrowUpRight, Linkedin, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-main">
          <div className="footer-akatsuki-mark" aria-label="Original crimson cloud emblem">
            <svg viewBox="0 0 160 92" fill="none" aria-hidden="true"><path d="M17 56c-8-4-10-13-4-20 5-6 13-8 22-6 1-13 13-22 27-20 9 1 16 7 19 16 11-7 25-5 32 4 5 7 5 16 0 22 9 1 16 7 17 15 1 10-8 18-20 18H37c-13 0-23-8-23-18 0-5 1-8 3-11Z" stroke="currentColor" strokeWidth="7" strokeLinejoin="round"/></svg>
            <span>THE CRIMSON JOURNAL</span>
          </div>
          <p className="eyebrow">PHARMACEUTICAL SCIENCES · LEARNING JOURNAL</p>
          <h2>Keep asking <em>why.</em></h2>
          <p className="footer-copy">A student’s notebook of medicines, mechanisms and the practical work behind healthcare.</p>
        </div>
        <div className="footer-links">
          <Link href="mailto:mishraharsh759@gmail.com"><Mail size={15}/> Email</Link>
          <Link href="https://www.linkedin.com/in/harshmishra759/" target="_blank" rel="noopener noreferrer"><Linkedin size={15}/> LinkedIn <ArrowUpRight size={12}/></Link>
          <Link href="/contact">Contact page <ArrowUpRight size={12}/></Link>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Harsh Mishra</span>
          <span>Educational notes · Not medical advice</span>
          <Link href="/rss.xml">RSS feed</Link>
        </div>
      </div>
    </footer>
  );
}
