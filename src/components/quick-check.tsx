"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";

type Props = {
  question: string;
  options?: string[];
  optionsJson?: string;
  answer: number;
  explanation: string;
};

function parseOptions(value?: string): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : [];
  } catch {
    return [];
  }
}

export function QuickCheck({ question, options, optionsJson, answer, explanation }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const choices = useMemo(() => Array.isArray(options) ? options : parseOptions(optionsJson), [options, optionsJson]);
  const correct = selected === answer;

  if (!choices.length) return null;

  return (
    <section className="quick-check" aria-label="Knowledge check">
      <div className="quick-check-kicker">PRACTICE QUESTION · CONCEPT CHECK</div>
      <h3>{question}</h3>
      <div className="quick-check-options">
        {choices.map((option, index) => {
          const state = revealed && index === answer ? "correct" : revealed && selected === index ? "incorrect" : selected === index ? "selected" : "";
          return <button key={option} type="button" className={`quick-check-option ${state}`} onClick={() => { if (!revealed) setSelected(index); }} aria-pressed={selected === index} disabled={revealed}>
            <span>{String.fromCharCode(65 + index)}</span><span>{option}</span>
            {revealed && index === answer ? <Check size={16}/> : revealed && selected === index ? <X size={16}/> : null}
          </button>;
        })}
      </div>
      {revealed ? <div className={`quick-check-feedback ${correct ? "is-correct" : "is-incorrect"}`} role="status">
        <strong>{correct ? "Correct — nicely done." : "Not quite. Review the key idea."}</strong>
        <p>{explanation}</p>
      </div> : <p className="quick-check-hint">Choose one answer to check your understanding.</p>}
      <div className="quick-check-actions">
        <button type="button" className="quick-check-submit" onClick={() => setRevealed(true)} disabled={selected === null || revealed}>Check answer</button>
        {revealed ? <button type="button" className="quick-check-reset" onClick={() => { setSelected(null); setRevealed(false); }}><RotateCcw size={14}/> Try again</button> : null}
      </div>
    </section>
  );
}
