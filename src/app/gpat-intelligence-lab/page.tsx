import type { Metadata } from "next";
import { GpatIntelligenceLab } from "./lab-client";

export const metadata: Metadata = {
  title: "GPAT Intelligence Lab",
  description: "A source-attributed GPAT practice and learning environment built around know, connect, apply and master.",
};

export default function GpatIntelligenceLabPage() {
  return <main className="page-shell container"><GpatIntelligenceLab /></main>;
}
