import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, GraduationCap, ClipboardList, FileText, RotateCcw } from "lucide-react";
import { LearningExplorer } from "@/components/learning-explorer";
import { getAllContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Learning Studio",
  description: "Clear, student-written revision notes across pharmaceutical sciences.",
};

export default function LearningPage() {
  const items = getAllContent("learning");

  return (
    <section className="page-shell container learning-archive">
      <div className="section-kicker"><span>01</span> / THE LEARNING STUDIO</div>
      <div className="page-hero akatsuki-learning-hero">
        <div className="akatsuki-learning-art" aria-hidden="true"><span>暁</span><small>AMEGAKURE · THE RED CLOUDS</small></div>
        <p className="eyebrow">A NOTEBOOK FOR PHARMACY STUDENTS</p>
        <h1>Understand first.<br/><em>Memorise later.</em></h1>
        <p className="page-lede">
          Short, structured notes I write while studying. Each topic aims to make
          the underlying idea clear before moving into classifications, comparisons
          and exam-focused details.
        </p>
      </div>
      <nav className="learning-studio-tabs" aria-label="Learning Studio navigation">
        <Link href="/learning" aria-current="page">Learning Library</Link>
        <Link href="/practice">Practice Lab</Link>
        <Link href="/pyqs">PYQs</Link>
        <Link href="/revision">Revision Desk</Link>
        <Link href="/gpat-intelligence-lab" className="is-featured">GPAT Intelligence Lab <span>NEW</span></Link>
      </nav>
      <div className="learning-banner">
        <GraduationCap size={28}/>
        <div><strong>Learn the concept. Then revise the detail.</strong><p>Use these notes alongside standard textbooks, pharmacopoeias and course material.</p></div>
        <BookOpenCheck size={26}/>
      </div>
      <div className="learning-tools" aria-label="Study tools">
        <Link href="/practice"><ClipboardList size={17}/><span><strong>Practice quiz</strong><small>40 concept questions</small></span><ArrowUpRight size={14}/></Link>
        <Link href="/pyqs"><FileText size={17}/><span><strong>Previous-year questions</strong><small>Source-based GPAT practice</small></span><ArrowUpRight size={14}/></Link>
        <Link href="/revision"><RotateCcw size={17}/><span><strong>Revision desk</strong><small>Your saved and revised notes</small></span><ArrowUpRight size={14}/></Link>
      </div>
      <LearningExplorer items={items}/>
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
