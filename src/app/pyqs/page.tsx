import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { PyqPractice } from "./pyq-client";

export const metadata: Metadata = {
  title: "GPAT Previous Year Questions",
  description: "Source-traceable, adapted GPAT previous-year question practice from the uploaded question-paper compilation.",
};

export default function PyqPage() {
  return <main className="page-shell container">
    <div className="section-kicker"><span>04</span> / PREVIOUS YEAR QUESTIONS</div>
    <header className="page-hero">
      <p className="eyebrow">PAST PAPERS · EXAM PATTERNS · CONCEPTS</p>
      <h1>Learn from the <em>questions that came.</em></h1>
      <p className="page-lede">A separate PYQ revision area sourced from your merged GPAT paper compilation. Questions below are paraphrased for learning, with the source answer key and concept explanations kept distinct from our generated practice bank.</p>
    </header>
    <div className="practice-intro pyq-source-note">
      <FileText size={22}/>
      <p><strong>Source: Merged_GPAT_PYQs.pdf</strong><br/>The first section is headed “GPAT 2024 Questions & Answer Key” in the supplied file. Its following page also carries a “2022.1” footer marker, so the year attribution needs cross-checking against the original paper before being treated as definitive.</p>
      <span>9 ITEMS</span>
    </div>
    <PyqPractice />
    <div className="practice-footer">
      <p>Want to build the concepts behind these questions?</p>
      <Link href="/learning">Open the learning library <ArrowUpRight size={15}/></Link>
    </div>
  </main>;
}
