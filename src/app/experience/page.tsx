import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ClipboardCheck, Factory, Hospital, GraduationCap, FlaskConical } from "lucide-react";

export const metadata: Metadata = {
  title: "Experience",
  description: "Industrial and hospital training, practical exposure and academic development by Harsh Mishra.",
};

const skillGroups = [
  { title: "Production exposure", detail: "Equipment purpose, process sequence, material movement and the importance of following product-specific instructions.", skills: ["RMG", "Multi Mill", "Sifter", "FBD", "Blender"] },
  { title: "Quality mindset", detail: "The role of documentation, equipment status, approved procedures and escalation of deviations.", skills: ["GMP", "SOPs", "Batch records", "QA / QC awareness"] },
  { title: "Academic foundation", detail: "Connecting core B.Pharm subjects with practical examples and focused competitive-exam revision.", skills: ["Pharmacology", "Pharmaceutics", "Medicinal Chemistry", "Pharmacognosy"] },
];

export default function ExperiencePage() {
  return (
    <section className="page-shell container">
      <div className="section-kicker"><span>03</span> / EXPERIENCE & DEVELOPMENT</div>
      <div className="page-hero">
        <p className="eyebrow">LEARNING BEYOND THE CLASSROOM</p>
        <h1>Where theory<br/><em>meets practice.</em></h1>
        <p className="page-lede">
          Practical training helps me connect academic concepts with the real workflows
          behind medicine production and healthcare. This page records learning and
          exposure—not claims of independent professional responsibility.
        </p>
      </div>
      <div className="timeline">
        <article className="timeline-item">
          <div className="timeline-icon"><Factory/></div>
          <div>
            <span className="tag">INDUSTRIAL TRAINING</span>
            <h2>Pharmaceutical production</h2>
            <p className="timeline-meta">Samson Laboratories · Barotiwala</p>
            <p>
              Training exposure in pharmaceutical production, including solid dosage-form
              processes and time in the liquid department. I focused on understanding
              equipment purpose, process sequence, material handling, documentation and
              the discipline expected under GMP.
            </p>
            <div className="chip-row"><span>RMG</span><span>Multi Mill</span><span>Sifter</span><span>FBD</span><span>Blender</span><span>GMP</span><span>SOPs</span></div>
          </div>
        </article>
        <article className="timeline-item">
          <div className="timeline-icon"><Hospital/></div>
          <div>
            <span className="tag">HOSPITAL & COMMUNITY EXPOSURE</span>
            <h2>Hospital pharmacy and healthcare workflows</h2>
            <p className="timeline-meta">Community Health Centre, Dubeypur · District Women’s Hospital, Ayodhya</p>
            <p>
              Hospital training gave me an opportunity to observe pharmacy-related
              workflows and the role of medicines in patient care. It strengthened my
              awareness of medicine handling, prescription processes, communication
              and the importance of accuracy in healthcare settings.
            </p>
            <div className="chip-row"><span>Hospital workflow</span><span>Medicine handling</span><span>Patient-oriented care</span><span>Medication safety awareness</span></div>
          </div>
        </article>
        <article className="timeline-item">
          <div className="timeline-icon"><GraduationCap/></div>
          <div>
            <span className="tag">ACADEMIC DEVELOPMENT</span>
            <h2>Bachelor of Pharmacy</h2>
            <p className="timeline-meta">B.Pharm · 2023–2027</p>
            <p>
              Building a foundation across pharmaceutical sciences through coursework,
              practical learning and structured revision. My interests include
              pharmacology, pharmaceutics, medicinal chemistry, pharmacognosy and
              pharmaceutical analysis.
            </p>
            <div className="chip-row"><span>Core pharmacy subjects</span><span>Practical records</span><span>Concept revision</span></div>
          </div>
        </article>
        <article className="timeline-item">
          <div className="timeline-icon"><FlaskConical/></div>
          <div>
            <span className="tag">CONTINUOUS DEVELOPMENT</span>
            <h2>GPAT and NIPER preparation</h2>
            <p className="timeline-meta">Independent study and knowledge building</p>
            <p>
              I use exam-oriented revision to strengthen fundamentals, connect mechanisms
              with drug classes and practise applying concepts to objective questions.
              The notes published here are part of that ongoing learning process.
            </p>
            <div className="chip-row"><span>Mechanisms</span><span>Drug classifications</span><span>Practice questions</span><span>Revision notes</span></div>
          </div>
        </article>
      </div>

      <section className="skills-section">
        <div className="section-kicker"><span>01</span> / WHAT I’M BUILDING</div>
        <div className="skills-grid">
          {skillGroups.map((group) => <article key={group.title}>
            <h3>{group.title}</h3><p>{group.detail}</p>
            <div className="chip-row">{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          </article>)}
        </div>
      </section>
      <p className="fine-print">
        Training descriptions are student learning summaries. They do not imply
        independent release, testing, prescribing or clinical decision-making authority.
        No patient-identifiable or confidential company information is published.
      </p>
      <div className="callout-strip">
        <span>EXPLORE THE SUBJECT NOTES</span>
        <Link href="/learning">Open learning library <ArrowUpRight size={15}/></Link>
      </div>
    </section>
  );
}
