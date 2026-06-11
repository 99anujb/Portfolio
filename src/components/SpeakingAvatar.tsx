import { useCallback, useEffect, useRef, useState } from "react";
import "./styles/SpeakingAvatar.css";

const INTRO_TEXT =
  "Hi! I'm Anuj Bansal, a data scientist and analyst. I turn raw data into " +
  "business decisions — from SQL and Tableau dashboards to deep learning " +
  "research. I've built twelve projects across machine learning, business " +
  "analytics, and AI agents, and I'm currently open to data analyst, " +
  "business analyst, and data scientist roles. Scroll down to see my work, " +
  "or reach out — I'd love to talk.";

const SpeakingAvatar = () => {
  const [speaking, setSpeaking] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setShowBubble(false);
  }, []);

  const speakWithSynthesis = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      setSpeaking(false);
      setShowBubble(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(INTRO_TEXT);
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.name.includes("Google US English")) ||
      voices.find((v) => v.lang === "en-US") ||
      null;
    if (preferred) utterance.voice = preferred;
    utterance.onend = () => {
      setSpeaking(false);
      setShowBubble(false);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setShowBubble(false);
    };
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
    setShowBubble(true);
  }, []);

  const speak = useCallback(() => {
    // Prefer the pre-generated voiceover file; fall back to browser TTS
    if (!audioRef.current) {
      audioRef.current = new Audio("/intro-voice.m4a");
      audioRef.current.preload = "auto";
    }
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.onended = () => {
      setSpeaking(false);
      setShowBubble(false);
    };
    audio
      .play()
      .then(() => {
        setSpeaking(true);
        setShowBubble(true);
      })
      .catch(() => speakWithSynthesis());
  }, [speakWithSynthesis]);

  const toggle = useCallback(() => {
    if (speaking) stop();
    else speak();
  }, [speaking, speak, stop]);

  useEffect(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    return () => {
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <div className={`speaking-avatar ${speaking ? "is-speaking" : ""}`}>
      {showBubble && (
        <div className="avatar-bubble" role="status">
          <p>{INTRO_TEXT}</p>
        </div>
      )}
      {!showBubble && (
        <span className="avatar-hint">Click me — I'll introduce Anuj</span>
      )}
      <button
        className="avatar-bot"
        onClick={toggle}
        aria-label={
          speaking ? "Stop spoken introduction" : "Play spoken introduction"
        }
        data-cursor="disable"
      >
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <line
            x1="32"
            y1="4"
            x2="32"
            y2="12"
            stroke="#5eead4"
            strokeWidth="2.5"
          />
          <circle cx="32" cy="4" r="3" fill="#5eead4" className="bot-antenna" />
          <rect
            x="10"
            y="12"
            width="44"
            height="38"
            rx="10"
            fill="#0d1424"
            stroke="#5eead4"
            strokeWidth="2.5"
          />
          <circle cx="23" cy="28" r="4" fill="#5eead4" className="bot-eye" />
          <circle cx="41" cy="28" r="4" fill="#5eead4" className="bot-eye" />
          <g className="bot-mouth">
            <rect x="21" y="38" width="3.5" height="6" rx="1.5" fill="#5eead4" />
            <rect x="27" y="36" width="3.5" height="10" rx="1.5" fill="#5eead4" />
            <rect x="33" y="38" width="3.5" height="6" rx="1.5" fill="#5eead4" />
            <rect x="39" y="37" width="3.5" height="8" rx="1.5" fill="#5eead4" />
          </g>
          <rect x="24" y="54" width="16" height="5" rx="2.5" fill="#5eead4" opacity="0.5" />
        </svg>
      </button>
    </div>
  );
};

export default SpeakingAvatar;
