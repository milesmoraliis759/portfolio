"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Target, XCircle } from "lucide-react";

type Question = {
  id: number;
  subject: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const questions: Question[] = [
  { id: 1, subject: "Pharmaceutics", prompt: "Which excipient primarily reduces friction between the tablet and die wall during ejection?", options: ["Binder", "Lubricant", "Disintegrant", "Dilu ent".replace(" ", "")], answer: 1, explanation: "Lubricants reduce die-wall friction. Magnesium stearate is a commonly used tablet lubricant." },
  { id: 2, subject: "Pharmaceutics", prompt: "Which equipment is commonly used to dry wet granules?", options: ["Multimill", "Friabilator", "Fluid bed dryer", "Dissolution tester"], answer: 2, explanation: "A fluid bed dryer passes conditioned air through the granules, supporting heat and mass transfer." },
  { id: 3, subject: "Physical Pharmacy", prompt: "When the salt-to-acid ratio in an acidic buffer is 1, the pH equals:", options: ["7", "pKb", "pKa", "14"], answer: 2, explanation: "By Henderson–Hasselbalch, pH = pKa + log(1), and log(1) is zero." },
  { id: 4, subject: "Pharmacology", prompt: "Enalapril lowers blood pressure primarily by inhibiting:", options: ["Renin", "ACE", "AT1 receptor", "Aldosterone receptor"], answer: 1, explanation: "Enalapril is an ACE inhibitor. It reduces conversion of angiotensin I to angiotensin II." },
  { id: 5, subject: "Pharmacology", prompt: "Which adverse effect is especially associated with verapamil?", options: ["Constipation", "Ototoxicity", "Dry cough", "Hypertrichosis"], answer: 0, explanation: "Verapamil slows AV conduction and can reduce gastrointestinal motility, causing constipation." },
  { id: 6, subject: "Medicinal Chemistry", prompt: "Sulfonamide antibacterials competitively inhibit:", options: ["Dihydrofolate reductase", "DNA gyrase", "Dihydropteroate synthase", "Transpeptidase"], answer: 2, explanation: "Sulfonamides are PABA analogues and inhibit bacterial dihydropteroate synthase (DHPS)." },
  { id: 7, subject: "Pharmacognosy", prompt: "Dragendorff reagent is a general screening reagent for:", options: ["Alkaloids", "Proteins", "Carbohydrates", "Fixed oils"], answer: 0, explanation: "Dragendorff reagent (potassium bismuth iodide) commonly gives an orange to reddish precipitate with alkaloids." },
  { id: 8, subject: "Pharmacognosy", prompt: "Atropine is classified as a:", options: ["Indole alkaloid", "Tropane alkaloid", "Purine alkaloid", "Quinoline alkaloid"], answer: 1, explanation: "Atropine is a tropane alkaloid obtained from Solanaceae plants such as Atropa belladonna." },
  { id: 9, subject: "Pharmaceutical Analysis", prompt: "If transmittance is 0.01, what is the absorbance?", options: ["0.01", "1", "2", "10"], answer: 2, explanation: "A = −log₁₀(T) = −log₁₀(0.01) = 2." },
  { id: 10, subject: "Industrial Pharmacy", prompt: "Which qualification stage documents that equipment is installed according to specification?", options: ["OQ", "PQ", "IQ", "Process validation"], answer: 2, explanation: "Installation Qualification (IQ) verifies and documents that equipment is installed as specified." },
  { id: 11, subject: "Pharmaceutics", prompt: "Which test evaluates a tablet's resistance to abrasion and shock during handling?", options: ["Friability", "Disintegration", "Content uniformity", "Dissolution"], answer: 0, explanation: "The friability test evaluates mass loss from tablets exposed to a defined tumbling / abrasion procedure." },
  { id: 12, subject: "Pharmaceutical Analysis", prompt: "In the Beer–Lambert equation A = εbc, absorbance is directly proportional to:", options: ["Concentration and path length", "Transmittance", "Stray light", "Only wavelength"], answer: 0, explanation: "At a fixed wavelength and under ideal conditions, absorbance is proportional to concentration and optical path length." },
];

export function PracticeQuiz() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const current = questions[index];
  const answered = answers[current.id] !== undefined;
  const score = useMemo(() => questions.filter((q) => answers[q.id] === q.answer).length, [answers]);
  const progress = Object.keys(answers).length;

  function choose(option: number) {
    if (finished) return;
    setAnswers((previous) => ({ ...previous, [current.id]: option }));
  }

  function restart() {
    setIndex(0);
    setAnswers({});
    setFinished(false);
  }

  if (finished) {
    return (
      <section className="quiz-panel">
        <div className="quiz-result-icon"><Target size={27}/></div>
        <p className="eyebrow">PRACTICE SET COMPLETE</p>
        <h2>{score} <span>/ {questions.length}</span></h2>
        <p className="quiz-result-copy">{score >= 10 ? "Strong work. Now move on to tougher application questions." : score >= 7 ? "Good foundation. Review the explanations for the questions you missed." : "Use this as a diagnostic. Revisit the concepts, then try again."}</p>
        <div className="quiz-score-track"><span style={{ width: `${(score / questions.length) * 100}%` }}/></div>
        <div className="quiz-review">
          <h3>Answer review</h3>
          {questions.map((q, i) => {
            const correct = answers[q.id] === q.answer;
            return <article className="quiz-review-item" key={q.id}>
              <div className="quiz-review-top"><span>Q{i + 1} · {q.subject}</span>{correct ? <CheckCircle2 size={16} aria-label="Correct"/> : <XCircle size={16} aria-label="Incorrect"/>}</div>
              <strong>{q.prompt}</strong>
              <p>Your answer: {answers[q.id] === undefined ? "Not answered" : q.options[answers[q.id]]}</p>
              <p>Correct answer: {q.options[q.answer]}</p>
              <small>{q.explanation}</small>
            </article>;
          })}
        </div>
        <button className="quiz-primary-button" onClick={restart}><RotateCcw size={16}/> Retake practice set</button>
      </section>
    );
  }

  return (
    <section className="quiz-panel">
      <div className="quiz-topline"><span>QUESTION {String(index + 1).padStart(2, "0")} / {questions.length}</span><span>{progress} ANSWERED</span></div>
      <div className="quiz-progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }}/></div>
      <div className="quiz-question-meta"><span className="tag">{current.subject}</span><span className="quiz-progress-text">{Math.round((progress / questions.length) * 100)}% completed</span></div>
      <h2 className="quiz-question">{current.prompt}</h2>
      <div className="quiz-options">
        {current.options.map((option, i) => {
          const selected = answers[current.id] === i;
          const correct = i === current.answer;
          const reveal = answered;
          const state = reveal && correct ? "correct" : reveal && selected && !correct ? "incorrect" : selected ? "selected" : "";
          return <button type="button" key={option} className={`quiz-option ${state}`} onClick={() => choose(i)} aria-pressed={selected}>
            <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>
            {reveal && correct ? <CheckCircle2 size={17}/> : reveal && selected ? <XCircle size={17}/> : null}
          </button>;
        })}
      </div>
      {answered ? <div className={`quiz-feedback ${answers[current.id] === current.answer ? "is-correct" : "is-incorrect"}`}>
        <strong>{answers[current.id] === current.answer ? "Correct." : "Not quite."}</strong> {current.explanation}
      </div> : <p className="quiz-hint">Select an option to reveal the answer and explanation.</p>}
      <div className="quiz-navigation">
        <button type="button" className="quiz-secondary-button" onClick={() => setIndex((n) => Math.max(0, n - 1))} disabled={index === 0}><ArrowLeft size={15}/> Previous</button>
        {index === questions.length - 1
          ? <button type="button" className="quiz-primary-button" onClick={() => setFinished(true)}>Finish & see score <Target size={15}/></button>
          : <button type="button" className="quiz-primary-button" onClick={() => setIndex((n) => Math.min(questions.length - 1, n + 1))}>Next question <ArrowRight size={15}/></button>}
      </div>
    </section>
  );
}
