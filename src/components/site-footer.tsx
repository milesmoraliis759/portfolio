import Link from "next/link";
import { ArrowUpRight, Linkedin, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-main">
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
