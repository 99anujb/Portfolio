import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { localAnswer } from "../data/knowledge";
import "./styles/SpeakingAvatar.css";

const INTRO_TEXT =
  "Hi! I'm Anuj Bansal, a data scientist and analyst. I turn raw data into " +
  "business decisions — from SQL and Tableau dashboards to deep learning " +
  "research. I've built twelve projects across machine learning, business " +
  "analytics, and AI agents, and I'm currently open to data analyst, " +
  "business analyst, and data scientist roles. Scroll down to see my work, " +
  "or reach out — I'd love to talk.";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Has Anuj built churn models?",
  "What's his Tableau work?",
  "Is he open to analyst roles?",
];

// Renders **bold** segments without dangerouslySetInnerHTML
function RichText({ text }: { text: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
    </>
  );
}

const SpeakingAvatar = () => {
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking, open]);

  const stopVoice = useCallback(() => {
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const speakWithSynthesis = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      setSpeaking(false);
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
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, []);

  const playIntro = useCallback(() => {
    if (speaking) {
      stopVoice();
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio("/intro-voice.m4a");
      audioRef.current.preload = "auto";
    }
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.onended = () => setSpeaking(false);
    audio
      .play()
      .then(() => setSpeaking(true))
      .catch(() => speakWithSynthesis());
  }, [speaking, stopVoice, speakWithSynthesis]);

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim().slice(0, 1000);
      if (!trimmed || thinking) return;
      const history: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(history);
      setInput("");
      setThinking(true);

      let reply: string | null = null;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-10) }),
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.reply === "string") reply = data.reply;
        }
      } catch {
        // fall through to local answer
      }
      if (!reply) reply = localAnswer(trimmed);

      setMessages([...history, { role: "assistant", content: reply }]);
      setThinking(false);
    },
    [messages, thinking]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  useEffect(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    return () => {
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <div className={`speaking-avatar ${speaking ? "is-speaking" : ""}`}>
      {open && (
        <div className="aj-chat-panel">
          <div className="aj-chat-header">
            <span className="aj-chat-title">Ask AJ-Bot</span>
            <div className="aj-chat-actions">
              <button
                className="aj-chat-voice"
                onClick={playIntro}
                data-cursor="disable"
                aria-label={speaking ? "Stop intro" : "Play spoken intro"}
              >
                {speaking ? "■ Stop" : "▶ Hear intro"}
              </button>
              <button
                className="aj-chat-close"
                onClick={() => setOpen(false)}
                data-cursor="disable"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="aj-chat-messages" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="aj-chat-empty">
                <p>
                  Hi! I answer questions about Anuj — his projects, skills, and
                  availability. Try one of these:
                </p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="aj-chat-suggestion"
                    onClick={() => ask(s)}
                    data-cursor="disable"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`aj-msg aj-msg-${m.role}`}>
                <RichText text={m.content} />
              </div>
            ))}
            {thinking && (
              <div className="aj-msg aj-msg-assistant aj-msg-thinking">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <form className="aj-chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Anuj..."
              maxLength={1000}
              data-cursor="disable"
            />
            <button
              type="submit"
              disabled={thinking || !input.trim()}
              data-cursor="disable"
            >
              ↑
            </button>
          </form>
        </div>
      )}

      {!open && (
        <span className="avatar-hint">Ask me about Anuj — or hear his intro</span>
      )}

      <button
        className="avatar-bot"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AJ-Bot" : "Open AJ-Bot chat"}
        aria-expanded={open}
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
