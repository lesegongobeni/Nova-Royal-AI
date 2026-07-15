import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Mail,
  Mic,
  Calendar,
  Volume2,
  Wand2,
  ListChecks,
  Sparkles,
  Crown,
} from "lucide-react";
import novaVideo from "@/assets/nova-business.mp4.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova AI — Voice Workplace Assistant" },
      {
        name: "description",
        content:
          "Nova is a voice-controlled AI workplace assistant for email, meetings, and scheduling.",
      },
      { property: "og:title", content: "Nova AI — Voice Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Voice-controlled AI assistant for email, meetings, and scheduling.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Nova,
});

function Nova() {
  const [active, setActive] = useState("dashboard");
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Initializing Nova...");
  const [emailText, setEmailText] = useState(
    "Subject: Project Update\nHi Team,\n\nJust checking in on the Q4 deliverables. Please send updates by EOD Friday.\n\nBest,\nVint",
  );
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const t = setTimeout(() => setStatus("Hi, I'm Nova. How can I help?"), 1500);
    return () => clearTimeout(t);
  }, []);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    utterance.voice =
      voices.find((v) => v.name.includes("Female")) || voices[0];
    utterance.rate = 0.95;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  };

  const handleCommand = (cmd: string) => {
    if (cmd.includes("check email") || cmd.includes("read email")) {
      setActive("email");
      setStatus("Checking your inbox");
      speak(
        "You have 3 unread emails. Latest from your manager about project update.",
      );
    } else if (
      cmd.includes("check schedule") ||
      cmd.includes("scheduler") ||
      cmd.includes("calendar")
    ) {
      setActive("scheduler");
      setStatus("Here is your schedule");
      speak("You have 2 meetings today. 10am with Client, and 3pm team sync.");
    } else if (cmd.includes("set meeting") || cmd.includes("schedule meeting")) {
      setActive("meeting");
      setStatus("Let's set a meeting");
      speak("Who is the meeting with and what time?");
    } else if (cmd.includes("summarize")) {
      setActive("meeting");
      speak("Please paste your meeting notes and I will summarize them.");
    } else {
      speak("Try saying: check email, check schedule, or set meeting");
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported. Use Chrome.");
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setStatus("Listening...");
    };
    recognitionRef.current.onresult = (e: any) => {
      const command = e.results[0][0].transcript.toLowerCase();
      handleCommand(command);
    };
    recognitionRef.current.onend = () => {
      setIsListening(false);
      setStatus("I'm here");
    };
    recognitionRef.current.start();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
      {/* NOVA AI AVATAR */}
      <div className="fixed top-6 right-6 z-50">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center shadow-2xl w-48">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#0057FF] to-[#FF0033] flex items-center justify-center mb-2 border-2 border-[#00FF88]">
            <User size={40} className="text-white" />
          </div>
          <p className="text-white font-bold text-lg">Nova</p>
          <p className="text-xs text-white/60 text-center mb-2">{status}</p>
          <button
            onClick={startListening}
            className={`w-full py-2 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition ${
              isListening
                ? "bg-[#FF0033] animate-pulse"
                : "bg-gradient-to-r from-[#0057FF] to-[#00FF88]"
            }`}
          >
            <Mic size={16} /> {isListening ? "Listening" : "Talk"}
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#111] border-r border-white/10 p-6">
        <h1 className="text-3xl font-bold mb-10">
          Nova<span className="text-[#0057FF]">AI</span>
        </h1>
        <button
          onClick={() => setActive("dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
            active === "dashboard"
              ? "bg-[#0057FF] text-white"
              : "text-white/70 hover:bg-white/5"
          }`}
        >
          <Wand2 /> Dashboard
        </button>
        <button
          onClick={() => setActive("email")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
            active === "email"
              ? "bg-[#0057FF] text-white"
              : "text-white/70 hover:bg-white/5"
          }`}
        >
          <Mail /> Email Gen
        </button>
        <button
          onClick={() => setActive("meeting")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
            active === "meeting"
              ? "bg-[#0057FF] text-white"
              : "text-white/70 hover:bg-white/5"
          }`}
        >
          <Calendar /> Meeting AI
        </button>
        <button
          onClick={() => setActive("scheduler")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
            active === "scheduler"
              ? "bg-[#0057FF] text-white"
              : "text-white/70 hover:bg-white/5"
          }`}
        >
          <ListChecks /> Scheduler
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-64 p-8">
        {active === "dashboard" && (
          <div>
            <h2 className="text-4xl font-bold">Welcome to Nova</h2>
            <p className="text-white/70 mt-2 mb-6">
              Your voice-controlled AI workplace assistant
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                title="Voice Commands"
                desc="Say: Check Email, Check Schedule, Set Meeting"
                color="border-[#0057FF]"
              />
              <Card
                title="Smart Email"
                desc="AI drafts + reads emails aloud"
                color="border-[#FF0033]"
              />
              <Card
                title="Auto Scheduler"
                desc="Plan and set meetings with voice"
                color="border-[#00FF88]"
              />
            </div>
          </div>
        )}

        {active === "email" && (
          <div>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Mail /> Smart Email Generator
            </h2>
            <div className="bg-[#111111] border border-white/10 p-6 rounded-2xl">
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                className="w-full h-48 bg-[#0A0A0A] border border-white/10 p-3 rounded-xl mb-4 text-white"
              />
              <div className="flex gap-3">
                <button className="bg-gradient-to-r from-[#0057FF] to-[#FF0033] text-white px-6 py-3 rounded-xl">
                  Generate with AI
                </button>
                <button
                  onClick={() => speak(emailText)}
                  className="bg-[#00FF88] text-black px-6 py-3 rounded-xl flex items-center gap-2 font-bold"
                >
                  <Volume2 /> Read Aloud
                </button>
              </div>
              <p className="text-sm text-white/60 mt-3">
                Tip: Say "Nova, read my email"
              </p>
            </div>
          </div>
        )}

        {active === "meeting" && (
          <div>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <Calendar /> Meeting AI
            </h2>
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl mb-4">
              <h3 className="font-bold mb-2">1. Summarize Meeting</h3>
              <textarea
                placeholder="Paste transcript..."
                className="w-full h-32 bg-[#0A0A0A] border border-white/10 p-3 rounded-xl mb-3"
              />
              <button className="bg-gradient-to-r from-[#0057FF] to-[#FF0033] text-white px-6 py-3 rounded-xl">
                Summarize
              </button>
            </div>
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
              <h3 className="font-bold mb-2">2. Set New Meeting</h3>
              <input
                placeholder="Who: John from Marketing"
                className="w-full bg-[#0A0A0A] border border-white/10 p-3 rounded-xl mb-3"
              />
              <input
                placeholder="When: Tomorrow 2pm"
                className="w-full bg-[#0A0A0A] border border-white/10 p-3 rounded-xl mb-3"
              />
              <input
                placeholder="Topic: Q4 Planning"
                className="w-full bg-[#0A0A0A] border border-white/10 p-3 rounded-xl mb-4"
              />
              <button className="bg-gradient-to-r from-[#0057FF] to-[#00FF88] text-black px-6 py-3 rounded-xl font-bold">
                Set Meeting
              </button>
            </div>
          </div>
        )}

        {active === "scheduler" && (
          <div>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <ListChecks /> Your Schedule
            </h2>
            <div className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-3">
              <div className="p-3 bg-[#0057FF]/20 rounded-xl border-l-4 border-[#0057FF]">
                10:00 AM - Client Call
              </div>
              <div className="p-3 bg-[#FF0033]/20 rounded-xl border-l-4 border-[#FF0033]">
                3:00 PM - Team Sync
              </div>
              <div className="p-3 bg-[#00FF88]/20 rounded-xl border-l-4 border-[#00FF88]">
                5:00 PM - Submit Report
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Card = ({
  title,
  desc,
  color,
}: {
  title: string;
  desc: string;
  color: string;
}) => (
  <div className={`bg-[#111] border ${color} p-6 rounded-2xl`}>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-white/70 text-sm">{desc}</p>
  </div>
);
