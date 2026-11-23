import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookmarkCheck } from "lucide-react";
import { RevisionDashboard } from "@/components/study-tools";

export const metadata: Metadata = {
  title: "Revision Desk",
  description: "Your locally saved B.Pharm study bookmarks and revision checklist.",
};

export default function RevisionPage() {
  return (
    <main className="page-shell container">
      <div className="section-kicker"><span>03</span> / REVISION DESK</div>
      <header className="page-hero">
        <p className="eyebrow">SAVE · REVISIT · CONSOLIDATE</p>
        <h1>Keep your revision <em>on track.</em></h1>
        <p className="page-lede">Save important lessons for later and mark topics as revised when you have reviewed them. Your list stays in this browser on this device.</p>
      </header>
      <div className="practice-intro">
        <BookmarkCheck size={22}/>
        <p><strong>A lightweight study tracker.</strong><br/>Use bookmarks for topics you want to revisit and the revised list as your personal checklist.</p>
      </div>
      <RevisionDashboard />
      <div className="practice-footer">
        <p>Need another concept to work through?</p>
        <Link href="/learning">Browse learning notes <ArrowUpRight size={15}/></Link>
      </div>
    </main>
  );
}
