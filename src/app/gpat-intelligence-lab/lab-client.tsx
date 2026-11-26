"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpen, BrainCircuit, Check, CheckCircle2, ChevronRight,
  Clock3, Flag, FlaskConical, RotateCcw, Target, Trophy
} from "lucide-react";
import { gpatPyqs, gpatSubjects, type GpatQuestion } from "@/data/gpat-pyqs";

type Attempt = {
  id: string; date: string; mode: string; subject: string; total: number;
  correct: number; applicationCorrect: number; applicationTotal: number;
  seconds: number; questionIds: string[]; correctQuestionIds: string[];
};
type ErrorItem = { questionId: string; answer: number | null; category: string; date: string; due: string; note?: string };
type SavedState = { attempts: Attempt[]; errors: ErrorItem[]; mastered: string[]; streak: number; lastStudy: string };

const KEY = "harsh-gpat-intelligence-lab-v1";
const modes = [
  { id: "quick", label: "Quick Practice", count: 10, hint: "10 questions · quick daily check" },
  { id: "topic", label: "Topic Practice", count: 20, hint: "20 questions · focus on one topic" },
  { id: "application", label: "Application Challenge", count: 15, hint: "15 questions · solve unfamiliar situations" },
  { id: "mixed", label: "Mixed Mock Test", count: 50, hint: "Up to 50 questions · mixed subjects" },
];
const concepts = [
  { subject:"Physical Pharmaceutics", title:"Chemical kinetics & shelf life", detail:"Zero-, first- and second-order models; t₉₀, t₅₀ and stability interpretation." },
  { subject:"Pharmaceutical Analysis", title:"Spectroscopy & chromatography", detail:"Understand signal generation, separation principles and instrument choices." },
  { subject:"Biochemistry", title:"Carbohydrate and enzyme pathways", detail:"Connect molecular structure to biochemical behaviour and clinical patterns." },
  { subject:"Pharmaceutical Biotechnology", title:"PCR, ELISA & recombinant methods", detail:"Learn the sequence of steps, controls and interpretation of results." },
  { subject:"Organic Chemistry", title:"Substitution, elimination & stereochemistry", detail:"Predict products by analysing substrate, nucleophile, solvent and leaving group." },
  { subject:"Pharmaceutical Microbiology", title:"Sterilization and microbial control", detail:"Distinguish sterilization, disinfection, depyrogenation and validation." },
];

function freshState(): SavedState {
  return { attempts: [], errors: [], mastered: [], streak: 0, lastStudy: "" };
}
function readState(): SavedState {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
    return parsed && Array.isArray(parsed.attempts) ? { ...freshState(), ...parsed } : freshState();
  } catch { return freshState(); }
}
function pct(a: number, b: number) { return b ? Math.round((a / b) * 100) : 0; }

export function GpatIntelligenceLab() {
  const [saved, setSaved] = useState<SavedState>(freshState);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(0);
  const [tab, setTab] = useState("overview");
  const [mode, setMode] = useState("quick");
  const [subject, setSubject] = useState("All subjects");
  const [topic, setTopic] = useState("All topics");
  const [timed, setTimed] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [quiz, setQuiz] = useState<GpatQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [marked, setMarked] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeConcept, setActiveConcept] = useState(concepts[0].title);

  // Hydrate browser-only progress after mount; localStorage is unavailable during server rendering.
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      setSaved(readState());
      setReady(true);
      setNow(Date.now());
    });
    return () => { active = false; };
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(saved)); }, [saved, ready]);
  useEffect(() => {
    if (!quiz.length || submitted || !timed) return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [quiz.length, submitted, timed]);

  const current = quiz[index];
  const eligible = useMemo(() => gpatPyqs.filter(q =>
    q.verified &&
    (subject === "All subjects" || q.subject === subject) &&
    (topic === "All topics" || q.topic === topic)
  ), [subject, topic]);
  const availableTopics = useMemo(() => Array.from(new Set(gpatPyqs.filter(q => q.verified && (subject === "All subjects" || q.subject === subject)).map(q => q.topic))).sort(), [subject]);
  const attempts = saved.attempts;
  const totalAnswered = attempts.reduce((n, a) => n + a.total, 0);
  const correctAnswered = attempts.reduce((n, a) => n + a.correct, 0);
  const appTotal = attempts.reduce((n, a) => n + a.applicationTotal, 0);
  const appCorrect = attempts.reduce((n, a) => n + a.applicationCorrect, 0);
  const accuracy = pct(correctAnswered, totalAnswered);
  const applicationAccuracy = pct(appCorrect, appTotal);
  const directAttempts = attempts.reduce((n, a) => n + (a.total - a.applicationTotal), 0);
  const directCorrect = attempts.reduce((n, a) => n + (a.correct - a.applicationCorrect), 0);
  const applicationGap = pct(directCorrect, directAttempts) - applicationAccuracy;
  const dueItems = saved.errors.filter(e => now > 0 && new Date(e.due).getTime() <= now);
  const currentQuestion = current;

  function startTest() {
    const selectedMode = modes.find(m => m.id === mode)!;
    let pool = eligible;
    if (mode === "application") pool = pool.filter(q => q.type === "Application" || q.type === "Numerical");
    const count = Math.min(selectedMode.count, pool.length);
    if (!count) return;
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0,count);
    setQuiz(selected); setIndex(0); setAnswers({}); setMarked([]); setSeconds(0); setSubmitted(false); setShowConfirm(false); setTab("arena"); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function finishTest() {
    const correct = quiz.filter(q => answers[q.id] === q.answer).length;
    const appQs = quiz.filter(q => q.type === "Application" || q.type === "Numerical");
    const appRight = appQs.filter(q => answers[q.id] === q.answer).length;
    const now = new Date();
    const newErrors: ErrorItem[] = quiz.filter(q => answers[q.id] !== q.answer).map(q => ({
      questionId:q.id, answer:answers[q.id] ?? null,
      category:answers[q.id] === undefined ? "Skipped" : (q.type === "Application" || q.type === "Numerical" ? "Application gap" : "Concept / recall gap"),
      date:now.toISOString(), due:new Date(now.getTime()+86400000).toISOString()
    }));
    const attempt: Attempt = {
      id: now.toISOString(), date:now.toISOString(), mode:modes.find(m=>m.id===mode)?.label ?? mode,
      subject, total:quiz.length, correct, applicationCorrect:appRight, applicationTotal:appQs.length,
      seconds, questionIds:quiz.map(q=>q.id), correctQuestionIds:quiz.filter(q=>answers[q.id]===q.answer).map(q=>q.id)
    };
    setSaved(s => ({...s, attempts:[attempt,...s.attempts], errors:[...newErrors,...s.errors.filter(e=>!newErrors.some(n=>n.questionId===e.questionId))], lastStudy:now.toDateString()}));
    setSubmitted(true); setShowConfirm(false);
  }
  function markReviewed(id: string) {
    setSaved(s => ({...s, errors:s.errors.filter(e=>e.questionId!==id)}));
  }
  function updateNote(id: string, value: string) {
    setSaved(s => ({...s, errors:s.errors.map(e=>e.questionId===id?{...e,note:value}:e)}));
  }
  function formatTime(n:number) { return `${Math.floor(n/60).toString().padStart(2,"0")}:${(n%60).toString().padStart(2,"0")}`; }

  if (!ready) return <div className="gil-loading">Opening your learning archive…</div>;

  return <div className="gil-shell">
    <div className="gil-topline"><span>暁 / GPAT INTELLIGENCE LAB</span><span>KNOW · CONNECT · APPLY · MASTER</span></div>
    <nav className="gil-tabs" aria-label="GPAT Intelligence Lab sections">
      {[
        ["overview","Home"],["academy","Learn"],["arena","Test"],["errors","Mistakes"],["analytics","Progress"]
      ].map(([id,label])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}>{label}</button>)}
    </nav>

    {tab==="overview" && <section className="gil-dashboard">
      <header className="gil-heading"><p className="gil-kicker">YOUR PERSONAL PREPARATION SYSTEM</p><h1>GPAT <em>Intelligence Lab.</em></h1><p>Build the concept. Connect the science. Apply it to unfamiliar problems.</p></header>
      <div className="gil-metrics">
        <article><span>OVERALL ACCURACY</span><strong>{attempts.length?accuracy+"%":"—"}</strong><small>{totalAnswered?totalAnswered+" questions attempted":"No attempts yet"}</small></article>
        <article><span>APPLICATION ACCURACY</span><strong>{appTotal?applicationAccuracy+"%":"—"}</strong><small>{appTotal?appTotal+" application / numerical":"Awaiting application attempts"}</small></article>
        <article><span>APPLICATION GAP</span><strong>{appTotal?applicationGap+" pts":"—"}</strong><small>Direct accuracy − application accuracy</small></article>
        <article><span>REVISION QUEUE</span><strong>{dueItems.length}</strong><small>Incorrect or skipped questions due</small></article>
      </div>
      <div className="gil-feature-grid">
        <article className="gil-feature gil-challenge"><div className="gil-feature-icon"><FlaskConical/></div><p className="gil-kicker">DAILY LEARNING CHALLENGE</p><h2>One question. <em>Deeper thinking.</em></h2><p>Start with a short source-based test, then review why each option works or fails.</p><button onClick={()=>{setMode("quick");setTab("arena");}}>Begin challenge <ArrowRight size={16}/></button></article>
        <article className="gil-feature"><div className="gil-feature-icon"><BookOpen/></div><p className="gil-kicker">CONTINUE LEARNING</p><h2>Concept Academy</h2><p>Structured explanations across the high-yield scientific foundations.</p><button className="gil-secondary" onClick={()=>setTab("academy")}>Explore concepts <ArrowRight size={16}/></button></article>
        <article className="gil-feature"><div className="gil-feature-icon"><RotateCcw/></div><p className="gil-kicker">PENDING REVISIONS</p><h2>{dueItems.length ? dueItems.length+" questions due" : "Nothing due yet"}</h2><p>{dueItems.length?"Revisit mistakes before they become habits.":"Complete a test to build your personal revision queue."}</p><button className="gil-secondary" onClick={()=>setTab("errors")}>Open notebook <ArrowRight size={16}/></button></article>
      </div>
      <div className="gil-columns">
        <section className="gil-panel"><div className="gil-panel-title"><h2>Concept of the day</h2><span>STUDY PATH</span></div><h3>From formula to decision</h3><p>For every unfamiliar MCQ, identify the governing principle before looking at the options. Then predict the outcome and test your prediction.</p><div className="gil-steps"><span>01 · KNOW</span><span>02 · CONNECT</span><span>03 · APPLY</span><span>04 · MASTER</span></div></section>
        <section className="gil-panel"><div className="gil-panel-title"><h2>Recent test results</h2><button onClick={()=>setTab("analytics")}>View all</button></div>{attempts.length?<ul className="gil-recent">{attempts.slice(0,4).map(a=><li key={a.id}><span>{a.mode}<small>{new Date(a.date).toLocaleDateString()}</small></span><strong>{a.correct}/{a.total} · {pct(a.correct,a.total)}%</strong></li>)}</ul>:<div className="gil-empty"><Target/><strong>Your first result starts here.</strong><p>No attempts are saved yet. Start a test to build real performance insights.</p><button onClick={()=>setTab("arena")}>Choose a test</button></div>}</section>
      </div>
      <div className="gil-panel gil-weak"><div className="gil-panel-title"><h2>Weak topics & learning streak</h2><span>BASED ON YOUR ATTEMPTS</span></div>{saved.errors.length?<div className="gil-topic-list">{saved.errors.slice(0,5).map(e=>{const q=gpatPyqs.find(x=>x.id===e.questionId)!;return <div key={e.questionId}><span>{q.topic}<small>{q.subject} · {e.category}</small></span><strong>Review</strong></div>})}</div>:<p className="gil-muted">Weak areas will appear here after you attempt questions. No scores or streaks are fabricated.</p>}</div>
      <div className="gil-source-note">QUESTION BANK · {gpatPyqs.filter(q=>q.verified).length} reviewed items: uploaded GPAT 2014/2019 questions plus original practice questions. Practice items are never labelled as official PYQs.</div>
    </section>}

    {tab==="academy" && <section className="gil-section">
      <header className="gil-heading"><p className="gil-kicker">CONCEPT ACADEMY</p><h1>Understand the <em>why.</em></h1><p>Choose a foundation area, then follow the learning sequence. Detailed lesson notes can be linked into this academy as the content library expands.</p></header>
      <div className="gil-concept-layout"><div className="gil-concept-list">{concepts.map(c=><button key={c.title} className={activeConcept===c.title?"active":""} onClick={()=>setActiveConcept(c.title)}><span>{c.subject}</span><strong>{c.title}</strong><ChevronRight size={16}/></button>)}</div><article className="gil-concept-detail">{(()=>{const c=concepts.find(x=>x.title===activeConcept)!;return <><p className="gil-kicker">{c.subject.toUpperCase()}</p><h2>{c.title}</h2><p>{c.detail}</p><ol><li><strong>Beginner explanation</strong><span>Define the key terms and state the central idea in plain language.</span></li><li><strong>Scientific principle</strong><span>Identify the equation, mechanism, molecular interaction or physical law.</span></li><li><strong>Pharmaceutical significance</strong><span>Connect the principle to formulation, quality, analysis or patient outcomes.</span></li><li><strong>Apply to a new situation</strong><span>Predict what changes when a variable, condition or drug is changed.</span></li><li><strong>Check mastery</strong><span>Attempt a question without looking at the notes, then explain your reasoning.</span></li></ol><button onClick={()=>{setSubject(c.subject);setMode("topic");setTab("arena");}}>Practise this area <ArrowRight size={16}/></button></>})()}</article></div>
      <p className="gil-source-note">Academy outline is a learning framework, not a claim that every listed lesson has already been authored. Topic-specific lessons should be added with references and reviewed explanations.</p>
    </section>}

    {tab==="arena" && <section className="gil-section">
      <header className="gil-heading"><p className="gil-kicker">AKATSUKI TRIALS · PRACTICE</p><h1>Test your <em>thinking.</em></h1><p>Choose a practice mode, pick a topic if you want, and start answering. Explanations appear after submission.</p></header>
      {!quiz.length ? <div className="gil-setup">
        <div className="gil-panel"><p className="gil-kicker">01 / SELECT YOUR TEST</p><div className="gil-mode-grid">{modes.map(m=><button key={m.id} className={mode===m.id?"active":""} onClick={()=>setMode(m.id)}><strong>{m.label}</strong><span>{m.hint}</span></button>)}</div>
          <div className="gil-form-grid"><label>Subject<select value={subject} onChange={e=>{setSubject(e.target.value);setTopic("All topics");}}>{gpatSubjects.map(s=><option key={s}>{s}</option>)}</select></label><label>Topic<select value={topic} onChange={e=>setTopic(e.target.value)}><option>All topics</option>{availableTopics.map(t=><option key={t}>{t}</option>)}</select></label><label className="gil-timer-toggle">Timer<select value={timed?"Timed":"Untimed"} onChange={e=>setTimed(e.target.value==="Timed")}><option>Untimed</option><option>Timed</option></select></label></div>
          <div className="gil-setup-footer"><span><strong>{eligible.length}</strong> questions match your selection. You'll get up to {modes.find(m=>m.id===mode)?.count} questions in a shuffled order.</span><button onClick={startTest} disabled={!eligible.length}>Start practice <ArrowRight size={16}/></button></div>
        </div>
        <p className="gil-source-note gil-setup-note">Real uploaded GPAT questions are labelled with their exam year. Original syllabus-based questions are labelled Practice Question. Scoring: +1 correct, 0 incorrect or skipped.</p>
      </div> : <div className="gil-test">
        <div className="gil-test-bar"><span>QUESTION {index+1} OF {quiz.length} <small>{quiz.filter(q=>answers[q.id]!==undefined).length} answered</small></span><span><Clock3 size={15}/>{timed?formatTime(seconds):"Untimed"}</span></div><div className="gil-progress-track"><span style={{width:`${((index+1)/quiz.length)*100}%`}}/></div>
        {submitted ? <div className="gil-result"><Trophy/><p className="gil-kicker">TEST COMPLETE</p><h2>{quiz.filter(q=>answers[q.id]===q.answer).length} / {quiz.length} correct</h2><strong>{pct(quiz.filter(q=>answers[q.id]===q.answer).length,quiz.length)}% accuracy</strong><p>Incorrect and skipped questions have been added to your Error Notebook with a next-day revision date.</p><div className="gil-result-actions"><button onClick={()=>{setQuiz([]);setTab("errors");}}>Review mistakes</button><button className="gil-secondary" onClick={()=>setQuiz([])}>Back to test setup</button></div><div className="gil-answer-review">{quiz.map((q,i)=><article key={q.id}><div className="gil-question-meta"><span>{q.sourceType==="Practice Question"?"Practice Question":`GPAT ${q.year} · Q${q.number}`}</span><span>{q.subject}</span><span>{answers[q.id]===q.answer?"Correct":answers[q.id]===undefined?"Skipped":"Incorrect"}</span></div><h3>{i+1}. {q.prompt}</h3><p><strong>Correct answer:</strong> {q.options[q.answer]}</p><p>{q.explanation}</p><small>{q.source}</small></article>)}</div></div> : <>
          <div className="gil-question"><div className="gil-question-meta"><span>{currentQuestion.subject}</span><span>{currentQuestion.topic}</span><span>{currentQuestion.sourceType==="Practice Question"?"PRACTICE QUESTION":`GPAT ${currentQuestion.year} · Q${currentQuestion.number}`}</span></div><h2>{currentQuestion.prompt}</h2><div className="gil-options">{currentQuestion.options.map((o,i)=><button key={i} className={answers[currentQuestion.id]===i?"selected":""} onClick={()=>setAnswers(a=>({...a,[currentQuestion.id]:i}))}><span>{String.fromCharCode(65+i)}</span>{o}{answers[currentQuestion.id]===i?<Check size={16}/>:null}</button>)}</div><div className="gil-explain"><strong>Source</strong><span>{currentQuestion.source}</span></div></div>
          <div className="gil-question-footer"><button className="gil-secondary" onClick={()=>setMarked(m=>m.includes(currentQuestion.id)?m.filter(x=>x!==currentQuestion.id):[...m,currentQuestion.id])}><Flag size={15}/>{marked.includes(currentQuestion.id)?"Marked":"Mark for review"}</button><div><button className="gil-secondary" disabled={index===0} onClick={()=>setIndex(i=>i-1)}><ArrowLeft size={15}/> Previous</button>{index<quiz.length-1?<button onClick={()=>setIndex(i=>i+1)}>Next <ArrowRight size={15}/></button>:<button onClick={()=>setShowConfirm(true)}>Submit test <CheckCircle2 size={15}/></button>}</div></div>
          <div className="gil-palette">{quiz.map((q,i)=><button key={q.id} className={i===index?"current":answers[q.id]!==undefined?"answered":marked.includes(q.id)?"marked":""} onClick={()=>setIndex(i)} aria-label={"Go to question "+(i+1)}>{i+1}</button>)}</div>
          {showConfirm&&<div className="gil-confirm"><div><strong>Submit this test?</strong><p>{quiz.filter(q=>answers[q.id]!==undefined).length} answered · {quiz.filter(q=>answers[q.id]===undefined).length} unattempted · {marked.length} marked for review</p><button onClick={finishTest}>Confirm submission</button><button className="gil-secondary" onClick={()=>setShowConfirm(false)}>Continue test</button></div></div>}
        </>}
      </div>}
    </section>}

    {tab==="errors" && <section className="gil-section">
      <header className="gil-heading"><p className="gil-kicker">ERROR NOTEBOOK & SMART REVISION</p><h1>Make mistakes <em>useful.</em></h1><p>Every incorrect or skipped test question is captured here. Revision starts the day after your attempt.</p></header>
      {saved.errors.length?<div className="gil-error-list">{saved.errors.map(e=>{const q=gpatPyqs.find(x=>x.id===e.questionId);if(!q)return null;return <article key={e.questionId}><div className="gil-question-meta"><span>{q.subject}</span><span>{e.category}</span><span>{q.sourceType==="Practice Question"?"Practice Question":`GPAT ${q.year} · Q${q.number}`}</span></div><h3>{q.prompt}</h3><p><strong>Your answer:</strong> {e.answer===null?"Skipped":q.options[e.answer]}</p><p><strong>Correct answer:</strong> {q.options[q.answer]}</p><p>{q.explanation}</p><label className="gil-note-label">Your reasoning note<textarea value={e.note??""} onChange={event=>updateNote(q.id,event.target.value)} placeholder="What did you miss? Which clue should you notice next time?"/></label><div className="gil-error-footer"><span>Next review: {new Date(e.due).toLocaleDateString()}</span><button onClick={()=>markReviewed(q.id)}>Mark reviewed <Check size={15}/></button></div></article>})}</div>:<div className="gil-empty gil-empty-large"><BrainCircuit/><h2>Your notebook is ready.</h2><p>Incorrect and skipped questions from submitted tests will appear here. Start with a Quick Test to create your first review items.</p><button onClick={()=>setTab("arena")}>Go to Test Arena</button></div>}
    </section>}

    {tab==="analytics" && <section className="gil-section">
      <header className="gil-heading"><p className="gil-kicker">PERFORMANCE INTELLIGENCE</p><h1>Measure what <em>improves.</em></h1><p>All metrics below are calculated from your saved attempts on this browser. No demo scores are mixed into your results.</p></header>
      {attempts.length?<><div className="gil-metrics"><article><span>TESTS COMPLETED</span><strong>{attempts.length}</strong><small>Saved in this browser</small></article><article><span>OVERALL ACCURACY</span><strong>{accuracy}%</strong><small>{correctAnswered} correct / {totalAnswered} questions</small></article><article><span>APPLICATION ACCURACY</span><strong>{appTotal?applicationAccuracy+"%":"—"}</strong><small>{appCorrect} / {appTotal} application questions</small></article><article><span>AVERAGE TIME / QUESTION</span><strong>{totalAnswered?Math.round(attempts.reduce((n,a)=>n+a.seconds,0)/totalAnswered)+"s":"—"}</strong><small>Across completed tests</small></article></div><div className="gil-panel"><h2>Recent performance</h2>{attempts.slice(0,10).map(a=><div className="gil-bar-row" key={a.id}><span>{new Date(a.date).toLocaleDateString()} · {a.mode}</span><div><i style={{width:pct(a.correct,a.total)+"%"}}/></div><strong>{pct(a.correct,a.total)}%</strong></div>)}</div><div className="gil-panel"><h2>Subject-wise accuracy</h2>{Array.from(new Set(attempts.flatMap(a=>a.questionIds.map(id=>gpatPyqs.find(q=>q.id===id)?.subject).filter(Boolean) as string[]))).map(s=>{const ids=attempts.flatMap(a=>a.questionIds).filter(id=>gpatPyqs.find(q=>q.id===id)?.subject===s);const good=ids.filter(id=>attempts.some(a=>a.correctQuestionIds?.includes(id)));return <div className="gil-bar-row" key={s}><span>{s}</span><div><i style={{width:pct(good.length,ids.length)+"%"}}/></div><strong>{pct(good.length,ids.length)}%</strong></div>})}</div></>:<div className="gil-empty gil-empty-large"><Target/><h2>Insights unlock after your first test.</h2><p>Complete a test to calculate accuracy, application gap, time per question and weak topics from your actual answers.</p><button onClick={()=>setTab("arena")}>Start a test</button></div>}
    </section>}

    <footer className="gil-footer"><span>AKATSUKI TRIALS · GPAT PRACTICE</span><Link href="/learning">Back to Learning Studio <ArrowRight size={14}/></Link></footer>
  </div>;
}
