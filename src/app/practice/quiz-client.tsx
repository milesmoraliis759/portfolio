"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorageSnapshot, writeLocalStorageSnapshot } from "@/lib/local-storage";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, RotateCcw, Target, XCircle } from "lucide-react";

type Question = {
  id: number;
  subject: string;
  topic: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

type Attempt = {
  score: number;
  total: number;
  mode: "practice" | "mock";
  topic: string;
  completedAt: string;
};

const ATTEMPTS_KEY = "harsh-gpat-practice-attempts-v1";
const MOCK_SECONDS = 20 * 60;

const questions: Question[] = [
  { id: 1, subject: "Pharmaceutics", topic: "Tablet excipients", prompt: "Which excipient primarily reduces friction between the tablet and die wall during ejection?", options: ["Binder", "Lubricant", "Disintegrant", "Diluent"], answer: 1, explanation: "Lubricants reduce die-wall friction. Magnesium stearate is a commonly used tablet lubricant." },
  { id: 2, subject: "Pharmaceutics", topic: "Wet granulation", prompt: "Which equipment is commonly used to dry wet granules?", options: ["Multimill", "Friabilator", "Fluid bed dryer", "Dissolution tester"], answer: 2, explanation: "A fluid bed dryer passes conditioned air through the granules, supporting heat and mass transfer." },
  { id: 3, subject: "Physical Pharmacy", topic: "Buffer solutions", prompt: "When the salt-to-acid ratio in an acidic buffer is 1, the pH equals:", options: ["7", "pKb", "pKa", "14"], answer: 2, explanation: "By Henderson–Hasselbalch, pH = pKa + log(1), and log(1) is zero." },
  { id: 4, subject: "Pharmacology", topic: "RAAS and ACE inhibitors", prompt: "Enalapril lowers blood pressure primarily by inhibiting:", options: ["Renin", "ACE", "AT1 receptor", "Aldosterone receptor"], answer: 1, explanation: "Enalapril is an ACE inhibitor. It reduces conversion of angiotensin I to angiotensin II." },
  { id: 5, subject: "Pharmacology", topic: "Calcium channel blockers", prompt: "Which adverse effect is especially associated with verapamil?", options: ["Constipation", "Ototoxicity", "Dry cough", "Hypertrichosis"], answer: 0, explanation: "Verapamil slows AV conduction and can reduce gastrointestinal motility, causing constipation." },
  { id: 6, subject: "Medicinal Chemistry", topic: "Sulfonamides", prompt: "Sulfonamide antibacterials competitively inhibit:", options: ["Dihydrofolate reductase", "DNA gyrase", "Dihydropteroate synthase", "Transpeptidase"], answer: 2, explanation: "Sulfonamides are PABA analogues and inhibit bacterial dihydropteroate synthase (DHPS)." },
  { id: 7, subject: "Pharmacognosy", topic: "Alkaloid identification tests", prompt: "Dragendorff reagent is a general screening reagent for:", options: ["Alkaloids", "Proteins", "Carbohydrates", "Fixed oils"], answer: 0, explanation: "Dragendorff reagent (potassium bismuth iodide) commonly gives an orange to reddish precipitate with alkaloids." },
  { id: 8, subject: "Pharmacognosy", topic: "Alkaloid classification", prompt: "Atropine is classified as a:", options: ["Indole alkaloid", "Tropane alkaloid", "Purine alkaloid", "Quinoline alkaloid"], answer: 1, explanation: "Atropine is a tropane alkaloid obtained from Solanaceae plants such as Atropa belladonna." },
  { id: 9, subject: "Pharmaceutical Analysis", topic: "Beer–Lambert law", prompt: "If transmittance is 0.01, what is the absorbance?", options: ["0.01", "1", "2", "10"], answer: 2, explanation: "A = −log₁₀(T) = −log₁₀(0.01) = 2." },
  { id: 10, subject: "Industrial Pharmacy", topic: "Equipment qualification", prompt: "Which qualification stage documents that equipment is installed according to specification?", options: ["OQ", "PQ", "IQ", "Process validation"], answer: 2, explanation: "Installation Qualification (IQ) verifies and documents that equipment is installed as specified." },
  { id: 11, subject: "Pharmaceutics", topic: "Tablet evaluation", prompt: "Which test evaluates a tablet's resistance to abrasion and shock during handling?", options: ["Friability", "Disintegration", "Content uniformity", "Dissolution"], answer: 0, explanation: "The friability test evaluates mass loss from tablets exposed to a defined tumbling / abrasion procedure." },
  { id: 12, subject: "Pharmaceutical Analysis", topic: "Beer–Lambert law", prompt: "In the Beer–Lambert equation A = εbc, absorbance is directly proportional to:", options: ["Concentration and path length", "Transmittance", "Stray light", "Only wavelength"], answer: 0, explanation: "At a fixed wavelength and under ideal conditions, absorbance is proportional to concentration and optical path length." },
  { id: 13, subject: "Biopharmaceutics", topic: "Bioavailability", prompt: "Which pharmacokinetic parameter is most directly associated with the extent of systemic exposure?", options: ["Tmax", "AUC", "Tablet friability", "Disintegration time"], answer: 1, explanation: "AUC represents total systemic exposure over the measured concentration–time interval." },
  { id: 14, subject: "Pharmaceutical Microbiology", topic: "Sterilization", prompt: "What is the principal sterilising agent in an autoclave?", options: ["Dry air", "Saturated steam", "UV radiation", "Ethylene oxide"], answer: 1, explanation: "Autoclaving uses saturated steam under pressure to deliver moist heat effectively." },
  { id: 15, subject: "Pharmaceutical Biotechnology", topic: "PCR", prompt: "Which PCR step allows primers to bind complementary DNA sequences?", options: ["Denaturation", "Annealing", "Extension", "Elution"], answer: 1, explanation: "During annealing, the temperature is lowered to allow primers to hybridise with the template." },
  { id: 16, subject: "Pharmaceutical Jurisprudence", topic: "Drugs and Cosmetics Rules", prompt: "Which schedule is associated with GMP requirements for Ayurvedic, Siddha and Unani medicines?", options: ["Schedule M", "Schedule N", "Schedule T", "Schedule P"], answer: 2, explanation: "Schedule T contains GMP requirements for Ayurvedic, Siddha and Unani medicines." },

  { id: 17, subject: "Pharmaceutics", topic: "Coating", prompt: "The primary purpose of an enteric coating is to:", options: ["Increase tablet sweetness", "Prevent release in the stomach", "Increase tablet weight only", "Improve powder flow"], answer: 1, explanation: "Enteric polymers resist the acidic gastric environment and are designed to release the drug at the higher pH of the intestine." },
  { id: 18, subject: "Pharmaceutics", topic: "Superdisintegrants", prompt: "Which of the following is a superdisintegrant?", options: ["Ethyl cellulose", "Croscarmellose sodium", "Magnesium stearate", "Talc"], answer: 1, explanation: "Croscarmellose sodium is a cross-linked cellulose derivative that promotes rapid tablet breakup through swelling and wicking." },
  { id: 19, subject: "Physical Pharmacy", topic: "Powder flow", prompt: "For powders of otherwise comparable properties, a lower angle of repose generally indicates:", options: ["Better flow", "Higher hygroscopicity", "Greater compressibility only", "Lower particle density"], answer: 0, explanation: "A smaller angle of repose generally indicates less interparticle resistance and better flow, although no single test fully characterises powder flow." },
  { id: 20, subject: "Physical Pharmacy", topic: "Drug release kinetics", prompt: "In the Higuchi model, cumulative drug release per unit area is proportional to:", options: ["Time", "Square root of time", "Inverse square root of time", "Time squared"], answer: 1, explanation: "The classical Higuchi model describes diffusion-controlled release from a matrix, with amount released proportional to the square root of time under its assumptions." },
  { id: 21, subject: "Biopharmaceutics", topic: "Routes and first-pass metabolism", prompt: "Which route can help bypass hepatic first-pass metabolism for a drug absorbed through the oral mucosa?", options: ["Swallowed oral tablet", "Sublingual", "Oral suspension", "Enteric-coated oral tablet"], answer: 1, explanation: "Sublingual absorption enters systemic venous circulation and can avoid the initial hepatic first-pass effect." },
  { id: 22, subject: "Pharmacology", topic: "Cholinergic antagonists", prompt: "Atropine produces its principal effects by acting as a:", options: ["Muscarinic receptor agonist", "Competitive muscarinic receptor antagonist", "Nicotinic receptor agonist", "Acetylcholinesterase activator"], answer: 1, explanation: "Atropine competitively blocks muscarinic acetylcholine receptors, reducing parasympathetic responses." },
  { id: 23, subject: "Pharmacology", topic: "Anticoagulants", prompt: "Heparin exerts its anticoagulant effect mainly by enhancing the activity of:", options: ["Vitamin K", "Antithrombin", "Plasminogen", "Cyclooxygenase"], answer: 1, explanation: "Heparin binds antithrombin and accelerates inhibition of activated coagulation factors, particularly thrombin and factor Xa." },
  { id: 24, subject: "Pharmacology", topic: "Loop diuretics", prompt: "Furosemide inhibits which transporter in the thick ascending limb of the loop of Henle?", options: ["Na⁺/Cl⁻ cotransporter", "Na⁺/K⁺/2Cl⁻ cotransporter", "Na⁺/H⁺ exchanger", "Epithelial sodium channel"], answer: 1, explanation: "Furosemide blocks the NKCC2 cotransporter in the thick ascending limb, producing potent natriuresis." },
  { id: 25, subject: "Medicinal Chemistry", topic: "Antitubercular drugs", prompt: "Rifampicin inhibits bacterial DNA-dependent RNA synthesis by targeting:", options: ["DNA gyrase", "DNA-dependent RNA polymerase", "Dihydrofolate reductase", "Mycolic acid synthase only"], answer: 1, explanation: "Rifampicin binds the beta subunit of bacterial DNA-dependent RNA polymerase and inhibits RNA synthesis." },
  { id: 26, subject: "Medicinal Chemistry", topic: "Antitubercular drugs", prompt: "Isoniazid primarily inhibits the synthesis of:", options: ["Peptidoglycan", "Mycolic acids", "Ergosterol", "Folic acid"], answer: 1, explanation: "Isoniazid is a prodrug activated by KatG and inhibits InhA, disrupting mycolic-acid synthesis in mycobacteria." },
  { id: 27, subject: "Pharmacology", topic: "NSAIDs and antiplatelets", prompt: "Aspirin inhibits platelet cyclooxygenase by:", options: ["Reversible competitive binding", "Irreversible acetylation", "Blocking P2Y12 receptors", "Activating thromboxane receptors"], answer: 1, explanation: "Aspirin irreversibly acetylates COX, reducing thromboxane A2 formation for the lifespan of the affected platelet." },
  { id: 28, subject: "Pharmacology", topic: "Opioid analgesics", prompt: "The principal receptor responsible for morphine's analgesic effect is the:", options: ["Mu opioid receptor", "GABA-A receptor", "D2 receptor", "H1 receptor"], answer: 0, explanation: "Morphine is primarily a mu-opioid receptor agonist; activation produces analgesia and also contributes to respiratory depression and other opioid effects." },
  { id: 29, subject: "Pharmacognosy", topic: "Saponins", prompt: "A characteristic preliminary test for many saponins is the:", options: ["Persistent froth test", "Borntrager test", "Murexide test", "Ninhydrin test"], answer: 0, explanation: "Many saponins produce stable froth in aqueous solution because they have surface-active properties." },
  { id: 30, subject: "Pharmacognosy", topic: "Volatile oils", prompt: "A common method used to isolate many volatile oils from plant materials is:", options: ["Steam distillation", "Kjeldahl digestion", "Ashing", "Paper electrophoresis"], answer: 0, explanation: "Steam distillation is widely used for volatile oils because the oils co-distil with steam at temperatures below their individual boiling points." },
  { id: 31, subject: "Pharmacognosy", topic: "Glycosides", prompt: "A glycoside consists broadly of:", options: ["Two amino acids", "A sugar part and a non-sugar aglycone", "Only fatty acids", "A nucleotide and phosphate"], answer: 1, explanation: "A glycoside contains a glycone (sugar) linked to an aglycone (non-sugar) component." },
  { id: 32, subject: "Pharmaceutical Analysis", topic: "Thin-layer chromatography", prompt: "In TLC, the Rf value is calculated as:", options: ["Distance travelled by solvent / distance travelled by solute", "Distance travelled by solute / distance travelled by solvent front", "Spot area / plate area", "Solvent volume / sample volume"], answer: 1, explanation: "Rf is the distance travelled by the centre of the analyte spot divided by the distance travelled by the solvent front from the same origin." },
  { id: 33, subject: "Pharmaceutical Analysis", topic: "HPLC instrumentation", prompt: "Which detector is commonly used in routine HPLC analysis of UV-absorbing compounds?", options: ["UV-visible absorbance detector", "Flame ionisation detector", "Thermal conductivity detector", "Geiger counter"], answer: 0, explanation: "UV-visible absorbance detectors are widely used in HPLC when the analyte has a suitable chromophore." },
  { id: 34, subject: "Pharmaceutical Analysis", topic: "IR spectroscopy", prompt: "A strong absorption band near 1700 cm⁻¹ commonly suggests the presence of a:", options: ["Carbonyl group", "Alkyl C–H group only", "Halogen atom only", "Nitrate ion only"], answer: 0, explanation: "Carbonyl stretching commonly appears in the approximate 1650–1800 cm⁻¹ region, with the exact position depending on functional-group environment." },
  { id: 35, subject: "Pharmaceutical Microbiology", topic: "Sterilizing filtration", prompt: "A commonly used nominal pore size for sterilizing-grade filtration of many aqueous solutions is:", options: ["2.2 μm", "0.22 μm", "22 μm", "220 μm"], answer: 1, explanation: "A 0.22 μm sterilizing-grade membrane is commonly used for many aqueous solutions, but filter suitability and integrity must be validated." },
  { id: 36, subject: "Pharmaceutical Microbiology", topic: "Bacterial endotoxins", prompt: "The Limulus Amebocyte Lysate (LAL) test is used to detect:", options: ["Bacterial endotoxins", "Residual solvents", "Heavy metals", "Fungal spores"], answer: 0, explanation: "The LAL test detects endotoxins, particularly lipopolysaccharide from Gram-negative bacteria." },
  { id: 37, subject: "Pharmaceutical Microbiology", topic: "Biological indicators", prompt: "Which organism is commonly used as a biological indicator for moist-heat sterilization?", options: ["Escherichia coli", "Geobacillus stearothermophilus", "Candida albicans", "Staphylococcus epidermidis"], answer: 1, explanation: "Geobacillus stearothermophilus spores are commonly used to challenge moist-heat sterilization processes." },
  { id: 38, subject: "Industrial Pharmacy", topic: "Equipment qualification", prompt: "Operational Qualification (OQ) primarily verifies that:", options: ["Equipment has been delivered", "Equipment operates as intended throughout specified operating ranges", "The final product is clinically effective", "The supplier has been paid"], answer: 1, explanation: "OQ documents that equipment functions as intended across defined operating ranges and conditions." },
  { id: 39, subject: "Industrial Pharmacy", topic: "Good documentation practices", prompt: "Which principle is central to reliable GMP documentation?", options: ["Record data from memory at the end of the week", "Make entries contemporaneously and ensure they are attributable", "Use correction fluid to hide mistakes", "Share one login between operators"], answer: 1, explanation: "Good documentation practices require attributable, legible, contemporaneous, original and accurate records, with appropriate controls for corrections and audit trails." },
  { id: 40, subject: "Pharmaceutical Jurisprudence", topic: "Drugs and Cosmetics Rules", prompt: "Schedule H1 of the Drugs and Cosmetics Rules is associated with:", options: ["Minimum pharmacy equipment", "Additional sale and record-keeping controls for specified drugs", "GMP for ASU medicines", "Shelf-life tables only"], answer: 1, explanation: "Schedule H1 identifies specified drugs subject to prescription-related controls and additional record-keeping requirements under the Rules." },
];

function readAttempts(value: string | null): Attempt[] {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item.score === "number" && typeof item.total === "number") as Attempt[] : [];
  } catch {
    return [];
  }
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function PracticeQuiz() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [mode, setMode] = useState<"practice" | "mock">("practice");
  const [subject, setSubject] = useState("All subjects");
  const [remaining, setRemaining] = useState(MOCK_SECONDS);
  const attemptsSnapshot = useLocalStorageSnapshot(ATTEMPTS_KEY);
  const attempts = useMemo(() => readAttempts(attemptsSnapshot), [attemptsSnapshot]);
  const loaded = attemptsSnapshot !== null;
  const savedAttempt = useRef(false);

  const subjects = useMemo(() => ["All subjects", ...Array.from(new Set(questions.map((q) => q.subject)))], []);
  const activeQuestions = useMemo(() => subject === "All subjects" ? questions : questions.filter((q) => q.subject === subject), [subject]);
  const current = activeQuestions[index];
  const answered = current ? answers[current.id] !== undefined : false;
  const score = useMemo(() => activeQuestions.filter((q) => answers[q.id] === q.answer).length, [activeQuestions, answers]);
  const progress = activeQuestions.filter((q) => answers[q.id] !== undefined).length;
  const bestPercent = attempts.length ? Math.max(...attempts.map((a) => Math.round((a.score / a.total) * 100))) : 0;
  const isFinished = finished || (mode === "mock" && remaining === 0);

  useEffect(() => {
    if (mode !== "mock" || isFinished) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [mode, isFinished]);

  useEffect(() => {
    if (!isFinished || !loaded || savedAttempt.current || activeQuestions.length === 0) return;
    const record: Attempt = { score, total: activeQuestions.length, mode, topic: subject, completedAt: new Date().toISOString() };
    const next = [record, ...attempts].slice(0, 20);
    savedAttempt.current = true;
    writeLocalStorageSnapshot(ATTEMPTS_KEY, JSON.stringify(next));
  }, [isFinished, loaded, activeQuestions, score, mode, subject, attempts]);

  function reset(nextMode: "practice" | "mock" = mode, nextSubject = subject) {
    setIndex(0);
    setAnswers({});
    setFinished(false);
    setMode(nextMode);
    setSubject(nextSubject);
    setRemaining(MOCK_SECONDS);
    savedAttempt.current = false;
  }

  function choose(option: number) {
    if (isFinished || !current) return;
    setAnswers((previous) => ({ ...previous, [current.id]: option }));
  }

  const restart = () => reset(mode, subject);
  const reveal = mode === "practice" && answered;

  if (isFinished) {
    return (
      <section className="quiz-panel">
        <div className="quiz-result-icon"><Target size={27}/></div>
        <p className="eyebrow">{mode === "mock" ? "MOCK TEST SUBMITTED" : "PRACTICE SET COMPLETE"}</p>
        <h2>{score} <span>/ {activeQuestions.length}</span></h2>
        <p className="quiz-result-copy">{score >= activeQuestions.length * 0.8 ? "Strong work. Move on to tougher application questions." : score >= activeQuestions.length * 0.55 ? "Good foundation. Review the explanations for the questions you missed." : "Use this as a diagnostic. Revisit the concepts, then try again."}</p>
        <div className="quiz-score-track"><span style={{ width: `${(score / activeQuestions.length) * 100}%` }}/></div>
        <div className="quiz-attempt-summary"><span>{loaded ? attempts.length : "—"} saved attempts</span><span>Best score: {loaded && attempts.length ? `${bestPercent}%` : "—"}</span></div>
        <div className="quiz-review">
          <h3>Answer review</h3>
          {activeQuestions.map((q, i) => {
            const correct = answers[q.id] === q.answer;
            return <article className="quiz-review-item" key={q.id}>
              <div className="quiz-review-top"><span>Q{i + 1} · {q.subject} · {q.topic}</span>{correct ? <CheckCircle2 size={16} aria-label="Correct"/> : <XCircle size={16} aria-label="Incorrect"/>}</div>
              <strong>{q.prompt}</strong>
              <p>Your answer: {answers[q.id] === undefined ? "Not answered" : q.options[answers[q.id]]}</p>
              <p>Correct answer: {q.options[q.answer]}</p>
              <small>{q.explanation}</small>
            </article>;
          })}
        </div>
        <button className="quiz-primary-button" onClick={restart}><RotateCcw size={16}/> Retake {mode === "mock" ? "mock test" : "practice set"}</button>
      </section>
    );
  }

  return (
    <section className="quiz-panel">
      <div className="quiz-mode-switch" role="group" aria-label="Assessment mode">
        <button type="button" className={mode === "practice" ? "is-active" : ""} onClick={() => reset("practice")}>Practice mode</button>
        <button type="button" className={mode === "mock" ? "is-active" : ""} onClick={() => reset("mock")}>Timed mock test</button>
      </div>
      <div className="quiz-filter-row">
        <label htmlFor="quiz-subject">Subject filter</label>
        <select id="quiz-subject" value={subject} onChange={(event) => reset(mode, event.target.value)}>
          {subjects.map((name) => <option value={name} key={name}>{name}</option>)}
        </select>
      </div>
      <div className="quiz-topline"><span>QUESTION {String(index + 1).padStart(2, "0")} / {activeQuestions.length}</span><span>{progress} ANSWERED</span></div>
      <div className="quiz-progress"><span style={{ width: `${((index + 1) / activeQuestions.length) * 100}%` }}/></div>
      <div className="quiz-question-meta"><span className="tag">{current.subject}</span><span className="quiz-progress-text">{current.topic}</span>{mode === "mock" ? <span className="quiz-timer"><Clock3 size={14}/>{formatTime(remaining)}</span> : null}</div>
      <h2 className="quiz-question">{current.prompt}</h2>
      <div className="quiz-options">
        {current.options.map((option, i) => {
          const selected = answers[current.id] === i;
          const correct = i === current.answer;
          const showAnswer = reveal || isFinished;
          const state = showAnswer && correct ? "correct" : showAnswer && selected && !correct ? "incorrect" : selected ? "selected" : "";
          return <button type="button" key={option} className={`quiz-option ${state}`} onClick={() => choose(i)} aria-pressed={selected}>
            <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>
            {showAnswer && correct ? <CheckCircle2 size={17}/> : showAnswer && selected ? <XCircle size={17}/> : null}
          </button>;
        })}
      </div>
      {reveal ? <div className={`quiz-feedback ${answers[current.id] === current.answer ? "is-correct" : "is-incorrect"}`}>
        <strong>{answers[current.id] === current.answer ? "Correct." : "Not quite."}</strong> {current.explanation}
      </div> : mode === "mock" ? <p className="quiz-hint">Answers and explanations stay hidden until you submit the mock test.</p> : <p className="quiz-hint">Select an option to reveal the answer and explanation.</p>}
      <div className="quiz-navigation">
        <button type="button" className="quiz-secondary-button" onClick={() => setIndex((n) => Math.max(0, n - 1))} disabled={index === 0}><ArrowLeft size={15}/> Previous</button>
        {mode === "mock" ? <button type="button" className="quiz-secondary-button" onClick={() => setFinished(true)}>Submit test</button> : null}
        {index === activeQuestions.length - 1
          ? <button type="button" className="quiz-primary-button" onClick={() => setFinished(true)}>Finish & see score <Target size={15}/></button>
          : <button type="button" className="quiz-primary-button" onClick={() => setIndex((n) => Math.min(activeQuestions.length - 1, n + 1))}>Next question <ArrowRight size={15}/></button>}
      </div>
      {loaded ? <p className="quiz-history-line">{attempts.length} saved attempt{attempts.length === 1 ? "" : "s"} · Best score {attempts.length ? `${bestPercent}%` : "not set"}</p> : null}
    </section>
  );
}
