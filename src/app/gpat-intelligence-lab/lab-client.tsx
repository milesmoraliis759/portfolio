"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, ArrowLeft, ArrowRight, BookOpenCheck } from "lucide-react";
import { gpatPyqs, gpatSubjects, type GpatQuestion } from "@/data/gpat-pyqs";

type Phase = "setup" | "quiz" | "results";

function shuffle<T,>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function GpatIntelligenceLab() {
  const [subject, setSubject] = useState("All subjects");
  const [questionCount, setQuestionCount] = useState("10");
  const [phase, setPhase] = useState<Phase>("setup");
  const [quiz, setQuiz] = useState<GpatQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const available = useMemo(
    () => gpatPyqs.filter((q) => q.verified && (subject === "All subjects" || q.subject === subject)),
    [subject]
  );

  const current = quiz[currentIndex];
  const correct = quiz.filter((q) => answers[q.id] === q.answer).length;
  const attempted = quiz.filter((q) => answers[q.id] !== undefined).length;
  const incorrect = attempted - correct;
  const skipped = quiz.length - attempted;
  const percentage = quiz.length ? Math.round((correct / quiz.length) * 100) : 0;

  function startQuiz() {
    const count = questionCount === "all" ? available.length : Math.min(Number(questionCount), available.length);
    const selected = shuffle(available).slice(0, count);
    if (!selected.length) return;
    setQuiz(selected);
    setAnswers({});
    setCurrentIndex(0);
    setPhase("quiz");
  }

  function retakeQuiz() {
    setAnswers({});
    setCurrentIndex(0);
    setPhase("setup");
  }

  if (phase === "setup") {
    return (
      <section className="mx-auto w-full max-w-3xl py-8">
        <div className="mb-8">
          <p className="eyebrow">GPAT PRACTICE</p>
          <h1 className="text-4xl sm:text-5xl">Akatsuki <em>Trials.</em></h1>
          <p className="page-lede mt-4">Choose a subject and start a quiz. Submit your answers to see your score and explanations.</p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
          <label className="mb-2 block text-sm font-medium" htmlFor="quiz-subject">Subject</label>
          <select id="quiz-subject" className="mb-5 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-sm" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {gpatSubjects.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>

          <label className="mb-2 block text-sm font-medium" htmlFor="quiz-count">Number of questions</label>
          <select id="quiz-count" className="mb-5 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-sm" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)}>
            <option value="5">5 questions</option>
            <option value="10">10 questions</option>
            <option value="20">20 questions</option>
            <option value="all">All available questions</option>
          </select>

          <p className="mb-5 text-sm text-[var(--muted)]">{available.length} questions available for this selection.</p>
          <button type="button" onClick={startQuiz} disabled={!available.length} className="button button-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
            Start quiz <ArrowRight size={16}/>
          </button>
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]">Questions include verified uploaded GPAT previous-year questions and clearly labelled practice questions.</p>
      </section>
    );
  }

  if (phase === "results") {
    return (
      <section className="mx-auto w-full max-w-3xl py-8">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:p-8">
          <CheckCircle2 className="mx-auto mb-3 text-[var(--accent)]" size={34}/>
          <p className="eyebrow">QUIZ COMPLETED</p>
          <h1 className="text-4xl sm:text-5xl">{percentage}%</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Your quiz result</p>
          <div className="mt-7 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-[var(--surface-2)] p-3"><strong className="block text-2xl">{correct}</strong><span className="text-xs text-[var(--muted)]">Correct</span></div>
            <div className="rounded-lg bg-[var(--surface-2)] p-3"><strong className="block text-2xl">{incorrect}</strong><span className="text-xs text-[var(--muted)]">Incorrect</span></div>
            <div className="rounded-lg bg-[var(--surface-2)] p-3"><strong className="block text-2xl">{skipped}</strong><span className="text-xs text-[var(--muted)]">Skipped</span></div>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">You answered {attempted} out of {quiz.length} questions.</p>
          <button type="button" onClick={retakeQuiz} className="button button-primary mt-6 w-full justify-center sm:w-auto"><RotateCcw size={15}/> Take another quiz</button>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl">Answer explanations</h2>
          <div className="space-y-4">
            {quiz.map((q, i) => {
              const selected = answers[q.id];
              const isCorrect = selected === q.answer;
              return (
                <article key={q.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-[var(--muted)]">Question {i + 1} · {q.subject}</span>
                    <span className="text-xs font-semibold" style={{ color: isCorrect ? "#16a36a" : selected === undefined ? "var(--muted)" : "#dc5555" }}>
                      {isCorrect ? "Correct" : selected === undefined ? "Not attempted" : "Incorrect"}
                    </span>
                  </div>
                  <h3 className="mb-4 text-base font-semibold leading-relaxed">{q.prompt}</h3>
                  <div className="space-y-2">
                    {q.options.map((option, optionIndex) => {
                      const isAnswer = optionIndex === q.answer;
                      const isSelected = optionIndex === selected;
                      return (
                        <div key={optionIndex} className="rounded-lg border p-3 text-sm" style={{
                          borderColor: isAnswer ? "#16a36a" : isSelected ? "#dc5555" : "var(--border)",
                          background: isAnswer ? "color-mix(in srgb, #16a36a 9%, var(--surface))" : "transparent"
                        }}>
                          <span className="mr-2 font-semibold">{String.fromCharCode(65 + optionIndex)}.</span>{option}
                          {isAnswer ? <span className="ml-2 text-xs font-semibold">Correct answer</span> : null}
                          {isSelected && !isAnswer ? <span className="ml-2 text-xs font-semibold">Your answer</span> : null}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 rounded-lg bg-[var(--surface-2)] p-4">
                    <p className="mb-1 flex items-center gap-2 text-sm font-semibold"><BookOpenCheck size={16}/> Explanation</p>
                    <p className="text-sm leading-relaxed text-[var(--text-soft)]">{q.explanation}</p>
                  </div>
                  <p className="mt-3 text-xs text-[var(--muted)]">{q.source}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{current.subject}</p>
          <p className="text-sm text-[var(--muted)]">Question {currentIndex + 1} of {quiz.length}</p>
        </div>
        <button type="button" className="text-sm text-[var(--muted)] underline underline-offset-4" onClick={() => setPhase("results")}>Submit quiz</button>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }}/>
      </div>

      <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
          <span>{current.topic}</span>
          <span>·</span>
          <span>{current.sourceType === "Practice Question" ? "Practice Question" : `GPAT ${current.year} · Q${current.number}`}</span>
        </div>
        <h2 className="mb-6 text-xl font-semibold leading-relaxed sm:text-2xl">{current.prompt}</h2>
        <div className="space-y-3">
          {current.options.map((option, i) => {
            const selected = answers[current.id] === i;
            return (
              <button key={i} type="button" onClick={() => setAnswers((old) => ({ ...old, [current.id]: i }))} aria-pressed={selected}
                className="flex w-full items-start gap-3 rounded-lg border p-4 text-left text-sm transition-colors"
                style={{ borderColor: selected ? "var(--accent)" : "var(--border)", background: selected ? "var(--accent-soft)" : "transparent" }}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-[var(--border)] text-xs font-semibold">{String.fromCharCode(65 + i)}</span>
                <span className="pt-1">{option}</span>
              </button>
            );
          })}
        </div>
      </article>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button type="button" className="button" disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => i - 1)}><ArrowLeft size={15}/> Previous</button>
        {currentIndex < quiz.length - 1
          ? <button type="button" className="button button-primary" onClick={() => setCurrentIndex((i) => i + 1)}>Next <ArrowRight size={15}/></button>
          : <button type="button" className="button button-primary" onClick={() => setPhase("results")}>Submit quiz <CheckCircle2 size={15}/></button>}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {quiz.map((q, i) => <button key={q.id} type="button" aria-label={`Go to question ${i + 1}`} onClick={() => setCurrentIndex(i)}
          className="h-9 w-9 rounded-md border text-xs font-medium"
          style={{ borderColor: currentIndex === i ? "var(--accent)" : "var(--border)", background: answers[q.id] !== undefined ? "var(--accent-soft)" : "var(--surface)", color: currentIndex === i ? "var(--accent)" : "var(--text)" }}>{i + 1}</button>)}
      </div>
    </section>
  );
}
