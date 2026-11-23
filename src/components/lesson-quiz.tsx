"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";

type LessonQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

type Props = {
  title?: string;
  questions?: LessonQuestion[];
  questionsJson?: string;
};

function readQuestions(value?: string): LessonQuestion[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as LessonQuestion[] : [];
  } catch {
    return [];
  }
}

export function LessonQuiz({ title = "Check your understanding", questions, questionsJson }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const quizQuestions = Array.isArray(questions) ? questions : readQuestions(questionsJson);
  const answeredCount = Object.keys(answers).filter((key) => Number(key) < quizQuestions.length).length;
  const score = quizQuestions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);

  if (!quizQuestions.length) return null;

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <section className="lesson-quiz" aria-labelledby="lesson-quiz-title">
      <div className="lesson-quiz-topline">
        <span className="lesson-quiz-kicker">LESSON QUIZ · PRACTICE QUESTIONS</span>
        <span>{quizQuestions.length} questions</span>
      </div>
      <h2 id="lesson-quiz-title">{title}</h2>
      <p className="lesson-quiz-intro">Try these questions after finishing the lesson. Choose one answer for each, then check your result.</p>
      <div className="lesson-quiz-progress" aria-label={`${answeredCount} of ${quizQuestions.length} questions answered`}>
        <span style={{ width: `${(answeredCount / quizQuestions.length) * 100}%` }} />
      </div>
      <p className="lesson-quiz-progress-label" aria-live="polite">{answeredCount} of {quizQuestions.length} answered</p>

      <div className="lesson-quiz-questions">
        {quizQuestions.map((question, questionIndex) => (
          <fieldset className="lesson-quiz-question" key={questionIndex} disabled={submitted}>
            <legend><span>{String(questionIndex + 1).padStart(2, "0")}</span>{question.question}</legend>
            <div className="lesson-quiz-options">
              {question.options.map((option, optionIndex) => {
                const selected = answers[questionIndex] === optionIndex;
                const isAnswer = submitted && question.answer === optionIndex;
                const isWrongSelection = submitted && selected && !isAnswer;
                const state = isAnswer ? "is-correct" : isWrongSelection ? "is-incorrect" : selected ? "is-selected" : "";
                return (
                  <button
                    className={`lesson-quiz-option ${state}`}
                    type="button"
                    key={optionIndex}
                    aria-pressed={selected}
                    onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                  >
                    <span className="lesson-quiz-letter">{String.fromCharCode(65 + optionIndex)}</span>
                    <span>{option}</span>
                    {isAnswer ? <Check size={16} aria-label="Correct answer" /> : isWrongSelection ? <X size={16} aria-label="Incorrect selection" /> : null}
                  </button>
                );
              })}
            </div>
            {submitted ? (
              <div className={`lesson-quiz-explanation ${answers[questionIndex] === question.answer ? "is-correct" : "is-incorrect"}`}>
                <strong>{answers[questionIndex] === question.answer ? "Correct" : `Correct answer: ${question.options[question.answer]}`}</strong>
                <p>{question.explanation}</p>
              </div>
            ) : null}
          </fieldset>
        ))}
      </div>

      {submitted ? (
        <div className="lesson-quiz-result" role="status" aria-live="polite">
          <strong>You scored {score} out of {quizQuestions.length}</strong>
          <span>{score === quizQuestions.length ? "Excellent — you have the key ideas." : "Review the explanations, then try once more."}</span>
        </div>
      ) : null}
      <div className="lesson-quiz-actions">
        {!submitted ? (
          <button className="lesson-quiz-submit" type="button" disabled={answeredCount !== quizQuestions.length} onClick={() => setSubmitted(true)}>
            Check my answers
          </button>
        ) : (
          <button className="lesson-quiz-retry" type="button" onClick={reset}><RotateCcw size={14} /> Try again</button>
        )}
        {!submitted && answeredCount !== quizQuestions.length ? <span>Answer every question to see your result.</span> : null}
      </div>
      <p className="lesson-quiz-note">These are original practice questions, not official previous-year questions.</p>
      <div className="lesson-quiz-next-steps">
        <span>KEEP LEARNING</span>
        <Link href="/practice">Practice quiz and timed mock test <span aria-hidden="true">↗</span></Link>
        <Link href="/pyqs">Explore verified previous-year questions <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
