"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";

type Pyq = {
  id: number;
  topic: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const pyqs: Pyq[] = [
  { id: 1, topic: "Human physiology · Body fluid compartments", prompt: "Approximately how much intracellular fluid is present in an average adult when fluid inside blood cells is included?", options: ["15 L", "20 L", "27 L", "35 L"], answer: 2, explanation: "The intracellular fluid compartment is approximately 27 litres in a typical 70 kg adult. Total body water is roughly 42 litres, with about two-thirds inside cells." },
  { id: 2, topic: "Pharmaceutical jurisprudence · Drug regulation", prompt: "Where was India's first Central Drugs Laboratory established?", options: ["Mumbai", "Lucknow", "Kolkata", "Hyderabad"], answer: 2, explanation: "The Central Drugs Laboratory was established in Kolkata. It functions as a central government laboratory under the Drugs and Cosmetics framework." },
  { id: 3, topic: "Physical pharmacy · Powder surface area", prompt: "Which instrument is associated with measuring specific surface area and pore characteristics of pharmaceutical powders using gas adsorption?", options: ["Coulter counter", "Andreasen pipette", "Quantasorb", "Optical microscope"], answer: 2, explanation: "Quantasorb is associated with gas-adsorption surface-area analysis. A Coulter counter is used for particle counting and sizing by electrical sensing zone." },
  { id: 4, topic: "Pharmacognosy · Extraction methods", prompt: "What is the name of the modified maceration process in which the drug and solvent are heated together in a closed vessel?", options: ["Digestion", "Percolation", "Expression", "Rendering"], answer: 0, explanation: "Digestion is maceration carried out with gentle heat in a closed vessel. Heating can improve extraction of constituents when the material is heat-stable." },
  { id: 5, topic: "Physical pharmacy · Inclusion complexes", prompt: "Which of these is not classified as a typical inclusion-compound structure?", options: ["Channel-lattice type", "Quinhydrone complex", "Layer type", "Clathrate"], answer: 1, explanation: "Channel-lattice, layer and clathrate structures are recognised inclusion-compound types. Quinhydrone is a charge-transfer molecular complex, not one of these inclusion structures." },
  { id: 6, topic: "Pharmaceutical jurisprudence · Pharmacy practice", prompt: "In the traditional dispensing context of the source question, a prescription's price is calculated from which components?", options: ["Ingredient cost only", "Professional fee only", "Ingredient cost plus dispensing cost only", "Ingredient cost plus professional fee"], answer: 3, explanation: "The keyed answer in the supplied compilation is ingredient cost plus professional fee. Treat this as the historical exam framing; actual dispensing charges and professional-fee rules depend on current practice and applicable law." },
  { id: 7, topic: "Pharmaceutical jurisprudence · DTAB", prompt: "Consider two statements: (I) the DCGI is the chairperson of DTAB; (II) DTAB includes eight ex-officio, five nominated and five elected members. Which combination matches the supplied answer key?", options: ["Both statements are correct", "Both statements are incorrect", "I is correct; II is incorrect", "I is incorrect; II is correct"], answer: 3, explanation: "The supplied key marks statement I false and statement II true. The chairperson is the Director General of Health Services, not the DCGI. The statutory composition should always be checked against the current Act and amendments." },
  { id: 8, topic: "Pharmaceutics · Water for injection", prompt: "Which distillation method is the expected answer in this question's conventional options for preparing water for injection?", options: ["Fractional distillation", "Molecular distillation", "Simple distillation", "Steam distillation"], answer: 2, explanation: "The supplied answer key marks simple distillation. Modern pharmacopoeial requirements may permit validated equivalent purification processes; do not assume every current WFI system uses only this one method." },
  { id: 9, topic: "Pharmaceutical jurisprudence · Pharmacy Council of India", prompt: "According to the answer key in the supplied compilation, how many ex-officio members are included in the Pharmacy Council of India?", options: ["Three", "Four", "Six", "Eight"], answer: 0, explanation: "The supplied answer key marks three. The Pharmacy Act identifies the ex-officio members by their statutory offices; consult the current Act for the exact legal composition." },
];

export function PyqPractice() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const current = pyqs[index];
  const selected = answers[current.id];
  const answered = selected !== undefined;
  const score = pyqs.filter((q) => answers[q.id] === q.answer).length;

  function restart() {
    setIndex(0);
    setAnswers({});
    setFinished(false);
  }

  if (finished) {
    return <section className="quiz-panel">
      <div className="quiz-result-icon"><CheckCircle2 size={27}/></div>
      <p className="eyebrow">PYQ REVISION COMPLETE</p>
      <h2>{score} <span>/ {pyqs.length}</span></h2>
      <p className="quiz-result-copy">You answered {score} of {pyqs.length} adapted PYQ items correctly. Review the explanations and revisit the related topic notes.</p>
      <div className="quiz-score-track"><span style={{width:`${(score/pyqs.length)*100}%`}}/></div>
      <div className="quiz-review"><h3>Answer review</h3>
        {pyqs.map((q,i) => <article className="quiz-review-item" key={q.id}>
          <div className="quiz-review-top"><span>Q{i+1} · {q.topic}</span>{answers[q.id] === q.answer ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}</div>
          <strong>{q.prompt}</strong>
          <p>Your answer: {answers[q.id] === undefined ? "Not answered" : q.options[answers[q.id]]}</p>
          <p>Keyed answer: {q.options[q.answer]}</p>
          <small>{q.explanation}</small>
        </article>)}
      </div>
      <button className="quiz-primary-button" onClick={restart}><RotateCcw size={16}/> Retry PYQ set</button>
    </section>;
  }

  return <section className="quiz-panel">
    <div className="quiz-topline"><span>ADAPTED PYQ {String(index+1).padStart(2,"0")} / {pyqs.length}</span><span>{Object.keys(answers).length} ANSWERED</span></div>
    <div className="quiz-progress"><span style={{width:`${((index+1)/pyqs.length)*100}%`}}/></div>
    <div className="quiz-question-meta"><span className="tag">Source-based PYQ</span><span className="quiz-progress-text">{current.topic}</span></div>
    <h2 className="quiz-question">{current.prompt}</h2>
    <div className="quiz-options">
      {current.options.map((option,i) => {
        const isSelected = selected === i;
        const correct = current.answer === i;
        const state = answered && correct ? "correct" : answered && isSelected ? "incorrect" : isSelected ? "selected" : "";
        return <button type="button" key={option} className={`quiz-option ${state}`} onClick={() => setAnswers((old) => ({...old,[current.id]:i}))} aria-pressed={isSelected}>
          <span className="quiz-option-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>
          {answered && correct ? <CheckCircle2 size={17}/> : answered && isSelected ? <XCircle size={17}/> : null}
        </button>;
      })}
    </div>
    {answered ? <div className={`quiz-feedback ${selected === current.answer ? "is-correct" : "is-incorrect"}`}><strong>{selected === current.answer ? "Correct." : "Review this one."}</strong> {current.explanation}</div> : <p className="quiz-hint">Choose an option to reveal the answer and explanation.</p>}
    <div className="quiz-navigation">
      <button type="button" className="quiz-secondary-button" disabled={index===0} onClick={() => setIndex((n)=>Math.max(0,n-1))}><ArrowLeft size={15}/> Previous</button>
      {index === pyqs.length-1
        ? <button type="button" className="quiz-primary-button" onClick={() => setFinished(true)}>Finish review <CheckCircle2 size={15}/></button>
        : <button type="button" className="quiz-primary-button" onClick={() => setIndex((n)=>Math.min(pyqs.length-1,n+1))}>Next question <ArrowRight size={15}/></button>}
    </div>
  </section>;
}
