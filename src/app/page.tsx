import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseMedical,
  GraduationCap,
  Microscope,
  MoveUpRight,
  Mail,
  Linkedin,
} from "lucide-react";
import { ContentCard } from "@/components/content-card";
import { getAllContent, getFeaturedContent } from "@/lib/content";

const focus = [
  {
    icon: Microscope,
    title: "Pharmaceutical sciences",
    text: "Pharmacology, pharmaceutics, medicinal chemistry and the science behind medicines.",
  },
  {
    icon: BriefcaseMedical,
    title: "Industry & healthcare",
    text: "Learning from pharmaceutical production, quality practices and patient-oriented care.",
  },
  {
    icon: GraduationCap,
    title: "Academic growth",
    text: "Building strong fundamentals and sharing useful notes for pharmacy learners.",
  },
];

export default function HomePage() {
  const featured = getFeaturedContent();
  const articles = getAllContent("articles").slice(0, 2);

  return (
    <>
      <section className="medical-hero container">
        <div className="medical-hero-grid">
          <div className="medical-hero-copy">
            <div className="availability">
              <span className="pulse" /> PHARMACY · SCIENCE · ALWAYS LEARNING
            </div>
            <p className="eyebrow">BACHELOR OF PHARMACY · INDIA</p>
            <h1>
              Hello, I&apos;m Harsh Mishra.
              <br />
              <em>Pharmaceutical sciences,</em>
              <br />
              understood with purpose.
            </h1>
            <p className="hero-lede">
              I&apos;m a pharmacy student interested in medicines, pharmaceutical
              science and the people they ultimately serve. This is where I
              document what I learn, the practical experience I gain and the
              questions that keep me curious.
            </p>
            <div className="profile-links">
              <a href="mailto:mishraharsh759@gmail.com"><Mail size={13} /> mishraharsh759@gmail.com</a>
              <a href="https://www.linkedin.com/in/harshmishra759/" target="_blank" rel="noreferrer"><Linkedin size={13} /> LinkedIn</a>
              <Link href="/experience"><BriefcaseMedical size={13} /> Training & experience</Link>
            </div>
          </div>
          <div className="portrait-column">
            <div className="portrait-frame portrait-placeholder" role="img" aria-label="Harsh Mishra profile monogram">
              <span className="portrait-monogram">HM</span>
              <span className="portrait-caption">
                <span>
                  <strong>Harsh Mishra</strong>
                  <small>Pharmacy student · India</small>
                </span>
              </span>
            </div>
            <p className="portrait-location">PHARMACY STUDENT · INDIA</p>
          </div>
        </div>
        <div className="profile-facts">
          <span>B.Pharm · 2023–27</span>
          <span>Industrial training · Samson Laboratories</span>
          <span>Learning · GPAT / NIPER</span>
          <Link href="/articles">Read my notes <ArrowUpRight size={13} /></Link>
        </div>
      </section>

      <section className="section container intro-section">
        <div className="section-kicker"><span>01</span> / A LITTLE INTRODUCTION</div>
        <div className="intro-grid">
          <h2>Learning the science.<br /><em>Respecting its impact.</em></h2>
          <div>
            <p className="large-copy">
              Pharmacy brings together chemistry, biology, technology and
              healthcare. I&apos;m building my foundation one concept, one
              practical experience and one thoughtful question at a time.
            </p>
            <Link href="/about" className="underlined-link">A little more about me <MoveUpRight size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="section focus-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-kicker"><span>02</span> / AREAS OF INTEREST</div>
              <h2>A growing field of <em>curiosity.</em></h2>
            </div>
            <p className="muted max-copy">The subjects and experiences shaping my journey in pharmaceutical sciences.</p>
          </div>
          <div className="focus-grid">
            {focus.map((item, index) => (
              <article className="focus-card" key={item.title}>
                <span className="focus-number">0{index + 1}</span>
                <item.icon size={23} strokeWidth={1.4} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Link href={index === 1 ? "/experience" : "/learning"} aria-label={`Explore ${item.title}`}>
                  <ArrowUpRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container featured-section">
        <div className="section-heading">
          <div>
            <div className="section-kicker"><span>03</span> / THE LEARNING LIBRARY</div>
            <h2>Notes worth <em>sharing.</em></h2>
          </div>
          <Link href="/learning" className="underlined-link">Browse learning notes <MoveUpRight size={15} /></Link>
        </div>
        {featured.length ? (
          <div className="content-grid">
            {featured.map((item, index) => <ContentCard item={item} index={index} key={item.slug} />)}
          </div>
        ) : (
          <div className="empty-state"><BookOpen size={22} /><p>Learning notes will appear here as they are published.</p></div>
        )}
      </section>

      <section className="journal-band">
        <div className="container journal-inner">
          <div>
            <p className="eyebrow">THE WRITING DESK</p>
            <h2>Ideas become clearer<br />when <em>you write them down.</em></h2>
            <p className="journal-copy">Articles, explainers and reflections from pharmaceutical sciences and student life.</p>
          </div>
          <Link href="/articles" className="round-link">Explore articles <ArrowUpRight size={18} /></Link>
        </div>
      </section>

      <section className="section container latest-section">
        <div className="section-heading">
          <div>
            <div className="section-kicker"><span>04</span> / RECENT WRITING</div>
            <h2>From the <em>journal.</em></h2>
          </div>
          <Link href="/articles" className="underlined-link">All articles <MoveUpRight size={15} /></Link>
        </div>
        {articles.length ? (
          <div className="content-grid">
            {articles.map((item, index) => <ContentCard item={item} index={index} key={item.slug} />)}
          </div>
        ) : (
          <div className="empty-state">Articles will appear here as they are published in the content repository.</div>
        )}
      </section>
    </>
  );
}
