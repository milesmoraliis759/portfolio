import Link from "next/link";
import { BookOpen,FlaskConical } from "lucide-react";
const links=[{href:"/about",label:"About"},{href:"/experience",label:"Experience"},{href:"/projects",label:"Projects"},{href:"/articles",label:"Articles"},{href:"/learning",label:"Learning"}];
export function SiteHeader(){return <header className="site-header"><div className="container nav-wrap"><Link href="/" className="brand" aria-label="Harsh Mishra home"><span className="brand-mark"><FlaskConical size={18}/></span><span>harsh<span className="brand-dot">.</span></span></Link><nav className="main-nav" aria-label="Main navigation">{links.map(x=><Link key={x.href} href={x.href}>{x.label}</Link>)}</nav><Link href="/contact" className="nav-cta"><BookOpen size={15}/> Let&apos;s connect</Link></div></header>}
