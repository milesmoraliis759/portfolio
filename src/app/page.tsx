import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, BriefcaseMedical, FileText, GraduationCap, Microscope } from "lucide-react";

const destinations = [
  {
    number: "01",
    icon: Microscope,
    title: "Learning notes",
    description: "My B.Pharm study notes, concept explanations and GPAT-focused learning material.",
    href: "/learning",
    action: "Explore learning",
  },
  {
    number: "02",
    icon: FileText,
    title: "Articles",
    description: "Longer explainers, study reflections and things I have learned along the way.",
    href: "/articles",
    action: "Read articles",
  },
  {
    number: "03",
    icon: BriefcaseMedical,
    title: "Experience",
    description: "Industrial training, hospital exposure and the practical side of pharmacy.",
    href: "/experience",
    action: "View experience",
  },
  {
    number: "04",
    icon: GraduationCap,
    title: "About me",
    description: "My academic background, interests and the direction I am working towards.",
    href: "/about",
    action: "More about me",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="portfolio-home container akatsuki-home">
        <div className="akatsuki-hero-seal" aria-hidden="true">
          <span className="akatsuki-seal-kanji">暁</span>
          <svg viewBox="0 0 240 150" fill="none" role="presentation">
            <circle cx="120" cy="75" r="62" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="120" cy="75" r="53" stroke="currentColor" strokeWidth=".7" strokeDasharray="2 7" />
            <path d="M36 88c-12-6-14-19-5-28 7-8 19-10 31-7 2-18 18-30 36-27 13 2 22 10 26 23 15-9 34-7 44 6 7 9 7 22 0 30 13 1 22 10 23 21 1 14-11 25-28 25H66c-18 0-32-11-32-25 0-7 1-12 2-18Z" stroke="currentColor" strokeWidth="5" strokeLinejoin="round"/>
          </svg>
          <small>THE CRIMSON ARCHIVE</small>
        </div>
        <div className="portfolio-home-intro">
          <div className="portfolio-home-copy">
            <p className="eyebrow"><span className="portfolio-status-dot" /> THE CRIMSON ARCHIVE · INDIA</p>
            <h1>Harsh Mishra<span>.</span></h1>
            <p className="portfolio-home-role">B.Pharm student · Pharmaceutical sciences · Lifelong learner</p>
            <p className="portfolio-home-summary">
              I’m a pharmacy student interested in understanding how medicines work,
              how they are developed and how quality is built into the products
              people rely on. I use this space to document what I’m learning and
              the experiences shaping my journey in pharmacy.
            </p>
            <div className="portfolio-home-links">
              <Link href="/about" className="button button-primary">More about me <ArrowUpRight size={15}/></Link>
              <Link href="/experience" className="button button-quiet">My experience <ArrowUpRight size={15}/></Link>
            </div>
          </div>
          <div className="portfolio-home-portrait">
            <div className="portfolio-home-photo">
              <Image src="/IMG20250526115110.jpg" alt="Harsh Mishra" fill priority sizes="(max-width: 700px) 250px, 300px" />
            </div>
            <p>B.PHARM · 2023—2027</p>
          </div>
        </div>

        <div className="portfolio-home-meta" aria-label="Academic profile">
          <span>Bachelor of Pharmacy · 2023–2027</span>
          <span>Pharmaceutical sciences</span>
          <span>GPAT / NIPER preparation</span>
        </div>
      </section>

      <section className="portfolio-destinations">
        <div className="container">
          <div className="portfolio-destinations-heading">
            <div>
              <p className="eyebrow">SELECT A DESTINATION · 01—04</p>
              <h2>Enter the archive.<br/><em>Explore my journey.</em></h2>
            </div>
            <p>Choose a section to explore my academic work, writing and experiences in pharmacy.</p>
          </div>

          <div className="portfolio-destination-list">
            {destinations.map((item) => (
              <Link className="portfolio-destination" href={item.href} key={item.href}>
                <span className="portfolio-destination-number">{item.number}</span>
                <item.icon className="portfolio-destination-icon" size={21} strokeWidth={1.6}/>
                <span className="portfolio-destination-copy">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>
                <span className="portfolio-destination-action">{item.action} <ArrowUpRight size={15}/></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-home-note container">
        <BookOpen size={18}/>
        <p>This is a personal portfolio and a record of my development as a pharmacy student. The detailed notes, quizzes and study resources live in the learning section.</p>
      </section>
    </main>
  );
}
