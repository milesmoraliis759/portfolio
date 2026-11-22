import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, GraduationCap } from "lucide-react";
import { ContentCard } from "@/components/content-card";
import { getAllContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Learning Studio",
  description: "Clear, student-written revision notes across pharmaceutical sciences.",
};

const subjectDescriptions: Record<string, string> = {
  Pharmaceutics: "Dosage forms, formulation science, physical pharmacy and quality testing.",
  "Pharmaceutical Analysis": "Analytical methods, instrumentation and pharmaceutical quality evaluation.",
  Pharmacology: "Drug actions, mechanisms, therapeutic classes and pharmacological principles.",
  "Medicinal Chemistry": "Drug structures, structure–activity relationships and chemical properties.",
  Pharmacognosy: "Natural drugs, crude drug evaluation and plant-derived constituents.",
};

export default function LearningPage() {
  const items = getAllContent("learning");
  const groups = Array.from(new Set(items.map((item) => item.category))).sort();
  return (
    <section className="page-shell container">
      <div className="section-kicker"><span>01</span> / THE LEARNING STUDIO</div>
      <div className="page-hero">
        <p className="eyebrow">A NOTEBOOK FOR PHARMACY STUDENTS</p>
        <h1>Understand first.<br/><em>Memorise later.</em></h1>
        <p className="page-lede">
          Short, structured notes I write while studying. Each topic aims to make
          the underlying idea clear before moving into classifications, comparisons
          and exam-focused details.
        </p>
      </div>
      <div className="learning-banner">
        <GraduationCap size={28}/>
        <div><strong>Learn the concept. Then revise the detail.</strong><p>Use these notes alongside standard textbooks, pharmacopoeias and course material.</p></div>
        <BookOpenCheck size={26}/>
      </div>
      <div className="library-toolbar">
        <span>{items.length} PUBLISHED {items.length === 1 ? "NOTE" : "NOTES"}</span>
        <span>{groups.length} SUBJECT {groups.length === 1 ? "TRACK" : "TRACKS"}</span>
      </div>
      {items.length ? groups.map((group) => {
        const trackItems = items.filter((item) => item.category === group);
        return <section className="library-group" key={group}>
          <div className="track-heading">
            <div><p className="eyebrow">SUBJECT TRACK</p><h2>{group}</h2><p>{subjectDescriptions[group] ?? "Study notes and explanations from this area of pharmaceutical sciences."}</p></div>
            <span className="track-count">{String(trackItems.length).padStart(2, "0")} NOTES</span>
          </div>
          <div className="content-grid">{trackItems.map((item, index) => <ContentCard item={item} index={index} key={item.slug}/>)}</div>
        </section>;
      }) : <div className="empty-state">No learning notes have been published yet. New topics will appear here when they are ready.</div>}
      <div className="learning-method">
        <div className="section-kicker"><span>02</span> / HOW TO USE THIS LIBRARY</div>
        <div className="learning-method-grid">
          <div><span>01</span><h3>Build the idea</h3><p>Start with the principle and the meaning of unfamiliar terms.</p></div>
          <div><span>02</span><h3>Compare and connect</h3><p>Use tables and examples to understand how related concepts differ.</p></div>
          <div><span>03</span><h3>Return to the source</h3><p>Check the cited references and your prescribed textbooks before exams.</p></div>
        </div>
      </div>
      <p className="fine-print">These are student learning notes for educational use, not clinical guidance or a substitute for standard references.</p>
      <Link href="/search" className="underlined-link">Search the learning library <ArrowUpRight size={15}/></Link>
    </section>
  );
}
