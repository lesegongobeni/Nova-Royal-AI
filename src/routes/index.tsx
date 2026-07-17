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
import novaVideo from "@/assets/nova-royal.mp4.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova AI — Voice Workplace Assistant" },
      {
        name: "description",
        content:
          "Nova is a voice-controlled AI workplace assistant for saving time with email, meetings, and scheduling.",
      },
      { property: "og:title", content: "Nova AI — Voice Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Nova is a voice-controlled AI workplace assistant for saving time with email, meetings, and scheduling.",
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
  const [isTalking, setIsTalking] = useState(false);
  const [status, setStatus] = useState("Initializing Nova...");
  const [emailText, setEmailText] = useState(
    "Subject: Project Update\n\nHi Team,\n\nJust checking in on the Q4 deliverables. Please send updates by EOD Friday.\n\nBest,\nVint",
  );
  const [meetingNotes, setMeetingNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [meetingWith, setMeetingWith] = useState("");
  const [meetingWhen, setMeetingWhen] = useState("");
  const [meetingTopic, setMeetingTopic] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const t = setTimeout(() => setStatus("Hi, I'm Nova. How can I help?"), 1500);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    return () => clearTimeout(t);
  }, []);

  const COLORS = {
    black: "#0A0A0A",
    white: "#F5F5F5",
    royal: "#4F46E5",
    gold: "#FBBF24",
    emerald: "#10B981",
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setIsTalking(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    utterance.voice =
      voices.find((v) => v.name.includes("Female")) || voices[0];
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.onend = () => setIsTalking(false);
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

  const handleSummarize = () => {
    if (!meetingNotes) return;
    const s =
      "Key Points:\n1. Q4 targets discussed\n2. Deadline moved to Friday\n3. Action items assigned to team";
    setSummary(s);
    speak(
      "Here is your summary. Q4 targets discussed. Deadline moved to Friday. Action items assigned to team.",
    );
  };

  const handleSetMeeting = () => {
    if (!meetingWith || !meetingWhen) return alert("Please fill Who and When");
    speak(
      `Meeting set with ${meetingWith} on ${meetingWhen} about ${meetingTopic}`,
    );
    setStatus("Meeting Scheduled");
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
      {/* ROYAL GRID BACKGROUND */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(79,70,229,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.08)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* 3D HOLOGRAM AI AVATAR */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-[#4F46E5] blur-3xl opacity-50"></div>
          <div className="absolute inset-0 rounded-2xl bg-[#FBBF24] blur-2xl opacity-30"></div>
          <video
            ref={videoRef}
            src={novaVideo.url}
            loop
            muted
            playsInline
            className={`relative w-48 h-48 rounded-2xl border-2 border-[#FBBF24] shadow-[0_0_40px_#4F46E5] object-cover transition-all duration-300 ${
              isTalking ? "animate-bounce scale-105 shadow-[0_0_60px_#FBBF24]" : ""
            }`}
          />
          <div className="mt-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-3 w-48">
            <div className="flex items-center justify-center gap-2">
              <Crown size={14} className="text-[#FBBF24]" />
              <p className="text-[#F5F5F5] font-bold">Nova</p>
            </div>
            <p className="text-xs text-[#10B981] text-center mb-2">{status}</p>
            <button
              onClick={startListening}
              className={`w-full py-2 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                isListening
                  ? "bg-[#E11D48] shadow-[0_0_20px_#E11D48] animate-pulse"
                  : "bg-gradient-to-r from-[#4F46E5] to-[#FBBF24] text-black shadow-[0_0_20px_#4F46E5]"
              }`}
            >
              <Mic size={16} /> {isListening ? "Listening" : "Talk"}
            </button>
          </div>
        </div>
      </div>

      {/* SIDEBAR - ROYAL GLASS */}
      <div className="fixed left-0 top-0 h-full w-64 backdrop-blur-2xl bg-white/5 border-r border-white/10 p-6">
        <h1 className="text-3xl font-bold mb-10 bg-gradient-to-r from-[#4F46E5] via-[#FBBF24] to-[#10B981] bg-clip-text text-transparent flex items-center gap-2">
          <Crown /> Nova<span className="text-[#FBBF24]">AI</span>
        </h1>
        <NavItem icon={Wand2} label="Dashboard" active={active === "dashboard"} onClick={() => setActive("dashboard")} color={COLORS.royal} />
        <NavItem icon={Mail} label="Email Gen" active={active === "email"} onClick={() => setActive("email")} color={COLORS.gold} />
        <NavItem icon={Calendar} label="Meeting AI" active={active === "meeting"} onClick={() => setActive("meeting")} color={COLORS.emerald} />
        <NavItem icon={ListChecks} label="Scheduler" active={active === "scheduler"} onClick={() => setActive("scheduler")} color={COLORS.royal} />
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-64 p-8">
        {active === "dashboard" && (
          <div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#4F46E5] via-[#FBBF24] to-[#10B981] bg-clip-text text-transparent">Welcome to Nova Royal</h2>
            <p className="text-[#F5F5F5]/70 mt-2 mb-6">Your Executive 3D AI Assistant</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlowCard title="Executive Voice" desc="3D Avatar + Premium Female Voice" color={COLORS.royal} />
              <GlowCard title="Smart Email" desc="AI drafts + reads emails aloud" color={COLORS.gold} />
              <GlowCard title="Auto Scheduler" desc="Plan meetings with voice" color={COLORS.emerald} />
            </div>
            <button
              onClick={() => speak("Good day. I am Nova, your executive assistant. I can manage your email, schedule, and meetings.")}
              className="mt-6 bg-gradient-to-r from-[#FBBF24] to-[#4F46E5] text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Volume2 /> Test Nova's Voice
            </button>
          </div>
        )}

        {active === "email" && (
          <div>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2 text-[#4F46E5]">
              <Mail /> Smart Email Generator
            </h2>
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.2)]">
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                className="w-full h-48 bg-[#0A0A0A] border border-white/10 p-3 rounded-xl mb-4 text-[#F5F5F5]"
              />
              <div className="flex gap-3">
                <button className="bg-gradient-to-r from-[#4F46E5] to-[#FBBF24] text-black px-6 py-3 rounded-xl font-bold">
                  Generate with AI
                </button>
                <button
                  onClick={() => speak(emailText)}
                  className="bg-gradient-to-r from-[#10B981] to-[#4F46E5] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold"
                >
                  <Volume2 /> Read Aloud
                </button>
              </div>
            </div>
          </div>
        )}

        {active === "meeting" && (
          <div>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2 text-[#FBBF24]">
              <Calendar /> Meeting AI
            </h2>
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 p-6 rounded-2xl mb-4">
              <h3 className="font-bold mb-2">1. Summarize Meeting</h3>
              <textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                placeholder="Paste transcript..."
                className="w-full h-32 bg-[#0A0A0A] border border-white/10 p-3 rounded-xl mb-3 text-[#F5F5F5]"
              />
              <button
                onClick={handleSummarize}
                className="bg-gradient-to-r from-[#FBBF24] to-[#4F46E5] text-black px-6 py-3 rounded-xl font-bold"
              >
                Summarize
              </button>
              {summary && (
                <div className="mt-4 p-4 bg-[#0A0A0A] rounded-xl whitespace-pre-line">
                  {summary}
                </div>
              )}
            </div>
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="font-bold mb-2">2. Set New Meeting</h3>
              <input
                value={meetingWith}
                onChange={(e) => setMeetingWith(e.target.value)}
                placeholder="Who: John from Marketing"
                className="w-full bg-[#0A0A0A] border border-white/10 p-3 rounded-xl mb-3 text-[#F5F5F5]"
              />
              <input
                value={meetingWhen}
                onChange={(e) => setMeetingWhen(e.target.value)}
                placeholder="When: Tomorrow 2pm"
                className="w-full bg-[#0A0A0A] border border-white/10 p-3 rounded-xl mb-3 text-[#F5F5F5]"
              />
              <input
                value={meetingTopic}
                onChange={(e) => setMeetingTopic(e.target.value)}
                placeholder="Topic: Q4 Planning"
                className="w-full bg-[#0A0A0A] border border-white/10 p-3 rounded-xl mb-4 text-[#F5F5F5]"
              />
              <button
                onClick={handleSetMeeting}
                className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] text-white px-6 py-3 rounded-xl font-bold"
              >
                Set Meeting
              </button>
            </div>
          </div>
        )}

        {active === "scheduler" && (
          <div>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2 text-[#10B981]">
              <ListChecks /> Your Schedule
            </h2>
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
              <ScheduleItem time="10:00 AM" task="Client Call" color={COLORS.royal} />
              <ScheduleItem time="3:00 PM" task="Team Sync" color={COLORS.gold} />
              <ScheduleItem time="5:00 PM" task="Submit Report" color={COLORS.emerald} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const NavItem = ({
  icon: Icon,
  label,
  active,
  onClick,
  color,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition ${active ? "shadow-lg text-white" : "text-[#F5F5F5]/70 hover:bg-white/5"}`}
    style={{ background: active ? `linear-gradient(to right, ${color}, #FBBF24)` : "" }}
  >
    <Icon size={18} /> {label}
  </button>
);

const GlowCard = ({ title, desc, color }: { title: string; desc: string; color: string }) => (
  <div className="backdrop-blur-2xl bg-white/5 border border-white/10 p-6 rounded-2xl" style={{ boxShadow: `0 0 30px ${color}20` }}>
    <Sparkles className="mb-2" style={{ color }} />
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-[#F5F5F5]/70 text-sm">{desc}</p>
  </div>
);

const ScheduleItem = ({ time, task, color }: { time: string; task: string; color: string }) => (
  <div className="p-4 bg-[#0A0A0A] rounded-xl border-l-4" style={{ borderColor: color, boxShadow: `0 0 15px ${color}30` }}>
    <p className="font-bold" style={{ color }}>{time}</p>
    <p>{task}</p>
  </div>
);
