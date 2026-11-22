import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Microscope, NotebookPen } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "About Harsh Mishra, a B.Pharm student learning pharmaceutical sciences.",
};

export default function AboutPage() {
  return (
    <section className="page-shell container">
      <div className="section-kicker"><span>01</span> / ABOUT ME</div>
      <div className="about-hero-grid">
        <div className="page-hero">
          <p className="eyebrow">BACHELOR OF PHARMACY · INDIA</p>
          <h1>Curiosity, grounded<br/>in <em>science.</em></h1>
          <p className="page-lede">
            I&apos;m Harsh Mishra, a pharmacy student learning how medicines are discovered,
            developed, evaluated and used — and how good science supports better care.
          </p>
        </div>
        <div className="about-photo">
          <Image src="/IMG20250526115110.jpg" alt="Harsh Mishra" fill sizes="(max-width: 700px) 230px, 238px" />
        </div>
      </div>

      <div className="about-columns">
        <div><h2>Why <em>pharmacy?</em></h2></div>
        <div className="prose">
          <p>
            Pharmacy brings together subjects I enjoy learning: chemistry, biology,
            physiology, formulation science and the careful evaluation of medicines.
            I&apos;m interested in understanding not only what a drug does, but why it
            behaves that way and how its quality is assessed.
          </p>
          <p>
            My B.Pharm studies have given me a foundation across pharmacology,
            pharmaceutics, pharmacognosy, medicinal chemistry and pharmaceutical
            analysis. Industrial and hospital training have helped me see how
            classroom knowledge connects with production processes, quality
            practices and healthcare workflows.
          </p>
          <p>
            I created this site as a public learning notebook. I use it to organise
            concepts, write clearer explanations and share useful material with
            other pharmacy students. I&apos;m still learning, and I want the work here
            to show that process honestly.
          </p>
        </div>
      </div>

      <div className="section-kicker" style={{marginTop: 46}}><span>02</span> / HOW I APPROACH LEARNING</div>
      <div className="values-grid">
        <article><Microscope/><h3>Understand the mechanism</h3><p>Build concepts from first principles before memorising classifications and facts.</p></article>
        <article><BookOpen/><h3>Return to reliable sources</h3><p>Use standard references and keep scientific claims connected to their sources.</p></article>
        <article><NotebookPen/><h3>Explain it clearly</h3><p>Turn what I learn into concise notes, comparisons and practical takeaways.</p></article>
      </div>
      <div className="callout-strip"><span>THIS IS A STUDENT-LED LEARNING PROJECT</span><Link href="/learning">Explore the learning studio <ArrowUpRight size={15}/></Link></div>
    </section>
  );
}
