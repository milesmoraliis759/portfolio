"use client";

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
  questions: LessonQuestion[];
};

export function LessonQuiz({ title = "Check your understanding", questions }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const score = questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);

  if (!questions.length) return null;

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <section className="lesson-quiz" aria-labelledby="lesson-quiz-title">
      <div className="lesson-quiz-topline">
        <span className="lesson-quiz-kicker">LESSON QUIZ · PRACTICE QUESTIONS</span>
        <span>{questions.length} questions</span>
      </div>
      <h2 id="lesson-quiz-title">{title}</h2>
      <p className="lesson-quiz-intro">Try these questions after finishing the lesson. Choose one answer for each, then check your result.</p>
      <div className="lesson-quiz-progress" aria-label={`${answeredCount} of ${questions.length} questions answered`}>
        <span style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
      </div>
      <p className="lesson-quiz-progress-label" aria-live="polite">{answeredCount} of {questions.length} answered</p>

      <div className="lesson-quiz-questions">
        {questions.map((question, questionIndex) => (
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
          <strong>You scored {score} out of {questions.length}</strong>
          <span>{score === questions.length ? "Excellent — you have the key ideas." : "Review the explanations, then try once more."}</span>
        </div>
      ) : null}
      <div className="lesson-quiz-actions">
        {!submitted ? (
          <button className="lesson-quiz-submit" type="button" disabled={answeredCount !== questions.length} onClick={() => setSubmitted(true)}>
            Check my answers
          </button>
        ) : (
          <button className="lesson-quiz-retry" type="button" onClick={reset}><RotateCcw size={14} /> Try again</button>
        )}
        {!submitted && answeredCount !== questions.length ? <span>Answer every question to see your result.</span> : null}
      </div>
      <p className="lesson-quiz-note">These are original practice questions, not official previous-year questions.</p>
    </section>
  );
}
