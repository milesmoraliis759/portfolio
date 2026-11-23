import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpenCheck } from "lucide-react";
import { PracticeQuiz } from "./quiz-client";

export const metadata: Metadata = {
  title: "GPAT Practice",
  description: "A mixed-subject interactive practice set for B.Pharm and GPAT revision.",
};

export default function PracticePage() {
  return (
    <main className="page-shell container">
      <div className="section-kicker"><span>02</span> / PRACTICE LAB</div>
      <header className="page-hero">
        <p className="eyebrow">RECALL · APPLY · REVIEW</p>
        <h1>Test what you <em>understand.</em></h1>
        <p className="page-lede">A short mixed-subject GPAT practice set. Choose an answer to reveal the explanation, move between questions, and review your score at the end.</p>
      </header>
      <div className="practice-intro">
        <BookOpenCheck size={22}/>
        <p><strong>Practice Questions — not official PYQs.</strong><br/>This starter set is designed to check core concepts across major B.Pharm subjects.</p>
        <span>12 QUESTIONS</span>
      </div>
      <PracticeQuiz />
      <div className="practice-footer">
        <p>Want to revise a topic before attempting the set?</p>
        <Link href="/learning">Explore the learning library <ArrowUpRight size={15}/></Link>
      </div>
    </main>
  );
}
