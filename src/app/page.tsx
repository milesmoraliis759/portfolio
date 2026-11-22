import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, BriefcaseMedical, GraduationCap, Microscope, MoveUpRight } from "lucide-react";
import { ContentCard } from "@/components/content-card";
import { getAllContent, getFeaturedContent } from "@/lib/content";

const interests = [
  { icon: Microscope, title: "Pharmaceutical sciences", text: "Pharmacology, pharmaceutics, medicinal chemistry and the science behind medicines.", href: "/learning" },
  { icon: BriefcaseMedical, title: "Industry & healthcare", text: "What production floors, quality systems and patient-facing practice can teach us.", href: "/experience" },
  { icon: GraduationCap, title: "Learning in public", text: "Clear notes, useful explanations and reflections from a pharmacy student.", href: "/articles" },
];

export default function HomePage() {
  const learning = getAllContent("learning").slice(0, 2);
  const writing = getAllContent("articles").slice(0, 2);
  const featured = getFeaturedContent();
  const total = getAllContent().length;

  return (
    <>
      <section className="medical-hero container">
        <div className="medical-hero-grid">
          <div className="medical-hero-copy">
            <div className="availability"><span className="pulse" /> PHARMACEUTICAL SCIENCES · B.PHARM</div>
            <p className="eyebrow">A STUDENT NOTEBOOK · INDIA</p>
            <h1>Hey, I&apos;m Harsh.<br /><em>Learning how medicines work,</em><br />one mechanism at a time.</h1>
            <p className="hero-lede">
              I&apos;m a Bachelor of Pharmacy student interested in medicines, the science behind them,
              and the people they ultimately serve. This is my notebook: clear study notes, short
              essays and lessons from practical training.
            </p>
            <div className="hero-actions">
              <Link href="/learning" className="button button-primary">Explore learning notes <ArrowRight size={15}/></Link>
              <Link href="/about" className="button button-quiet">A little about me <ArrowUpRight size={15}/></Link>
            </div>
          </div>
          <div className="portrait-column">
            <div className="portrait-frame">
              <Image src="/IMG20250526115110.jpg" alt="Harsh Mishra" fill priority sizes="(max-width: 700px) 230px, 238px" className="portrait-image" />
              <div className="portrait-caption"><span><strong>Harsh Mishra</strong><small>Pharmacy student · India</small></span></div>
            </div>
            <p className="portrait-location">B.PHARM · 2023—2027</p>
          </div>
        </div>
        <div className="profile-facts">
          <span>B.Pharm · 2023–27</span>
          <span>Industrial training · Samson Laboratories</span>
          <span>Postgraduate direction · M.Pharm / NIPER</span>
          <Link href="/experience">My journey <ArrowUpRight size={13}/></Link>
        </div>
      </section>

      <section className="section container">
        <div className="section-kicker"><span>01</span> / WHAT THIS SPACE IS</div>
        <div className="intro-grid">
          <h2>A notebook for<br /><em>curious minds.</em></h2>
          <div>
            <p className="large-copy">
              Pharmacy sits at the meeting point of chemistry, biology, technology and care.
              I&apos;m learning to connect those pieces — from a drug&apos;s molecular structure
              to its formulation, quality and place in patient care.
            </p>
            <Link href="/about" className="underlined-link">More about my approach <MoveUpRight size={15}/></Link>
          </div>
        </div>
      </section>

      <section className="section focus-section">
        <div className="container">
          <div className="section-heading">
            <div><div className="section-kicker"><span>02</span> / EXPLORE</div><h2>Follow a thread of <em>curiosity.</em></h2></div>
            <p className="max-copy">Three ways to explore my academic and practical learning.</p>
          </div>
          <div className="focus-grid">
            {interests.map((item, index) => <article className="focus-card" key={item.title}>
              <span className="focus-number">0{index + 1}</span><item.icon size={23} strokeWidth={1.5}/>
              <h3>{item.title}</h3><p>{item.text}</p>
              <Link href={item.href} aria-label={`Explore ${item.title}`}><ArrowUpRight size={17}/></Link>
            </article>)}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div><div className="section-kicker"><span>03</span> / LEARNING STUDIO</div><h2>Understand first.<br /><em>Memorise later.</em></h2></div>
          <Link href="/learning" className="underlined-link">All learning notes <MoveUpRight size={15}/></Link>
        </div>
        {learning.length ? <div className="content-grid">{learning.map((item, i) => <ContentCard item={item} index={i} key={item.slug}/>)}</div> : <div className="empty-state"><BookOpen size={20}/> New study notes will appear here as they are published.</div>}
      </section>

      <section className="journal-band">
        <div className="container journal-inner">
          <div><p className="eyebrow">THE WRITING DESK</p><h2>Learning becomes clearer<br />when you <em>write it down.</em></h2><p className="journal-copy">Short explainers, longer reflections and practical observations from pharmaceutical sciences.</p></div>
          <Link href="/articles" className="round-link">Read the journal <ArrowUpRight size={18}/></Link>
        </div>
      </section>

      <section className="section container latest-section">
        <div className="section-heading">
          <div><div className="section-kicker"><span>04</span> / RECENT WRITING</div><h2>Notes from the <em>field.</em></h2></div>
          <Link href="/articles" className="underlined-link">All articles <MoveUpRight size={15}/></Link>
        </div>
        {writing.length ? <div className="content-grid">{writing.map((item, i) => <ContentCard item={item} index={i} key={item.slug}/>)}</div> : <div className="empty-state">Articles will appear here as they are published.</div>}
        <p className="fine-print">{total} published pieces across the learning library and journal. The collection grows as I learn.</p>
      </section>
    </>
  );
}
