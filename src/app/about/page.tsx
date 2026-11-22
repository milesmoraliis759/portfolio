import type { Metadata } from "next";
import { ArrowUpRight, GraduationCap, Microscope, NotebookPen } from "lucide-react";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="page-shell container">
      <div className="section-kicker"><span>01</span> / ABOUT ME</div>
      <div className="about-hero-grid">
        <div className="page-hero">
          <p className="eyebrow">BACHELOR OF PHARMACY · INDIA</p>
          <h1>Science with<br /><em>a human purpose.</em></h1>
          <p className="page-lede">I&apos;m Harsh Mishra, a pharmacy student interested in understanding medicines, the science behind them and the care that brings them to people.</p>
        </div>
        <div className="about-photo portrait-placeholder" role="img" aria-label="Harsh Mishra profile monogram">
          <span className="portrait-monogram">HM</span>
        </div>
      </div>
      <div className="about-columns">
        <div><h2>A little about<br /><em>my journey.</em></h2></div>
        <div className="prose">
          <p>I&apos;m pursuing a Bachelor of Pharmacy and building my understanding across pharmacology, pharmaceutics, pharmacognosy, medicinal chemistry and pharmaceutical analysis.</p>
          <p>Practical training has helped me connect classroom concepts with pharmaceutical production, quality practices and healthcare workflows. I value learning how medicines are developed, manufactured, evaluated and used responsibly.</p>
          <p>This website is my professional notebook: a place to document my academic journey, share clear learning resources and reflect on what I discover along the way.</p>
        </div>
      </div>
      <div className="values-grid">
        <article><GraduationCap /><h3>Learn with purpose</h3><p>Build sound scientific fundamentals and keep asking questions.</p></article>
        <article><Microscope /><h3>Respect the science</h3><p>Understand the evidence, process and quality behind medicines.</p></article>
        <article><NotebookPen /><h3>Share knowledge</h3><p>Make complex pharmacy concepts easier for fellow learners.</p></article>
      </div>
      <div className="callout-strip"><span>HAVE A QUESTION OR IDEA?</span><a href="mailto:mishraharsh759@gmail.com">Let&apos;s connect <ArrowUpRight size={15} /></a></div>
    </section>
  );
}
