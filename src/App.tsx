import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sparkles, 
  MapPin, 
  GraduationCap, 
  Search, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Briefcase, 
  DollarSign, 
  Award, 
  BadgeHelp,
  Hammer,
  Laptop,
  Utensils,
  Sprout,
  HeartPulse,
  Car,
  Palette,
  Info,
  FileText,
  AlertTriangle,
  Trash2,
  ChevronDown,
  ChevronUp,
  type LucideIcon
} from "lucide-react";
import Navbar from "./components/Navbar";
import PageHeader from "./components/PageHeader";
import BottomNav from "./components/BottomNav";
import LandingPage from "./components/LandingPage";
import AssessmentWizard from "./components/AssessmentWizard";
import ProfileMiniForm from "./components/ProfileMiniForm";
import { PHILIPPINES_REGIONS, SECTORS_DATA, TESDA_FAQ, TESDA_FAQ_EN, Sector } from "./data/tesdaData";
import { UserProfile, MatchingResult, ChatMessage, JobMatchCourse, JobMatchResult } from "./types";

const ChatBubble = React.memo(function ChatBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} max-w-full animate-slide-in`}>
      <div
        className={`rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm leading-relaxed max-w-[80%] sm:max-w-[75%] ${
          msg.role === "user"
            ? "bg-kt-blue text-white rounded-tr-none"
            : "bg-white text-kt-near-black border border-kt-border rounded-tl-none whitespace-pre-line"
        }`}
      >
        <div className="font-medium break-words">{msg.text}</div>
        <div className={`text-xs mt-2 ${msg.role === "user" ? "text-white/70" : "text-kt-slate"}`}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
});

// Dynamic mapper for Sector icons
const getSectorIcon = (iconName: string) => {
  switch (iconName) {
    case "Laptop":
      return <Laptop className="h-6 w-6 text-kt-blue" />;
    case "Utensils":
      return <Utensils className="h-6 w-6 text-kt-success" />;
    case "Hammer":
      return <Hammer className="h-6 w-6 text-kt-gold" />;
    case "Sprout":
      return <Sprout className="h-6 w-6 text-kt-success" />;
    case "HeartPulse":
      return <HeartPulse className="h-6 w-6 text-kt-blue" />;
    case "Car":
      return <Car className="h-6 w-6 text-kt-gold" />;
    case "Palette":
      return <Palette className="h-6 w-6 text-kt-chat-purple" />;
    default:
      return <GraduationCap className="h-6 w-6 text-kt-blue" />;
  }
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const VALID_TABS = ["landing", "match", "explorer", "jobs", "chat", "faq"];
  const rawTab = location.pathname === "/" ? "landing" : location.pathname.slice(1);
  const currentTab = VALID_TABS.includes(rawTab) ? rawTab : "landing";
  useEffect(() => {
    if (!VALID_TABS.includes(rawTab) && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [rawTab, location.pathname, navigate]);
  const [lang, setLang] = useState<"fil" | "en">(() => {
    try {
      const saved = localStorage.getItem("kt-lang");
      return (saved === "en" || saved === "fil") ? saved : "fil";
    } catch { return "fil"; }
  });
  
  // Form profile states
  const [age, setAge] = useState<number>(() => {
    try { const v = localStorage.getItem("kt-age"); return v ? parseInt(v, 10) || 18 : 18; } catch { return 18; }
  });
  const [education, setEducation] = useState<string>(() => {
    try { return localStorage.getItem("kt-education") || "Junior High School Graduate"; } catch { return "Junior High School Graduate"; }
  });
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    try { return localStorage.getItem("kt-region") || "NCR"; } catch { return "NCR"; }
  });
  const [selectedProvince, setSelectedProvince] = useState<string>(() => {
    try { return localStorage.getItem("kt-province") || "Metro Manila - East (Quezon City, Marikina)"; } catch { return "Metro Manila - East (Quezon City, Marikina)"; }
  });
  const [selectedProvincesList, setSelectedProvincesList] = useState<string[]>(() => {
    try {
      const r = PHILIPPINES_REGIONS.find(rg => rg.code === (localStorage.getItem("kt-region") || "NCR"));
      return r?.provinces || [];
    } catch { return []; }
  });
  
  // Custom Tag selections for interests
  const [customInterests, setCustomInterests] = useState<string[]>(() => {
    try { const v = localStorage.getItem("kt-interests"); return v ? JSON.parse(v) : []; } catch { return []; }
  });
  const [customSkills, setCustomSkills] = useState<string[]>(() => {
    try { const v = localStorage.getItem("kt-skills"); return v ? JSON.parse(v) : []; } catch { return []; }
  });
  const [interestInput, setInterestInput] = useState<string>("");
  const [skillInput, setSkillInput] = useState<string>("");
  const [careerGoal, setCareerGoal] = useState<string>(() => {
    try { return localStorage.getItem("kt-careerGoal") || ""; } catch { return ""; }
  });

  // Result and loading states
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<MatchingResult | null>(() => {
    try { const v = localStorage.getItem("kt-matchResult"); return v ? JSON.parse(v) : null; } catch { return null; }
  });
  const [matchError, setMatchError] = useState<string | null>(null);
  
  // Job matching states
  const [isJobMatching, setIsJobMatching] = useState<boolean>(false);
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(() => {
    try { const v = localStorage.getItem("kt-jobMatchResult"); return v ? JSON.parse(v) : null; } catch { return null; }
  });
  const [jobMatchError, setJobMatchError] = useState<string | null>(null);
  
  // Course Explorer state
  const [selectedSector, setSelectedSector] = useState<Sector>(SECTORS_DATA[0]);
  const [explorerQuery, setExplorerQuery] = useState<string>("");
  const [explorerShowJobs, setExplorerShowJobs] = useState<boolean>(false);
  const [explorerShowCourses, setExplorerShowCourses] = useState<boolean>(false);

  // Job tab state
  const [jobFormCollapsed, setJobFormCollapsed] = useState<boolean>(false);

  // FAQ accordion state
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem("kt-chatMessages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: ChatMessage & { timestamp: string }) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }));
        }
      }
    } catch {}
    return [
      {
        id: "welcome",
        role: "model",
        text: "Mabuhay! Ako si Ka-TrabaHO, ang iyong gabay sa mga libreng kurso at iskolarship ng TESDA. Pwede mo akong tanungin tungkol sa mga pre-requisites ng kurso, mga kailangang dokumento, o kung paano mag-apply. Handa akong tumulong sa iyo!",
        timestamp: new Date()
      }
    ];
  });
  const [chatInput, setChatInput] = useState<string>("");
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  
  // Rate limit tracking
  const [rateLimits, setRateLimits] = useState<Record<string, { remaining: number; resetDate: string }>>({
    recommendation: { remaining: 5, resetDate: '' },
    'job-recommendation': { remaining: 5, resetDate: '' },
    chat: { remaining: 5, resetDate: '' }
  });
  
  // Input validation states
  const [chatInputError, setChatInputError] = useState<string | null>(null);
  const [careerGoalError, setCareerGoalError] = useState<string | null>(null);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState<boolean>(() => {
    try { return !localStorage.getItem("kt-privacyAccepted"); } catch { return true; }
  });
  const [confirmClearData, setConfirmClearData] = useState<boolean>(false);
  const [expandedJobCards, setExpandedJobCards] = useState<Set<number>>(new Set());
  
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const matchingCardRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isSendingMessage]);

  // Persist profile data to localStorage
  useEffect(() => { try { localStorage.setItem("kt-lang", lang); } catch {} }, [lang]);
  useEffect(() => { try { localStorage.setItem("kt-age", String(age)); } catch {} }, [age]);
  useEffect(() => { try { localStorage.setItem("kt-education", education); } catch {} }, [education]);
  useEffect(() => { try { localStorage.setItem("kt-region", selectedRegion); } catch {} }, [selectedRegion]);
  useEffect(() => { try { localStorage.setItem("kt-province", selectedProvince); } catch {} }, [selectedProvince]);
  useEffect(() => { try { localStorage.setItem("kt-interests", JSON.stringify(customInterests)); } catch {} }, [customInterests]);
  useEffect(() => { try { localStorage.setItem("kt-skills", JSON.stringify(customSkills)); } catch {} }, [customSkills]);
  useEffect(() => { try { localStorage.setItem("kt-careerGoal", careerGoal); } catch {} }, [careerGoal]);
  useEffect(() => { try { if (matchResult) localStorage.setItem("kt-matchResult", JSON.stringify(matchResult)); else localStorage.removeItem("kt-matchResult"); } catch {} }, [matchResult]);
  useEffect(() => { try { if (jobMatchResult) localStorage.setItem("kt-jobMatchResult", JSON.stringify(jobMatchResult)); else localStorage.removeItem("kt-jobMatchResult"); } catch {} }, [jobMatchResult]);
  useEffect(() => { try { const capped = chatMessages.slice(-50); const serializable = capped.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })); localStorage.setItem("kt-chatMessages", JSON.stringify(serializable)); if (chatMessages.length > 50) setChatMessages(capped); } catch {} }, [chatMessages]);
  useEffect(() => { if (jobMatchResult) setJobFormCollapsed(true); }, [jobMatchResult]);

  const acceptPrivacy = () => {
    setShowPrivacyNotice(false);
    try { localStorage.setItem("kt-privacyAccepted", "1"); } catch {}
  };

  const handleClearAllData = () => {
    const keys = ["kt-lang","kt-age","kt-education","kt-region","kt-province","kt-interests","kt-skills","kt-careerGoal","kt-matchResult","kt-jobMatchResult","kt-chatMessages","kt-privacyAccepted"];
    keys.forEach(k => { try { localStorage.removeItem(k); } catch {} });
    setLang("fil");
    setAge(18);
    setEducation("Junior High School Graduate");
    setSelectedRegion("NCR");
    const ncr = PHILIPPINES_REGIONS.find(r => r.code === "NCR");
    setSelectedProvincesList(ncr?.provinces || []);
    setSelectedProvince(ncr?.provinces[0] || "");
    setCustomInterests([]);
    setCustomSkills([]);
    setCareerGoal("");
    setInterestInput("");
    setSkillInput("");
    setMatchResult(null);
    setJobMatchResult(null);
    setMatchError(null);
    setJobMatchError(null);
    setChatMessages([{
      id: "welcome",
      role: "model",
      text: "Mabuhay! Ako si Ka-TrabaHO, ang iyong gabay sa mga libreng kurso at iskolarship ng TESDA. Pwede mo akong tanungin tungkol sa mga pre-requisites ng kurso, mga kailangang dokumento, o kung paano mag-apply. Handa akong tumulong sa iyo!",
      timestamp: new Date()
    }]);
    setConfirmClearData(false);
    setJobFormCollapsed(false);
  };

  const handleClearChat = () => {
    setChatMessages([{
      id: "welcome",
      role: "model",
      text: "Mabuhay! Ako si Ka-TrabaHO, ang iyong gabay sa mga libreng kurso at iskolarship ng TESDA. Pwede mo akong tanungin tungkol sa mga pre-requisites ng kurso, mga kailangang dokumento, o kung paano mag-apply. Handa akong tumulong sa iyo!",
      timestamp: new Date()
    }]);
  };

  // Handle region change to update province lists
  const handleRegionChange = (regionCode: string) => {
    setSelectedRegion(regionCode);
    const region = PHILIPPINES_REGIONS.find(r => r.code === regionCode);
    if (region) {
      setSelectedProvincesList(region.provinces);
      setSelectedProvince(region.provinces[0] || "");
    } else {
      setSelectedProvincesList([]);
      setSelectedProvince("");
    }
  };

  const startAiMatching = () => {
    if (currentTab !== "match") {
      navigate("/match");
    }
    setTimeout(() => {
      matchingCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = matchingCardRef.current?.querySelector("input, select, textarea");
      (firstInput as HTMLElement)?.focus();
    }, 100);
  };

  // Pre-seed interest and skill quick tags
  const QUICK_INTERESTS = [
    { label: "Computers & Gaming", category: "ict" },
    { label: "Cooking & Baking", category: "tourism" },
    { label: "Coffee Making", category: "tourism" },
    { label: "Welding & Metalwork", category: "construction" },
    { label: "Electricity & Wiring", category: "construction" },
    { label: "Gardening & Organic Food", category: "agriculture" },
    { label: "Caring for Elders/Kids", category: "wellness" },
    { label: "Spa & Massage Services", category: "wellness" }
  ];

  const QUICK_SKILLS = [
    { label: "Basic computer use", category: "ict" },
    { label: "Using kitchen utensils", category: "tourism" },
    { label: "Fixing simple home appliances", category: "construction" },
    { label: "Drawing or Sketching", category: "ict" },
    { label: "Speaking with customers", category: "tourism" },
    { label: "Heavy physical tasks", category: "construction" }
  ];

  const PAGE_HEADER_CONTENT: Record<
    "match" | "explorer" | "chat" | "jobs" | "faq",
    {
      title: { fil: string; en: string };
      subtitle: { fil: string; en: string };
      icon: LucideIcon;
      accent: "blue" | "amber" | "emerald";
    }
  > = {
    match: {
      title: { fil: "AI Pagtutugma ng Kurso", en: "AI Course Matcher" },
      subtitle: {
        fil: "Sagutin ang ilang tanong para makita ang pinaka-angkop na TESDA course para sa iyo.",
        en: "Answer a few questions to find your best-fit TESDA course.",
      },
      icon: Sparkles,
      accent: "blue",
    },
    explorer: {
      title: { fil: "Sektor, Kurso at Trabaho", en: "Course & Job Explorer" },
      subtitle: {
        fil: "Tingnan ang mga accredited na programa at demand sa trabaho sa iyong lugar.",
        en: "Browse accredited programs and see local job demand.",
      },
      icon: Search,
      accent: "amber",
    },
    chat: {
      title: { fil: "Kausapin si Ka-TrabaHO", en: "Chat with Ka-TrabaHO" },
      subtitle: {
        fil: "Magtanong tungkol sa TESDA, scholarship, at requirements.",
        en: "Ask anything about TESDA, scholarships, and requirements.",
      },
      icon: MessageSquare,
      accent: "emerald",
    },
    jobs: {
      title: { fil: "Pamilihang Trabaho", en: "Job Market" },
      subtitle: {
        fil: "Alamin ang mga high-demand na trabahong akma sa iyong profile.",
        en: "Find high-demand roles matched to your profile.",
      },
      icon: Briefcase,
      accent: "amber",
    },
    faq: {
      title: { fil: "Mga Karaniwang Katanungan", en: "Frequently Asked Questions" },
      subtitle: {
        fil: "Mga mabilisang sagot tungkol sa TESDA programs.",
        en: "Quick answers about TESDA programs.",
      },
      icon: HelpCircle,
      accent: "blue",
    },
  };

  const toggleInterestTag = (interest: string) => {
    if (customInterests.includes(interest)) {
      setCustomInterests(customInterests.filter(i => i !== interest));
    } else {
      setCustomInterests([...customInterests, interest]);
    }
  };

  const toggleSkillTag = (skill: string) => {
    if (customSkills.includes(skill)) {
      setCustomSkills(customSkills.filter(s => s !== skill));
    } else {
      setCustomSkills([...customSkills, skill]);
    }
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (interestInput.trim() && !customInterests.includes(interestInput.trim()) && customInterests.length < 20) {
      setCustomInterests([...customInterests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillInput.trim() && !customSkills.includes(skillInput.trim()) && customSkills.length < 20) {
      setCustomSkills([...customSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  // Core API call: Match Profile
  const handleSubmitProfile = async () => {
    if (isMatching) return; // Prevent double submission

    setIsMatching(true);
    setMatchError(null);
    setMatchResult(null);

    const profile: UserProfile = {
      age,
      education,
      region: selectedRegion,
      province: selectedProvince,
      interests: customInterests.join(", "),
      practicalSkills: customSkills.join(", "),
      careerGoal: careerGoal.trim()
    };


    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      // Update rate limit tracking from headers
      const remainingHeader = response.headers.get('X-RateLimit-Remaining');
      const resetHeader = response.headers.get('X-RateLimit-Reset');
      if (remainingHeader) {
        setRateLimits(prev => ({
          ...prev,
          recommendation: { remaining: parseInt(remainingHeader), resetDate: resetHeader || '' }
        }));
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error(`Daily limit reached: ${errorData.message || 'You have used all 5 requests for today. Try again tomorrow.'}`);
        } else if (response.status === 403) {
          throw new Error(`Access blocked: ${errorData.message || 'Your IP has been blocked due to abuse.'}`);
        } else if (response.status === 413) {
          throw new Error(`Request too large: ${errorData.message || 'Please reduce the amount of text.'}`);
        } else if (response.status === 415) {
          throw new Error(`Invalid request format: ${errorData.message || 'Please try again.'}`);
        }
        throw new Error(`Server returned ${response.status}: Failed to load recommendation.`);
      }

      const data = await response.json();


      if (!data || !Array.isArray(data.recommendedCourses)) {

        setMatchError(lang === "fil" ? "Nakatanggap ang server ng kakaibang sagot. Subukang muli, o gamitin ang fallback na rekomendasyon." : "The server returned an unexpected response. Please try again, or use the fallback recommendation.");
        return;
      }
      
      setMatchResult(data);
      
      // Auto pre-populate Chatbot perspective with context
      const regionText = PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.name || selectedRegion;
      setChatMessages(prev => [
        ...prev,
        {
          id: `match-update-${Date.now()}`,
          role: "model",
           text: lang === "fil"
             ? `Salamat sa pagkumpleto ng iyong profile! Batay sa pagsusuri ko, narito ang mga pinakamagandang TESDA course para sa iyo sa ${selectedProvince || regionText}. Tingnan ang listahan sa ibaba! Kung may mabilis kang tanong ukol sa enrolment, mag-chat lang dito sa "Chat kay Ka-TrabaHO" tab!`
             : `Thank you for completing your profile! Based on my analysis, here are the best TESDA courses for you in ${selectedProvince || regionText}. Check the list below! If you have a quick question about enrollment, just chat in the "Chat with Ka-TrabaHO" tab!`,
          timestamp: new Date()
        }
      ]);

    } catch {
      setMatchError(lang === "fil" ? "Hindi namin makakonek sa aming AI server ngayon. Huwag mag-alala! Maaari mo pa ring mano-manong tingnan ang mga kurso sa 'Sektor at Kurso' tab sa itaas." : "We can't connect to our AI server right now. Don't worry! You can still manually browse courses in the 'Course & Job Explorer' tab above.");
    } finally {

      setIsMatching(false);
    }
  };

  // Job matching handler
  const handleSubmitJobMatching = async () => {
    if (isJobMatching) return; // Prevent double submission

    setIsJobMatching(true);
    setJobMatchError(null);
    setJobMatchResult(null);

    const profile = {
      age,
      education,
      region: selectedRegion,
      province: selectedProvince,
      interests: customInterests.join(", "),
      practicalSkills: customSkills.join(", "),
      careerGoal: careerGoal.trim()
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch("/api/job-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      // Update rate limit tracking from headers
      const remainingHeader = response.headers.get('X-RateLimit-Remaining');
      const resetHeader = response.headers.get('X-RateLimit-Reset');
      if (remainingHeader) {
        setRateLimits(prev => ({
          ...prev,
          'job-recommendation': { remaining: parseInt(remainingHeader), resetDate: resetHeader || '' }
        }));
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error(`Daily limit reached: ${errorData.message || 'You have used all 5 requests for today. Try again tomorrow.'}`);
        } else if (response.status === 403) {
          throw new Error(`Access blocked: ${errorData.message || 'Your IP has been blocked due to abuse.'}`);
        }
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      
      if (!data || !Array.isArray(data.recommendedJobs)) {
        throw new Error("Invalid response format from server");
      }
      
      setJobMatchResult(data);
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setJobMatchError(message || (lang === "fil" ? "Hindi namin ma-konekta sa aming AI server. Subukang muli o manu-manong tignan ang mga sektor sa itaas." : "We can't connect to our AI server. Please try again or browse sectors manually above."));
    } finally {
      setIsJobMatching(false);
    }
  };

  // Chat input validation
  const validateChatInput = (input: string): boolean => {
    if (input.length > 500) {
      setChatInputError(lang === "fil" ? "Masyadong mahaba ang mensahe. Maximum 500 characters lang." : "Message is too long. Maximum 500 characters.");
      return false;
    }
    setChatInputError(null);
    return true;
  };

  // Career goal validation
  const validateCareerGoal = (input: string): boolean => {
    if (input.length > 200) {
      setCareerGoalError(lang === "fil" ? "Masyadong mahaba. Maximum 200 characters lang." : "Too long. Maximum 200 characters.");
      return false;
    }
    setCareerGoalError(null);
    return true;
  };

  // Chat message submission
  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;
    if (!validateChatInput(textToSend)) return;
    if (isSendingMessage) return; // Prevent double submission

    if (!presetText) {
      setChatInput("");
    }

    const newUserMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setIsSendingMessage(true);

    // Context user profile
    const userProfile = {
      age,
      education,
      region: selectedRegion,
      province: selectedProvince,
      interests: customInterests.join(", "),
      practicalSkills: customSkills.join(", "),
      careerGoal
    };

    try {
      // Map history to fit server structure (limit to 20 messages)
      const apiHistory = chatMessages.slice(-20).map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        text: msg.text
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: apiHistory,
          userProfile
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      // Update rate limit tracking from headers
      const remainingHeader = response.headers.get('X-RateLimit-Remaining');
      const resetHeader = response.headers.get('X-RateLimit-Reset');
      if (remainingHeader) {
        setRateLimits(prev => ({
          ...prev,
          chat: { remaining: parseInt(remainingHeader), resetDate: resetHeader || '' }
        }));
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error(`Daily limit reached: ${errorData.message || 'You have used all 5 chat requests for today. Try again tomorrow.'}`);
        } else if (response.status === 403) {
          throw new Error(`Access blocked: ${errorData.message || 'Your IP has been blocked due to abuse.'}`);
        } else if (response.status === 504) {
          // Auto-retry after timeout
          setChatMessages(prev => [
            ...prev,
            {
              id: `ai-retry-${Date.now()}`,
              role: "model",
              text: lang === "fil" ? "Nag-time out ang connection. Susubukan ulit..." : "Connection timed out. Retrying...",
              timestamp: new Date()
            }
          ]);
          
          // Wait 3 seconds and retry
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(() => retryController.abort(), 30000);
          const retryResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: textToSend,
              history: apiHistory,
              userProfile
            }),
            signal: retryController.signal
          });
          clearTimeout(retryTimeoutId);
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            setChatMessages(prev => [
              ...prev.filter(m => !m.id.startsWith('ai-retry-')),
              {
                id: `ai-${Date.now()}`,
                role: "model",
                text: retryData.text || (lang === "fil" ? "Humihingi ako ng pasensya, parang may problema sa pag-proseso ng aking sagot. Pakisubukang muli." : "I apologize, there seems to be an issue processing my response. Please try again."),
                timestamp: new Date()
              }
            ]);
            setIsSendingMessage(false);
            return;
          }
          throw new Error("Retry failed after timeout");
        }
        throw new Error("Chat connection breakdown");
      }

      const responseData = await response.json();
      
      setChatMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "model",
          text: responseData.text || (lang === "fil" ? "Humihingi ako ng pasensya, parang may problema sa pag-proseso ng aking sagot. Pakisubukang muli." : "I apologize, there seems to be an issue processing my response. Please try again."),
          timestamp: new Date()
        }
      ]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "model",
          text: message || (lang === "fil" ? "Pasensya na po, parang naputol ang aking koneksyon. Pakiunawa na palagi kang pwedeng pumunta sa pinakamalapit na sangay ng TESDA sa inyong komunidad para sa agarang suporta!" : "I apologize, it seems my connection was interrupted. Please note you can always visit the nearest TESDA branch in your community for immediate support!"),
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Helper trigger to ask chatbot directly about any course code
  const askChatAboutCourse = (courseCode: string, courseName: string) => {
    navigate("/chat");
    const promptText = lang === "fil"
      ? `Interesado po ako mag-enroll sa ${courseName} (Code: ${courseCode}). Ano po ba ang eksaktong Requirements at paano mag-apply ng scholarship?`
      : `I'm interested in enrolling in ${courseName} (Code: ${courseCode}). What are the exact requirements and how do I apply for a scholarship?`;
    handleSendChatMessage(promptText);
  };

  const askChatAboutJob = (jobTitle: string, requiredCourses: JobMatchCourse[]) => {
    navigate("/chat");
    const courseNames = requiredCourses.map((c) => c.name).join(", ");
    const promptText = lang === "fil"
      ? `Interesado po ako sa trabahong ${jobTitle}. Ano po ba ang mga kailangang TESDA courses para makapag-apply? Naririnig ko na kailangan ng ${courseNames}. Pwede po bang magbigay ng detalye?`
      : `I'm interested in the ${jobTitle} job. What TESDA courses do I need to apply? I've heard that ${courseNames} are required. Can you provide details?`;
    handleSendChatMessage(promptText);
  };

  // Search filter for exploring sectors/jobs/courses
  const getFilteredSectors = () => {
    if (!explorerQuery.trim()) return SECTORS_DATA;
    const query = explorerQuery.toLowerCase();
    return SECTORS_DATA.filter(sector => {
      const matchSector = sector.name.toLowerCase().includes(query) || sector.description.toLowerCase().includes(query);
      const matchJobs = sector.jobs.some(j => j.title.toLowerCase().includes(query) || j.description.toLowerCase().includes(query));
      const matchCourses = sector.courses.some(c => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query));
      return matchSector || matchJobs || matchCourses;
    });
  };

  const filteredSectors = getFilteredSectors();
  const isJobProfileReady = customInterests.length > 0 || careerGoal.trim().length >= 5;

  const renderPageHeader = (tab: keyof typeof PAGE_HEADER_CONTENT) => {
    const config = PAGE_HEADER_CONTENT[tab];
    return (
      <PageHeader
        title={config.title[lang]}
        subtitle={config.subtitle[lang]}
        icon={config.icon}
        accent={config.accent}
        action={
          tab === "match"
            ? {
                label: lang === "fil" ? "Magsimula" : "Start",
                onClick: startAiMatching,
                icon: Sparkles,
              }
            : undefined
        }
      />
    );
  };

  return (
    <div className="min-h-screen bg-kt-bg font-sans text-kt-near-black overflow-x-hidden" id="main-root-container">
      <a href="#app-main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-kt-blue focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none">
        {lang === "fil" ? "Laktawan patungo sa nilalaman" : "Skip to content"}
      </a>
      {showPrivacyNotice && (
        <div className="bg-kt-blue text-white px-4 py-3 text-center text-sm relative z-50" role="status">
          <p className="max-w-3xl mx-auto">
            {lang === "fil"
              ? <>Ang iyong data ay naka-save sa device na ito para maibalik sa susunod na bisita. <strong>Hindi ito nai-upload sa server.</strong> Kung nakikibahagi ka ng device, pindutin ang menu (⋮) at "Burahin ang Data Ko" pagkatapos gamit.</>
              : <>Your data is saved on this device so it returns on your next visit. <strong>Nothing is uploaded to any server.</strong> If you share this device, tap the menu (⋮) and "Clear My Data" after each session.</>
            }
          </p>
          <button
            type="button"
            onClick={acceptPrivacy}
            className="mt-2 bg-kt-gold text-kt-near-black font-bold text-xs px-4 py-1.5 rounded-lg hover:bg-kt-gold-dark transition-all"
          >
            {lang === "fil" ? "Naiintindihan" : "Got it"}
          </button>
        </div>
      )}
      {/* Navbar section */}
      <Navbar 
        lang={lang} 
        setLang={setLang}
        onClearData={handleClearAllData}
        confirmClearData={confirmClearData}
        onConfirmClearData={setConfirmClearData}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 overflow-x-hidden pb-24 md:pb-0" id="app-main">
        {currentTab === "landing" ? (
          <LandingPage lang={lang} />
        ) : (
          <>
        

        {/* ======================================= */}
        {/* TAB 1: AI JOB & COURSE MATCHER */}
        {/* ======================================= */}
        {currentTab === "match" && (
          <div id="tab-matching-content" className="space-y-8 animate-fade-in">
            {renderPageHeader("match")}
            <AssessmentWizard
              age={age}
              setAge={setAge}
              education={education}
              setEducation={setEducation}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
              selectedProvincesList={selectedProvincesList}
              customInterests={customInterests}
              setCustomInterests={setCustomInterests}
              customSkills={customSkills}
              setCustomSkills={setCustomSkills}
              careerGoal={careerGoal}
              setCareerGoal={setCareerGoal}
              careerGoalError={careerGoalError}
              interestInput={interestInput}
              setInterestInput={setInterestInput}
              skillInput={skillInput}
              setSkillInput={setSkillInput}
              handleAddCustomInterest={handleAddCustomInterest}
              handleAddCustomSkill={handleAddCustomSkill}
              toggleInterestTag={toggleInterestTag}
              toggleSkillTag={toggleSkillTag}
              handleRegionChange={handleRegionChange}
              handleSubmitProfile={handleSubmitProfile}
              isMatching={isMatching}
              matchResult={matchResult}
              matchError={matchError}
              lang={lang}
              QUICK_INTERESTS={QUICK_INTERESTS}
              QUICK_SKILLS={QUICK_SKILLS}
              PHILIPPINES_REGIONS={PHILIPPINES_REGIONS}
              onChatAboutCourse={askChatAboutCourse}
              onExploreCourse={(courseCode, targetSectors) => {
                const sector = SECTORS_DATA.find(sec => 
                  sec.courses.some(c => c.code === courseCode) || 
                  targetSectors?.includes(sec.id)
                );
                if (sector) {
                  setSelectedSector(sector);
                }
                navigate("/explorer");
              }}
              onGoToChat={() => navigate("/chat")}
              onGoToFaq={() => navigate("/faq")}
              onResetProfile={() => {
                setMatchResult(null);
                setJobMatchResult(null);
                setMatchError(null);
                setJobMatchError(null);
              }}
            />
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 2: SECTOR & COURSE DATABASE EXPLORER */}
        {/* ======================================= */}
        {currentTab === "explorer" && (
          <div id="tab-explorer-content" className="space-y-8 animate-fade-in">
            {renderPageHeader("explorer")}
            {/* Search Input Filter */}
            <div className="bg-white rounded-2xl border border-kt-border p-5 max-w-xl">
              <label className="block text-xs font-bold text-kt-slate mb-2" htmlFor="input-explorer-search">
                {lang === "fil" ? "Mabilisang Paghahanap sa Sektor o Kurso" : "Search Vocational Database"}
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-kt-slate" />
                <input
                  id="input-explorer-search"
                  type="text"
                  placeholder={lang === "fil" ? "I-type e.g., computer, barista, welding, NC II..." : "Type keywords like welding, cookery..."}
                  value={explorerQuery}
                  onChange={(e) => setExplorerQuery(e.target.value)}
                  className="w-full rounded-xl border border-kt-border bg-white pl-10 pr-4 py-3 text-sm focus:bg-white focus:border-kt-blue focus:ring-3 focus:ring-kt-blue-light font-medium transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sector Selection Panel */}
              <div id="explorer-left-sectors" className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-semibold text-kt-slate pl-1 mb-2">
                  {lang === "fil" ? "Pumili ng Sektor na Gusto:" : "Choose a Vocational Sector:"}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:block lg:space-y-2">
                  {filteredSectors.map((sector) => (
                    <button
                      key={sector.id}
                      type="button"
                      id={`btn-explorer-sector-${sector.id}`}
                      onClick={() => setSelectedSector(sector)}
                      className={`w-full text-left rounded-xl p-4 border transition-all flex items-start gap-3.5 min-h-[64px] touch-manipulation ${
                        selectedSector.id === sector.id
                          ? "bg-kt-blue text-white border-kt-blue"
                          : "bg-white text-kt-near-black border-kt-border hover:bg-kt-blue-light"
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg shrink-0 ${
                        selectedSector.id === sector.id ? "bg-white/10 text-white" : "bg-kt-blue-light text-kt-blue"
                      }`}>
                        {getSectorIcon(sector.iconName)}
                      </div>
                      <div className="min-w-0">
                        <span className="block font-display font-bold text-sm tracking-tight leading-none">
                          {sector.name}
                        </span>
                        <span className={`block text-xs mt-1.5 leading-normal ${
                          selectedSector.id === sector.id ? "text-white/80" : "text-kt-slate"
                        }`}>
                          {sector.courses.length} {lang === "fil" ? "na accredited na kurso" : "accredited courses"}
                        </span>
                      </div>
                    </button>
                  ))}

                  {filteredSectors.length === 0 && (
                    <div className="text-center p-8 bg-kt-bg rounded-xl border border-dashed border-kt-border col-span-full">
                      <BadgeHelp className="h-8 w-8 text-kt-slate mx-auto mb-2" />
                      <p className="text-xs text-kt-slate font-bold">{lang === "fil" ? "Walang tumugmang sektor" : "No matching sectors"}</p>
                      <button 
                        id="btn-clear-search"
                        onClick={() => setExplorerQuery("")}
                        className="mt-2 text-xs font-bold text-kt-blue decoration-dotted underline"
                      >
                        {lang === "fil" ? "I-clear ang filter" : "Clear filter"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Main sector representation Right */}
              <div id="explorer-right-details" className="lg:col-span-8 space-y-6">
                
                {/* Sector Description Box */}
                <div className="bg-white rounded-2xl border border-kt-border p-6">
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="p-3 bg-kt-blue-light text-kt-blue rounded-xl">
                      {getSectorIcon(selectedSector.iconName)}
                    </div>
                    <div>
                      <h2 className="font-display font-black text-xl text-kt-near-black">
                        {selectedSector.name}
                      </h2>
                      <span className="inline-block bg-kt-blue-light text-kt-blue font-bold text-xs px-2.5 py-0.5 rounded-full mt-1 border border-kt-blue-soft">
                        Accredited Sector Program
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-kt-slate leading-relaxed">
                    {selectedSector.description}
                  </p>
                </div>

                {/* Section Jobs mapped — progressive disclosure */}
                <div className="bg-white rounded-2xl border border-kt-border">
                  <button
                    type="button"
                    onClick={() => setExplorerShowJobs(!explorerShowJobs)}
                    className="w-full flex items-center justify-between p-5 text-left touch-manipulation"
                    aria-expanded={explorerShowJobs}
                    aria-controls="explorer-jobs-list"
                  >
                    <span className="flex items-center gap-2 font-display font-bold text-sm text-kt-near-black">
                      <Briefcase className="h-4 w-4 text-kt-blue" />
                      {lang === "fil" ? "Trabaho at Sahod" : "Jobs & Salary"}
                      <span className="text-xs font-semibold text-kt-slate ml-1">({selectedSector.jobs.length})</span>
                    </span>
                    <ChevronDown className={`h-4 w-4 text-kt-slate transition-transform duration-200 ${explorerShowJobs ? "rotate-180" : ""}`} />
                  </button>
                  {explorerShowJobs && (
                    <div className="px-5 pb-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="explorer-jobs-list">
                        {selectedSector.jobs.map((job, idx) => (
                          <div key={idx} className="bg-kt-bg border border-kt-border rounded-xl p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-display font-bold text-xs text-kt-near-black leading-tight">
                                  {job.title}
                                </h4>
                                <span className={`flex-shrink-0 text-xs font-extrabold px-2 py-0.5 rounded border ${
                                  job.demandLevel === "Very High" 
                                    ? "bg-kt-danger-light text-kt-danger border-kt-danger-border" 
                                    : job.demandLevel === "High"
                                    ? "bg-kt-warn-light text-kt-warn border-kt-warn-border"
                                    : "bg-kt-blue-light text-kt-blue border-kt-blue-soft"
                                }`}>
                                  {job.demandLevel}
                                </span>
                              </div>
                              <p className="text-xs text-kt-slate mt-2 leading-relaxed">
                                {job.description}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-kt-border flex justify-between items-center bg-white p-2.5 rounded-lg">
                               <span className="text-xs text-kt-slate block font-semibold">{lang === "fil" ? "Tantiya sa Sahod" : "Salary Estimate"}</span>
                              <span className="font-mono text-xs font-bold text-kt-near-black">{job.averageSalary}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Courses detail — progressive disclosure */}
                <div className="bg-white rounded-2xl border border-kt-border">
                  <button
                    type="button"
                    onClick={() => setExplorerShowCourses(!explorerShowCourses)}
                    className="w-full flex items-center justify-between p-5 text-left touch-manipulation"
                    aria-expanded={explorerShowCourses}
                    aria-controls="explorer-courses-list"
                  >
                    <span className="flex items-center gap-2 font-display font-bold text-sm text-kt-near-black">
                      <GraduationCap className="h-4 w-4 text-kt-blue" />
                      {lang === "fil" ? "Mga TESDA Program" : "TESDA Programs"}
                      <span className="text-xs font-semibold text-kt-slate ml-1">({selectedSector.courses.length})</span>
                    </span>
                    <ChevronDown className={`h-4 w-4 text-kt-slate transition-transform duration-200 ${explorerShowCourses ? "rotate-180" : ""}`} />
                  </button>
                  {explorerShowCourses && (
                    <div id="explorer-courses-list" className="px-5 pb-5 space-y-4">
                      {selectedSector.courses.map((course) => (
                        <div 
                          key={course.code} 
                          id={`course-card-${course.code}`}
                          className="bg-kt-bg rounded-xl border border-kt-border p-5 hover:border-kt-blue-soft transition-all space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-mono text-xs font-bold px-2 rounded-md bg-kt-blue-light text-kt-blue border border-kt-blue-soft shrink-0">
                                {course.code}
                              </span>
                              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                                course.level === "Micro-credential" 
                                  ? "bg-kt-chat-purple-light text-kt-chat-purple border border-kt-chat-purple-border"
                                  : "bg-kt-blue-light text-kt-blue border border-kt-blue-soft"
                              }`}>
                                {course.level}
                              </span>
                              <span className="text-kt-border">|</span>
                              <span className="flex items-center gap-1.5 text-xs text-kt-slate font-medium">
                                <Clock className="h-3.5 w-3.5 text-kt-slate" />
                                {course.duration}
                              </span>
                            </div>

                            <button
                              id={`btn-explorer-engage-chat-${course.code}`}
                              onClick={() => askChatAboutCourse(course.code, course.name)}
                              className="text-xs font-bold text-kt-blue hover:text-kt-blue hover:bg-kt-blue-light rounded-lg px-3 py-1.5 border border-kt-blue-soft flex items-center gap-1.5 self-start sm:self-auto touch-manipulation"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>{lang === "fil" ? "Itanong kung paano sumali" : "Ask how to join"}</span>
                            </button>
                          </div>

                          <div>
                            <h4 className="font-display font-bold text-sm sm:text-base text-kt-near-black">
                              {course.name}
                            </h4>
                            <p className="text-xs text-kt-slate mt-2 leading-relaxed">
                              {course.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-kt-border">
                            <div>
                               <span className="block text-xs font-semibold text-kt-slate mb-1">{lang === "fil" ? "Prerequisite (Sino ang pwede?)" : "Prerequisite (Who can enroll?)"}</span>
                              <span className="block text-xs font-bold text-kt-near-black">{course.entryReq[lang]}</span>
                            </div>
                            <div>
                               <span className="block text-xs font-semibold text-kt-slate mb-1">{lang === "fil" ? "Matututunang Kakayahan (Skills)" : "Skills You'll Learn"}</span>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {course.skillsAcquired.map((skill, idx) => (
                                  <span key={idx} className="bg-white text-kt-slate text-xs font-medium px-2 py-0.5 rounded border border-kt-border">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB 3: KA-TRABAHO AI CHAT COUNSELOR */}
        {/* ======================================= */}
        {currentTab === "chat" && (
          <div id="tab-chat-content" className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            {renderPageHeader("chat")}
            {/* Quick pre-seeded questions */}
            <div className="flex flex-wrap gap-3 justify-center" id="frequent-questions-row">
              <button
                id="preset-q-allowance"
                onClick={() => handleSendChatMessage("May allowance po ba habang nag-aaral sa TESDA?")}
                className="rounded-full bg-kt-blue-light hover:bg-kt-blue-soft text-kt-blue text-sm px-4 py-2 sm:px-5 sm:py-2.5 border border-kt-blue-soft font-bold transition-all hover:shadow-md hover:-translate-y-0.5 touch-manipulation"
              >
                <DollarSign className="h-4 w-4 inline" /> {lang === "fil" ? "May daily allowance po ba?" : "Is there a daily allowance?"}
              </button>
              <button
                id="preset-q-als"
                onClick={() => handleSendChatMessage("Pwede po ba akong mag-TESDA kahit ALS Graduate lang ako?")}
                className="rounded-full bg-kt-blue-light hover:bg-kt-blue-soft text-kt-blue text-sm px-4 py-2 sm:px-5 sm:py-2.5 border border-kt-blue-soft font-bold transition-all hover:shadow-md hover:-translate-y-0.5 touch-manipulation"
              >
                <GraduationCap className="h-4 w-4 inline" /> {lang === "fil" ? "Pwede ba ang ALS graduate?" : "Is ALS graduate accepted?"}
              </button>
              <button
                id="preset-q-docs"
                onClick={() => handleSendChatMessage("Ano-ano po bang dokumento ang kailangan ko ihanda kapag mag-e-enroll?")}
                className="rounded-full bg-kt-blue-light hover:bg-kt-blue-soft text-kt-blue text-sm px-4 py-2 sm:px-5 sm:py-2.5 border border-kt-blue-soft font-bold transition-all hover:shadow-md hover:-translate-y-0.5 touch-manipulation"
              >
                <FileText className="h-4 w-4 inline" /> {lang === "fil" ? "Dokumentong kailangan?" : "Required documents?"}
              </button>
              <button
                id="preset-q-nc"
                onClick={() => handleSendChatMessage("Ano po ba ang makukuha kong certificate pagkatapos ng training?")}
                className="rounded-full bg-kt-blue-light hover:bg-kt-blue-soft text-kt-blue text-sm px-4 py-2 sm:px-5 sm:py-2.5 border border-kt-blue-soft font-bold transition-all hover:shadow-md hover:-translate-y-0.5 touch-manipulation"
              >
                <Award className="h-4 w-4 inline" /> {lang === "fil" ? "Ano ang National Certificate (NC)?" : "What is a National Certificate (NC)?"}
              </button>
            </div>

            {/* Chat Messages Log Frame */}
            <div className="bg-white rounded-3xl border border-kt-border overflow-hidden flex flex-col h-[60vh] min-h-[300px] sm:h-[600px]">
              
              {/* Profile Bar indicator */}
              <div className="bg-kt-blue text-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-kt-blue/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-kt-gold font-black text-sm text-kt-near-black">
                    KT
                  </div>
                  <div>
                    <span className="block text-sm font-bold leading-tight">Ka-TrabaHO AI Companion</span>
                    <span className="block text-xs text-white/80 flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-kt-online" /> {lang === "fil" ? "Handang tumulong ngayon" : "Ready to help now"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="text-xs text-white/60 hover:text-white font-semibold flex items-center gap-1 transition-colors touch-manipulation"
                    aria-label={lang === "fil" ? "Burahin ang usapan" : "Clear conversation"}
                    title={lang === "fil" ? "Burahin ang usapan" : "Clear conversation"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{lang === "fil" ? "Burahin" : "Clear"}</span>
                  </button>
                  {/* Rate Limit Badge */}
                  {rateLimits.chat.remaining < 5 && (
                    <div className={`flex sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      rateLimits.chat.remaining > 2 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : rateLimits.chat.remaining > 0 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      <span>{rateLimits.chat.remaining}/5 left</span>
                    </div>
                  )}
                  <div className="text-xs text-white/60 text-right">
                    <span className="sm:hidden">{PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.name?.split(' - ')[0] || selectedRegion}</span>
                    <span className="hidden sm:inline">{lang === "fil" ? "Rehiyon:" : "Region:"} {PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.name || selectedRegion}</span>
                  </div>
                </div>
              </div>

              {/* Message log */}
              <div id="chat-messages-scrollarea" className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 bg-kt-bg" aria-live="polite" aria-relevant="additions">
                {chatMessages.map((msg) => (
                  <ChatBubble key={msg.id} msg={msg} />
                ))}
                {isSendingMessage && (
                  <div className="flex justify-start" aria-hidden="true">
                    <div className="bg-white border border-kt-border rounded-2xl rounded-tl-none px-4 sm:px-5 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-kt-blue animate-typing-dot" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-kt-blue animate-typing-dot" style={{ animationDelay: '200ms' }} />
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-kt-blue animate-typing-dot" style={{ animationDelay: '400ms' }} />
                        </div>
                        <span className="text-sm text-kt-slate">{lang === "fil" ? "Nagsusulat si Ka-TrabaHO..." : "Ka-TrabaHO is typing..."}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Area */}
              <div className="border-t border-kt-border bg-white p-3 sm:p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage();
                  }}
                  className="flex gap-2 sm:gap-3"
                >
                  <div className="flex-1 relative">
                    <input
                      id="chat-input"
                      type="text"
                      aria-label={lang === "fil" ? "Magtanong tungkol sa TESDA" : "Ask about TESDA"}
                      value={chatInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 500) {
                          setChatInput(value);
                          setChatInputError(null);
                        }
                      }}
                      placeholder={lang === "fil" ? "Magtanong tungkol sa TESDA..." : "Ask about TESDA..."}
                       className={`w-full rounded-xl border px-3 sm:px-4 pr-16 py-2.5 sm:py-3 text-sm focus:bg-white focus:ring-3 transition-all ${
                        chatInputError 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                          : 'border-kt-border bg-white focus:border-kt-blue focus:ring-kt-blue-light'
                      }`}
                      maxLength={500}
                    />
                    {/* Character Counter */}
                    <div className="absolute right-2 bottom-1 text-xs text-kt-slate">
                      {chatInput.length}/500
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSendingMessage || !chatInput.trim() || chatInput.length > 500}
                    aria-disabled={isSendingMessage || !chatInput.trim() || chatInput.length > 500}
                    className="rounded-xl bg-kt-blue hover:bg-kt-blue-mid text-white px-4 sm:px-5 py-2.5 sm:py-3 font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg flex items-center gap-2 touch-manipulation"
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
                {/* Input Error Message */}
                {chatInputError && (
                  <div role="alert" className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {chatInputError}
                  </div>
                )}
                {/* Rate Limit Warning */}
                {rateLimits.chat.remaining <= 2 && rateLimits.chat.remaining > 0 && (
                  <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {rateLimits.chat.remaining} {lang === "fil" ? `nawawalang kahilingan` : `request${rateLimits.chat.remaining !== 1 ? 's' : ''} remaining today`}
                    {rateLimits.chat.resetDate && <span className="ml-1">({lang === "fil" ? "reset" : "resets"} {new Date(rateLimits.chat.resetDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>}
                  </div>
                )}
                {rateLimits.chat.remaining === 0 && (
                  <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {lang === "fil" ? "Naabot na ang arawang limit." : "Daily limit reached."}
                    {rateLimits.chat.resetDate && <span className="ml-1">{lang === "fil" ? "Magagamit ulit" : "Resets"} {new Date(rateLimits.chat.resetDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 4: FREQUENTLY ASKED QUESTIONS */}
        {/* ======================================= */}
        {currentTab === "faq" && (
          <div id="tab-faq-content" className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            {renderPageHeader("faq")}
            <div className="space-y-3" id="faq-accordions-container">
              {(lang === "fil" ? TESDA_FAQ : TESDA_FAQ_EN).map((faq, idx) => {
                const isOpen = faqOpenIndex === idx;
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-kt-border overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-start justify-between gap-3 p-5 text-left touch-manipulation"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${idx}`}
                    >
                      <span className="flex items-start gap-2.5 leading-snug">
                        <span className="bg-kt-blue-light shrink-0 text-xs px-2 py-0.5 rounded-md text-kt-blue border border-kt-blue-soft" aria-hidden="true">{lang === "fil" ? `T${idx + 1}` : `Q${idx + 1}`}</span>
                        <span className="font-display font-bold text-sm text-kt-near-black">{faq.question}</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 text-kt-slate shrink-0 mt-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div id={`faq-answer-${idx}`} className="px-5 pb-5 pl-10 sm:pl-12 text-sm text-kt-slate leading-relaxed font-medium border-t border-kt-border pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Offline-apply reference block */}
            <div className="bg-white rounded-2xl border border-kt-border p-6 mt-8 space-y-4">
              <h3 className="font-display font-bold text-sm text-kt-near-black flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-kt-blue" />
                {lang === "fil" ? "Handa ka na bang bumisita?" : "Ready to visit?"}
              </h3>
              <p className="text-xs text-kt-slate leading-normal">
                {lang === "fil"
                  ? <>Maaari mong hanapin ang pinakamalapit na TESDA Regional o Provincial Office sa inyong komunidad. Magdala lamang ng panulat, iyong PSA birth certificate, at school credentials or ALS completer duplicate certificate. Sila ay bukas mula <strong>Lunes hanggang Biyernes (8:00 AM - 5:00 PM)</strong>.</>
                  : <>You can find the nearest TESDA Regional or Provincial Office in your community. Just bring a pen, your PSA birth certificate, and school credentials or ALS completer duplicate certificate. They are open <strong>Monday through Friday (8:00 AM - 5:00 PM)</strong>.</>
                }
              </p>
              
              <div className="rounded-xl bg-kt-blue-light p-4 border border-kt-blue-soft flex items-start gap-3">
                <Info className="h-5 w-5 text-kt-blue shrink-0 mt-0.5" />
                <p className="text-xs text-kt-blue leading-relaxed">
                  {lang === "fil"
                    ? <><strong>Iskolarship Alert:</strong> Palaging itanong ang programang <strong>UAQTE</strong> o <strong>STPES (Special Training for Employment Program)</strong> dahil ang mga ito ay may kaakibat na kumpletong libreng gamit at daily allowances!</>
                    : <><strong>Scholarship Alert:</strong> Always ask about the <strong>UAQTE</strong> or <strong>STPES (Special Training for Employment Program)</strong> as these come with completely free supplies and daily allowances!</>
                  }
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB 5: JOB MARKET */}
        {/* ======================================= */}
        {currentTab === "jobs" && (
          <div id="tab-jobs-content" className="space-y-8 animate-fade-in">
            {renderPageHeader("jobs")}
            {/* Job Matching Form — collapsible when results exist */}
            {!jobFormCollapsed ? (
              <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-kt-border p-6 md:p-8">
                {jobMatchResult && (
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-kt-border">
                    <span className="text-xs font-bold text-kt-slate">
                      {lang === "fil" ? "I-edit ang profile" : "Edit your profile"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setJobFormCollapsed(true)}
                      className="text-xs font-bold text-kt-blue hover:text-kt-blue-mid flex items-center gap-1 touch-manipulation"
                      aria-label={lang === "fil" ? "Itago ang form" : "Hide form"}
                    >
                      <ChevronUp className="h-4 w-4" />
                      {lang === "fil" ? "Itago" : "Hide"}
                    </button>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="bg-kt-bg rounded-xl p-4 border border-kt-border">
                    <p className="text-sm text-kt-near-black">
                      <strong>{lang === "fil" ? "Kasalukuyang Profile:" : "Current Profile:"}</strong> {age} {lang === "fil" ? "taong gulang" : "years old"}, {education}, {PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.name || selectedRegion}
                    </p>
                  </div>

                  <ProfileMiniForm
                    lang={lang}
                    customInterests={customInterests}
                    customSkills={customSkills}
                    careerGoal={careerGoal}
                    setCareerGoal={setCareerGoal}
                    interestInput={interestInput}
                    setInterestInput={setInterestInput}
                    skillInput={skillInput}
                    setSkillInput={setSkillInput}
                    handleAddCustomInterest={handleAddCustomInterest}
                    handleAddCustomSkill={handleAddCustomSkill}
                    toggleInterestTag={toggleInterestTag}
                    toggleSkillTag={toggleSkillTag}
                    QUICK_INTERESTS={QUICK_INTERESTS}
                    QUICK_SKILLS={QUICK_SKILLS}
                    onGoToFullAssessment={() => navigate("/match")}
                  />

                  <button
                    id="btn-submit-job-matching"
                    type="button"
                    onClick={handleSubmitJobMatching}
                    disabled={isJobMatching || !isJobProfileReady}
                    className={`w-full rounded-xl py-4 text-sm font-bold transition-all flex items-center justify-center gap-2 touch-manipulation ${
                      isJobMatching
                        ? "bg-kt-gold-light text-kt-gold-ink cursor-wait border-2 border-kt-gold"
                        : !isJobProfileReady
                        ? "bg-kt-bg text-kt-slate cursor-not-allowed border-2 border-dashed border-kt-border"
                        : "bg-kt-blue hover:bg-kt-blue-mid text-white hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                    }`}
                  >
                    {isJobMatching ? (
                      <>
                        <span className="animate-spin inline-block h-5 w-5 border-2 border-kt-gold border-t-transparent rounded-full" />
                        <span className="font-extrabold">{lang === "fil" ? "Sinusuri ng AI ang mga trabaho..." : "AI is analyzing jobs..."}</span>
                      </>
                    ) : (
                      <>
                        <Briefcase className="h-4 w-4" />
                        <span>
                          {lang === "fil" 
                            ? "Hanapin ang Trabaho para sa Akin!" 
                            : "Find Jobs for Me!"
                          }
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <button
                  type="button"
                  onClick={() => setJobFormCollapsed(false)}
                  className="w-full flex items-center justify-between bg-white rounded-2xl border border-kt-border p-5 text-left touch-manipulation hover:border-kt-blue-soft transition-all"
                  aria-expanded="false"
                >
                  <span className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-kt-blue-light text-kt-blue">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-kt-near-black">
                      {lang === "fil" ? "I-edit ang Profile" : "Edit Profile"}
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 text-kt-slate" />
                </button>
              </div>
            )}

            {/* Job Match Error */}
            {jobMatchError && (
              <div id="job-matching-error" role="alert" className="p-6 rounded-2xl border border-red-200 flex items-start gap-4 bg-red-50 text-red-700 max-w-2xl mx-auto shadow-lg">
                <div className="p-2 rounded-xl bg-red-100">
                  <AlertCircle className="h-6 w-6 shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-base">{lang === "fil" ? "May kaunting aberya" : "A slight issue occurred"}</h4>
                  <p className="text-sm text-red-600 mt-2 leading-relaxed">{jobMatchError}</p>
                </div>
              </div>
            )}

            {/* Job Results */}
            {jobMatchResult && Array.isArray(jobMatchResult.recommendedJobs) && (
              <div id="job-results-section" className="space-y-8 max-w-5xl mx-auto" aria-live="polite">
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 bg-kt-success-light text-kt-success-ink font-extrabold text-xs px-4 py-2 rounded-full border border-kt-success-border uppercase tracking-wider mb-4">
                    <CheckCircle2 className="h-4 w-4" /> {lang === "fil" ? "Nakakita ng Tugma!" : "Found a Match!"}
                  </span>
                <h2 className="font-display font-extrabold text-2xl text-kt-near-black sm:text-3xl">
                  {lang === "fil"
                    ? "Ang Iyong AI Report sa Pagtutugma ng Trabaho"
                    : "Your AI Job Match Report"
                  }
                </h2>
                  <p className="text-sm text-kt-slate mt-3 max-w-2xl mx-auto leading-relaxed prose-pretty">
                    {jobMatchResult.matchedSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobMatchResult.recommendedJobs.map((job, idx: number) => {
                    const isExpanded = expandedJobCards.has(idx);
                    return (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl border border-kt-border overflow-hidden hover:shadow-[0_4px_32px_rgba(15,61,145,0.07)] transition-all flex flex-col card-hover group"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedJobCards(prev => {
                          const next = new Set(prev);
                          if (next.has(idx)) next.delete(idx); else next.add(idx);
                          return next;
                        })}
                        className="w-full text-left bg-kt-bg px-5 py-4 border-b border-kt-border flex items-center justify-between gap-3 touch-manipulation"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded
                          ? (lang === "fil" ? "Itago ang detalye" : "Hide details")
                          : (lang === "fil" ? "Ipakita ang detalye" : "Show details")
                        }
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <h3 className="font-display font-bold text-base text-kt-near-black leading-tight break-words truncate">
                            {job.jobTitle}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-kt-blue text-white">
                            {job.matchScore}%
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                            job.demandLevel === "Very High" 
                              ? "bg-kt-danger-light text-kt-danger border border-kt-danger-border" 
                              : job.demandLevel === "High"
                              ? "bg-kt-warn-light text-kt-warn border border-kt-warn-border"
                              : "bg-kt-blue-light text-kt-blue border border-kt-blue-soft"
                          }`}>
                            {job.demandLevel}
                          </span>
                          <ChevronDown className={`h-4 w-4 text-kt-slate transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </button>

                      <div className="px-5 py-3 border-b border-kt-border flex items-center gap-3">
                        <span className="text-xs text-kt-slate font-mono font-semibold">
                          {job.averageSalary}
                        </span>
                        <button
                          onClick={() => askChatAboutJob(job.jobTitle, job.requiredCourses)}
                          className="ml-auto text-xs text-kt-blue font-bold hover:text-kt-blue-mid flex items-center gap-1 touch-manipulation"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          {lang === "fil" ? "Kausapin" : "Chat"}
                        </button>
                      </div>

                      {isExpanded && (
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-kt-slate leading-relaxed bg-kt-bg p-4 rounded-xl border border-kt-border prose-pretty">
                            <strong className="text-kt-near-black">{lang === "fil" ? "Bakit para sa iyo:" : "Why it's for you:"}</strong> &ldquo;{job.reasonForYouth}&rdquo;
                          </p>

                          {job.description && (
                            <p className="text-sm text-kt-slate mt-3 leading-relaxed prose-pretty">
                              {job.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-kt-border space-y-3">
                          {job.requiredCourses && job.requiredCourses.length > 0 && (
                            <div>
                              <span className="text-xs font-semibold text-kt-slate">
                                {lang === "fil" ? "Kailangang TESDA Courses:" : "Required TESDA Courses:"}
                              </span>
                              <div className="mt-2 space-y-2">
                                {job.requiredCourses.map((course, cidx: number) => (
                                  <div key={cidx} className="flex flex-wrap items-center justify-between gap-2 bg-kt-bg rounded-xl p-3 border border-kt-border group-hover:border-kt-blue-soft transition-all">
                                     <div className="flex items-center gap-3 min-w-0">
                                       <div className="p-2 rounded-lg bg-kt-blue-light text-kt-blue">
                                         <GraduationCap className="h-4 w-4" />
                                       </div>
                                       <div>
                                         <span className="text-sm font-bold text-kt-near-black">{course.name}</span>
                                         <span className="text-xs text-kt-slate block">{course.code} | {course.duration}</span>
                                       </div>
                                     </div>
                                     <button
                                       onClick={() => {
                                         const sector = SECTORS_DATA.find((s) => s.id === course.sectorId);
                                         if (sector) setSelectedSector(sector);
                                         navigate("/explorer");
                                       }}
                                       className="text-xs text-kt-blue font-bold hover:text-kt-blue px-2 py-1.5 rounded-lg hover:bg-kt-blue-light transition-all border border-kt-blue-soft touch-manipulation"
                                     >
                                       {lang === "fil" ? "Detalye" : "Details"}
                                     </button>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                        </div>
                      </div>
                      )}
                    </div>
                    );
                  })}
                </div>

                {/* FAQ Tip */}
                {jobMatchResult.faqTip && (
                  <div className="bg-kt-blue rounded-3xl p-5 md:p-8 text-white border border-kt-blue/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-kt-gold/10 rounded-full blur-3xl" />
                    <div className="relative flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-white/10">
                        <Info className="h-6 w-6 text-kt-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-kt-gold mb-2">{lang === "fil" ? "Susunod na Hakbang" : "Next Step"}</h3>
                        <p className="text-sm text-white/70 leading-relaxed">{jobMatchResult.faqTip}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </>)}

      </main>

      {/* Footer Branding Area */}
      {currentTab !== "chat" && (
      <footer id="app-footer" className="mt-20 border-t border-kt-border bg-kt-bg py-12 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-kt-blue">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-xl font-extrabold text-kt-near-black">
              Ka-Traba<span className="text-kt-gold">HO</span>
            </span>
          </div>
          <p className="font-bold text-kt-near-black text-base">Ka-TrabaHO Career Guidance System</p>
          <p className="text-sm text-kt-slate max-w-lg mx-auto leading-relaxed">{lang === "fil" ? "Hindi opisyal ngunit magalang na sumusuporta sa mga kabataang Pilipino na kumuha ng libreng TESDA vocational training." : "Unofficial yet respectfully supporting Filipino youth in accessing free TESDA vocational training."}</p>
          <div className="pt-4 border-t border-kt-border mt-6">
            <p className="text-xs text-kt-slate">{lang === "fil" ? "Platform na ginawa gamit ang AI support at lokal na job insights." : "Platform built using AI support and local job insights."}</p>
          </div>
        </div>
       </footer>
      )}
       <BottomNav lang={lang} />
    </div>
  );
}
