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
        <p className="page-lede">Choose a subject, practise with instant explanations, or attempt a 20-minute mock test with answers revealed only after submission. Your best score and recent attempts are saved in this browser.</p>
      </header>
      <div className="practice-intro">
        <BookOpenCheck size={22}/>
        <p><strong>Practice Questions — not official PYQs.</strong><br/>Switch between instant-feedback practice and a timed mock test. Filter the question bank by subject and review every explanation after submission.</p>
        <span>16 QUESTIONS</span>
      </div>
      <PracticeQuiz />
      <div className="practice-footer">
        <p>Want to revise a topic before attempting the set?</p>
        <Link href="/learning">Explore the learning library <ArrowUpRight size={15}/></Link>
      </div>
    </main>
  );
}
