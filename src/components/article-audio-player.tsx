"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Square, Volume2 } from "lucide-react";

type VoiceOption = { voice: SpeechSynthesisVoice; gender: "female" | "male" | "other" };

function voiceGender(name: string): VoiceOption["gender"] {
  const value = name.toLowerCase();
  if (/female|woman|samantha|karen|moira|tessa|victoria|zira|susan|aria|jenny|sonia|heera|veena|lekha|raveena|google uk english female|microsoft.*(zira|aria|jenny)/.test(value)) return "female";
  if (/male|man|daniel|alex|tom|david|george|james|guy|ryan|aaron|fred|rishi|prabhat|microsoft.*(guy|david|mark)/.test(value)) return "male";
  return "other";
}

function splitText(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [clean];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    const next = current ? current + " " + sentence.trim() : sentence.trim();
    if (next.length > 1800 && current) {
      chunks.push(current);
      current = sentence.trim();
    } else current = next;
  }
  if (current) chunks.push(current);
  return chunks;
}

export function ArticleAudioPlayer({ targetId }: { targetId: string }) {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(0.95);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [message, setMessage] = useState("");
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const activeRef = useRef(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const rateRef = useRef(rate);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setMessage("Audio reading is not supported in this browser.");
      return;
    }
    const load = () => {
      const available = window.speechSynthesis.getVoices().map((voice) => ({ voice, gender: voiceGender(voice.name) }));
      setVoices(available);
      if (!selectedVoice) {
        const preferred = available.find((item) => item.gender === "female" && /en[-_](in|gb|us)/i.test(item.voice.lang))
          ?? available.find((item) => item.gender === "female" && item.voice.lang.toLowerCase().startsWith("en"))
          ?? available.find((item) => item.voice.lang.toLowerCase().startsWith("en"));
        if (preferred) setSelectedVoice(preferred.voice.voiceURI);
      }
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [selectedVoice]);

  useEffect(() => { rateRef.current = rate; }, [rate]);

  const stop = useCallback(() => {
    activeRef.current = false;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setStatus("idle");
  }, []);

  const speakNext = useCallback(() => {
    if (!activeRef.current) return;
    const chunk = chunksRef.current[indexRef.current];
    if (!chunk) {
      activeRef.current = false;
      setStatus("idle");
      setMessage("Finished reading this article.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.rate = rateRef.current;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = voiceRef.current?.lang ?? "en-IN";
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.onend = () => {
      indexRef.current += 1;
      speakNext();
    };
    utterance.onerror = (event) => {
      if (event.error !== "canceled" && event.error !== "interrupted") {
        activeRef.current = false;
        setStatus("idle");
        setMessage("This voice could not read the article. Try another voice.");
      }
    };
    window.speechSynthesis.speak(utterance);
  }, []);

  const play = () => {
    if (!("speechSynthesis" in window)) return;
    if (status === "paused") {
      window.speechSynthesis.resume();
      activeRef.current = true;
      setStatus("playing");
      return;
    }
    const article = document.getElementById(targetId);
    const text = article?.innerText?.trim();
    if (!text) {
      setMessage("Article text is not available to read.");
      return;
    }
    window.speechSynthesis.cancel();
    chunksRef.current = splitText(text);
    indexRef.current = 0;
    voiceRef.current = voices.find((item) => item.voice.voiceURI === selectedVoice)?.voice ?? null;
    activeRef.current = true;
    setMessage("");
    setStatus("playing");
    speakNext();
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setStatus("paused");
  };

  useEffect(() => () => {
    activeRef.current = false;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const femaleVoices = voices.filter((item) => item.gender === "female");
  const maleVoices = voices.filter((item) => item.gender === "male");
  const otherVoices = voices.filter((item) => item.gender === "other");

  return (
    <section className="article-audio reading-container" aria-label="Listen to this article">
      <div className="article-audio-top">
        <div className="article-audio-heading">
          <span className="article-audio-icon"><Volume2 size={17}/></span>
          <div><strong>Listen to this article</strong><small>Text-to-speech · Uses voices available on your device</small></div>
        </div>
        <span className="article-audio-status">{status === "playing" ? "NOW PLAYING" : status === "paused" ? "PAUSED" : "READY"}</span>
      </div>
      <div className="article-audio-controls">
        <div className="article-audio-buttons">
          {status === "playing" ? (
            <button type="button" className="article-audio-primary" onClick={pause}><Pause size={16} fill="currentColor"/> Pause</button>
          ) : (
            <button type="button" className="article-audio-primary" onClick={play}><Play size={16} fill="currentColor"/> {status === "paused" ? "Resume" : "Play article"}</button>
          )}
          <button type="button" className="article-audio-secondary" onClick={stop} disabled={status === "idle"}><Square size={14}/> Stop</button>
          <button type="button" className="article-audio-secondary" onClick={() => { stop(); indexRef.current = 0; setMessage("Ready to start from the beginning."); }} title="Restart article"><RotateCcw size={14}/><span className="sr-only">Restart</span></button>
        </div>
        <label className="article-audio-field"><span>Voice</span>
          <select value={selectedVoice} onChange={(event) => { setSelectedVoice(event.target.value); if (status !== "idle") stop(); }} disabled={voices.length === 0}>
            <optgroup label="Female voices">{femaleVoices.map(({voice}) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} · {voice.lang}</option>)}</optgroup>
            <optgroup label="Male voices">{maleVoices.map(({voice}) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} · {voice.lang}</option>)}</optgroup>
            {otherVoices.length > 0 && <optgroup label="Other voices">{otherVoices.map(({voice}) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} · {voice.lang}</option>)}</optgroup>}
          </select>
        </label>
        <label className="article-audio-speed"><span>Speed <strong>{rate.toFixed(2)}×</strong></span>
          <input type="range" min="0.75" max="1.15" step="0.05" value={rate} onChange={(event) => setRate(Number(event.target.value))}/>
        </label>
      </div>
      <p className="article-audio-note" aria-live="polite">{message || (voices.length ? "Choose a female or male voice, then press play. Voice quality depends on your device and browser." : "Loading available voices…")}</p>
    </section>
  );
}
