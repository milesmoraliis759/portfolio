import type { Metadata } from "next";
import { GpatIntelligenceLab } from "./lab-client";

export const metadata: Metadata = {
  title: "GPAT Practice Quiz",
  description: "A simple GPAT quiz with scores and clear answer explanations.",
};

export default function GpatIntelligenceLabPage() {
  return <main className="page-shell container"><GpatIntelligenceLab /></main>;
}
