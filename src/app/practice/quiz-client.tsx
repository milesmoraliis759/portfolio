"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
];

function readAttempts(): Attempt[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(ATTEMPTS_KEY) ?? "[]");
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
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loaded, setLoaded] = useState(false);
  const savedAttempt = useRef(false);

  const subjects = useMemo(() => ["All subjects", ...Array.from(new Set(questions.map((q) => q.subject)))], []);
  const activeQuestions = useMemo(() => subject === "All subjects" ? questions : questions.filter((q) => q.subject === subject), [subject]);
  const current = activeQuestions[index];
  const answered = current ? answers[current.id] !== undefined : false;
  const score = useMemo(() => activeQuestions.filter((q) => answers[q.id] === q.answer).length, [activeQuestions, answers]);
  const progress = activeQuestions.filter((q) => answers[q.id] !== undefined).length;
  const bestPercent = attempts.length ? Math.max(...attempts.map((a) => Math.round((a.score / a.total) * 100))) : 0;

  useEffect(() => {
    setAttempts(readAttempts());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (mode !== "mock" || finished) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [mode, finished]);

  useEffect(() => {
    if (mode === "mock" && remaining === 0 && !finished) setFinished(true);
  }, [mode, remaining, finished]);

  useEffect(() => {
    if (!finished || !loaded || savedAttempt.current || activeQuestions.length === 0) return;
    const record: Attempt = { score, total: activeQuestions.length, mode, topic: subject, completedAt: new Date().toISOString() };
    const next = [record, ...attempts].slice(0, 20);
    setAttempts(next);
    savedAttempt.current = true;
    try { window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(next)); } catch { /* Keep the session usable if storage is unavailable. */ }
  }, [finished, loaded, activeQuestions, score, mode, subject, attempts]);

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
    if (finished || !current) return;
    setAnswers((previous) => ({ ...previous, [current.id]: option }));
  }

  const restart = () => reset(mode, subject);
  const reveal = mode === "practice" && answered;

  if (finished) {
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
          const showAnswer = reveal || finished;
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
