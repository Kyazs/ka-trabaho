import React, { useState, useEffect, useRef } from "react";
import DOMPurify from 'dompurify';
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
  Info,
  FileText,
  AlertTriangle,
  type LucideIcon
} from "lucide-react";
import Navbar from "./components/Navbar";
import PageHeader from "./components/PageHeader";
import BottomNav from "./components/BottomNav";
import LandingPage from "./components/LandingPage";
import AssessmentWizard from "./components/AssessmentWizard";
import { PHILIPPINES_REGIONS, SECTORS_DATA, TESDA_FAQ, Sector } from "./data/tesdaData";
import { UserProfile, MatchingResult, ChatMessage } from "./types";

// Dynamic mapper for Sector icons
const getSectorIcon = (iconName: string) => {
  switch (iconName) {
    case "Laptop":
      return <Laptop className="h-6 w-6 text-[#0F3D91]" />;
    case "Utensils":
      return <Utensils className="h-6 w-6 text-[#16a34a]" />;
    case "Hammer":
      return <Hammer className="h-6 w-6 text-[#FCD116]" />;
    case "Sprout":
      return <Sprout className="h-6 w-6 text-[#16a34a]" />;
    case "HeartPulse":
      return <HeartPulse className="h-6 w-6 text-[#0F3D91]" />;
    default:
      return <GraduationCap className="h-6 w-6 text-[#0F3D91]" />;
  }
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [lang, setLang] = useState<"fil" | "en">("fil");
  
  // Form profile states
  const [age, setAge] = useState<number>(18);
  const [education, setEducation] = useState<string>("Junior High School Graduate");
  const [selectedRegion, setSelectedRegion] = useState<string>("R9");
  const [selectedProvince, setSelectedProvince] = useState<string>("Zamboanga City");
  const [selectedProvincesList, setSelectedProvincesList] = useState<string[]>(PHILIPPINES_REGIONS.find(r => r.code === "R9")?.provinces || []);
  
  // Custom Tag selections for interests
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState<string>("");
  const [skillInput, setSkillInput] = useState<string>("");
  const [careerGoal, setCareerGoal] = useState<string>("");

  // Result and loading states
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<MatchingResult | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  
  // Job matching states
  const [isJobMatching, setIsJobMatching] = useState<boolean>(false);
  const [jobMatchResult, setJobMatchResult] = useState<any | null>(null);
  const [jobMatchError, setJobMatchError] = useState<string | null>(null);
  
  // Course Explorer state
  const [selectedSector, setSelectedSector] = useState<Sector>(SECTORS_DATA[0]);
  const [explorerQuery, setExplorerQuery] = useState<string>("");

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Mabuhay! Ako si Ka-TrabaHO, ang iyong gabay sa mga libreng kurso at iskolarship ng TESDA. Pwede mo akong tanungin tungkol sa mga pre-requisites ng kurso, mga kailangang dokumento, o kung paano mag-apply. Handa akong tumulong sa iyo!",
      timestamp: new Date()
    }
  ]);
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
  
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const matchingCardRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isSendingMessage]);

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
      setCurrentTab("match");
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
      title: { fil: "Sektor at Kurso", en: "Course & Job Explorer" },
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
      title: { fil: "Hanapin ang Trabaho", en: "Job Market" },
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
    if (interestInput.trim() && !customInterests.includes(interestInput.trim())) {
      setCustomInterests([...customInterests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillInput.trim() && !customSkills.includes(skillInput.trim())) {
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
      const response = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      
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

        setMatchError("Nakatanggap ang server ng kakaibang sagot. Subukang muli, o gamitin ang fallback na rekomendasyon.");
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
           text: `Salamat sa pagkumpleto ng iyong profile! Batay sa pagsusuri ko, narito ang mga pinakamagandang TESDA course para sa iyo sa ${selectedProvince || regionText}. Tingnan ang listahan sa ibaba! Kung may mabilis kang tanong ukol sa enrolment, mag-chat lang dito sa "Chat kay Ka-TrabaHO" tab!`,
          timestamp: new Date()
        }
      ]);

    } catch (err: any) {

      setMatchError("Hindi namin makakonek sa aming AI server ngayon. Huwag mag-alala! Maaari mo pa ring mano-manong tingnan ang mga kurso sa 'Sektor at Kurso' tab sa itaas.");
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
      const response = await fetch("/api/job-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });

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
      
    } catch (err: any) {
      setJobMatchError(err.message || "Hindi namin ma-konekta sa aming AI server. Subukang muli o manu-manong tignan ang mga sektor sa itaas.");
    } finally {
      setIsJobMatching(false);
    }
  };

  // Chat input validation
  const validateChatInput = (input: string): boolean => {
    if (input.length > 500) {
      setChatInputError("Masyadong mahaba ang mensahe. Maximum 500 characters lang.");
      return false;
    }
    setChatInputError(null);
    return true;
  };

  // Career goal validation
  const validateCareerGoal = (input: string): boolean => {
    if (input.length > 200) {
      setCareerGoalError("Masyadong mahaba. Maximum 200 characters lang.");
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

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: apiHistory,
          userProfile
        })
      });

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
              text: "Nag-time out ang connection. Susubukan ulit...",
              timestamp: new Date()
            }
          ]);
          
          // Wait 3 seconds and retry
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          const retryResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: textToSend,
              history: apiHistory,
              userProfile
            })
          });
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            setChatMessages(prev => [
              ...prev.filter(m => !m.id.startsWith('ai-retry-')),
              {
                id: `ai-${Date.now()}`,
                role: "model",
                text: retryData.text || "Humihingi ako ng pasensya, parang may problema sa pag-proseso ng aking sagot. Pakisubukang muli.",
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
          text: responseData.text || "Humihingi ako ng pasensya, parang may problema sa pag-proseso ng aking sagot. Pakisubukang muli.",
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "model",
          text: err.message || "Pasensya na po, parang naputol ang aking koneksyon. Pakiunawa na palagi kang pwedeng pumunta sa pinakamalapit na sangay ng TESDA sa inyong komunidad para sa agarang suporta!",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Helper trigger to ask chatbot directly about any course code
  const askChatAboutCourse = (courseCode: string, courseName: string) => {
    setCurrentTab("chat");
    const promptText = `Interesado po ako mag-enroll sa ${courseName} (Code: ${courseCode}). Ano po ba ang eksaktong Requirements at paano mag-apply ng scholarship?`;
    handleSendChatMessage(promptText);
  };

  // Helper trigger to ask chatbot directly about any job
  const askChatAboutJob = (jobTitle: string, requiredCourses: any[]) => {
    setCurrentTab("chat");
    const courseNames = requiredCourses.map((c: any) => c.name).join(", ");
    const promptText = `Interesado po ako sa trabahong ${jobTitle}. Ano po ba ang mga kailangang TESDA courses para makapag-apply? Naririnig ko na kailangan ng ${courseNames}. Pwede po bang magbigay ng detalye?`;
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
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-[#1A1A2E] overflow-x-hidden" id="main-root-container">
      {/* Navbar section */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        lang={lang} 
        setLang={setLang}

      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10 overflow-x-hidden pb-24 md:pb-0" id="app-main">
        {currentTab === "landing" ? (
          <LandingPage lang={lang} setCurrentTab={setCurrentTab} />
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
                setCurrentTab("explorer");
              }}
              onGoToChat={() => setCurrentTab("chat")}
              onGoToFaq={() => setCurrentTab("faq")}
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
            <div className="bg-white rounded-2xl border border-[#e5e8ef] p-5 shadow-[0_4px_32px_rgba(15,61,145,0.07)] max-w-xl">
              <label className="block text-xs font-bold uppercase text-[#6B7280] tracking-wider mb-2" htmlFor="input-explorer-search">
                {lang === "fil" ? "Mabilisang Paghahanap sa Sektor o Kurso" : "Search Vocational Database"}
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#6B7280]" />
                <input
                  id="input-explorer-search"
                  type="text"
                  placeholder={lang === "fil" ? "I-type e.g., computer, barista, welding, NC II..." : "Type keywords like welding, cookery..."}
                  value={explorerQuery}
                  onChange={(e) => setExplorerQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#e5e8ef] bg-white pl-10 pr-4 py-3 text-sm focus:bg-white focus:border-[#0F3D91] focus:ring-3 focus:ring-[#E8F0FE] font-medium transition-all"
                />
              </div>
            </div>

            {/* Mobile horizontal chip list */}
            <div className="flex overflow-x-auto gap-2 pb-2 lg:hidden">
              {filteredSectors.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSector(sector)}
                  className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    selectedSector.id === sector.id
                      ? "bg-[#0F3D91] text-white shadow-sm"
                      : "bg-white border border-[#e5e8ef] text-[#1A1A2E]"
                  }`}
                >
                  {sector.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sector Selection Grid Left */}
              <div id="explorer-left-sectors" className="hidden lg:block lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] pl-1 mb-2">
                  {lang === "fil" ? "Pumili ng Sektor na Gusto:" : "Choose a Vocational Sector:"}
                </h3>
                
                <div className="space-y-2">
                  {filteredSectors.map((sector) => (
                    <button
                      key={sector.id}
                      type="button"
                      id={`btn-explorer-sector-${sector.id}`}
                      onClick={() => setSelectedSector(sector)}
                      className={`w-full text-left rounded-xl p-4 border transition-all flex items-start gap-3.5 ${
                        selectedSector.id === sector.id
                          ? "bg-[#0F3D91] text-white border-[#0F3D91] shadow-md shadow-[#E8F0FE]"
                          : "bg-white text-[#1A1A2E] border-[#e5e8ef] hover:bg-[#E8F0FE]"
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg shrink-0 ${
                        selectedSector.id === sector.id ? "bg-white/10 text-white" : "bg-[#E8F0FE] text-[#0F3D91]"
                      }`}>
                        {getSectorIcon(sector.iconName)}
                      </div>
                      <div>
                        <span className="block font-display font-bold text-sm tracking-tight leading-none">
                          {sector.name}
                        </span>
                        <span className={`block text-[11px] mt-1.5 leading-normal ${
                          selectedSector.id === sector.id ? "text-white/80" : "text-[#6B7280]"
                        }`}>
                          {sector.courses.length} na accredited courses
                        </span>
                      </div>
                    </button>
                  ))}

                  {filteredSectors.length === 0 && (
                    <div className="text-center p-8 bg-[#F8F9FC] rounded-xl border border-dashed border-[#e5e8ef]">
                      <BadgeHelp className="h-8 w-8 text-[#6B7280] mx-auto mb-2" />
                      <p className="text-xs text-[#6B7280] font-bold">Walang tumugmang sektor</p>
                      <button 
                        id="btn-clear-search"
                        onClick={() => setExplorerQuery("")}
                        className="mt-2 text-xs font-bold text-[#0F3D91] decoration-dotted underline"
                      >
                        I-clear ang filter
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Main sector representation Right */}
              <div id="explorer-right-details" className="lg:col-span-8 space-y-6">
                
                {/* Sector Description Box */}
                <div className="bg-white rounded-2xl border border-[#e5e8ef] p-6 shadow-[0_4px_32px_rgba(15,61,145,0.07)]">
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="p-3 bg-[#E8F0FE] text-[#0F3D91] rounded-xl">
                      {getSectorIcon(selectedSector.iconName)}
                    </div>
                    <div>
                      <h2 className="font-display font-black text-xl text-[#1A1A2E]">
                        {selectedSector.name}
                      </h2>
                      <span className="inline-block bg-[#E8F0FE] text-[#0F3D91] font-bold text-[10px] px-2.5 py-0.5 rounded-full mt-1 uppercase border border-[#d4e3ff]">
                        Accredited Sector Program
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                    {selectedSector.description}
                  </p>
                </div>

                {/* Section Jobs mapped */}
                <div>
                  <h3 className="font-display font-bold text-sm text-[#1A1A2E] mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#0F3D91]" />
                    Paghahanap ng Trabaho at Kita (Employment Demand Index)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="explorer-jobs-list">
                    {selectedSector.jobs.map((job, idx) => (
                      <div key={idx} className="bg-white border border-[#e5e8ef] rounded-2xl p-4 shadow-[0_4px_32px_rgba(15,61,145,0.07)] flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-display font-bold text-xs text-[#1A1A2E] leading-tight">
                              {job.title}
                            </h4>
                            <span className={`flex-shrink-0 text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                              job.demandLevel === "Very High" 
                                ? "bg-red-50 text-red-700 border-red-200" 
                                : job.demandLevel === "High"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-[#E8F0FE] text-[#0F3D91] border-[#d4e3ff]"
                            }`}>
                              {job.demandLevel} Demand
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6B7280] mt-2 leading-relaxed">
                            {job.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#e5e8ef] flex justify-between items-center bg-[#F8F9FC] p-2.5 rounded-lg">
                          <span className="text-[10px] text-[#6B7280] block font-bold uppercase tracking-wider">Salary Estimate</span>
                          <span className="font-mono text-xs font-bold text-[#1A1A2E]">{job.averageSalary}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Courses detail tabs */}
                <div id="explorer-courses-list" className="space-y-4">
                  <h3 className="font-display font-bold text-sm text-[#1A1A2E] flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[#0F3D91]" />
                    Mga Accredited TESDA Program at Micro-Credentials
                  </h3>

                  <div className="space-y-4">
                    {selectedSector.courses.map((course) => (
                      <div 
                        key={course.code} 
                        id={`course-card-${course.code}`}
                        className="bg-white rounded-2xl border border-[#e5e8ef] p-5 shadow-[0_4px_32px_rgba(15,61,145,0.07)] hover:border-[#d4e3ff] transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono text-xs font-bold px-2 rounded-md bg-[#E8F0FE] text-[#0F3D91] border border-[#d4e3ff] shrink-0">
                              {course.code}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                              course.level === "Micro-credential" 
                                ? "bg-[#f3f0ff] text-[#5b21b6] border border-[#ddd6fe]"
                                : "bg-[#E8F0FE] text-[#0F3D91] border border-[#d4e3ff]"
                            }`}>
                              {course.level}
                            </span>
                            <span className="text-[#e5e8ef]">|</span>
                            <span className="flex items-center gap-1.5 text-xs text-[#6B7280] font-medium">
                              <Clock className="h-3.5 w-3.5 text-[#6B7280]" />
                              {course.duration}
                            </span>
                          </div>

                          <button
                            id={`btn-explorer-engage-chat-${course.code}`}
                            onClick={() => askChatAboutCourse(course.code, course.name)}
                            className="text-xs font-bold text-[#0F3D91] hover:text-[#0F3D91] hover:bg-[#E8F0FE] rounded-lg px-3 py-1.5 border border-[#d4e3ff] flex items-center gap-1.5 self-start sm:self-auto"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Itanong kung paano sumali</span>
                          </button>
                        </div>

                        <div>
                          <h4 className="font-display font-bold text-sm sm:text-base text-[#1A1A2E]">
                            {course.name}
                          </h4>
                          <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#e5e8ef]">
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-[#6B7280] mb-1">Prerequisite (Sino ang pwede?)</span>
                            <span className="block text-xs font-bold text-[#1A1A2E]">{course.entryReq}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-[#6B7280] mb-1">Matututunang Kakayahan (Skills)</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {course.skillsAcquired.map((skill, idx) => (
                                <span key={idx} className="bg-[#F8F9FC] text-[#6B7280] text-[10px] font-medium px-2 py-0.5 rounded border border-[#e5e8ef]">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                className="rounded-full bg-[#E8F0FE] hover:bg-[#d4e3ff] text-[#0F3D91] text-sm px-5 py-2.5 border border-[#d4e3ff] font-bold transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <DollarSign className="h-4 w-4 inline" /> May daily allowance po ba?
              </button>
              <button
                id="preset-q-als"
                onClick={() => handleSendChatMessage("Pwede po ba akong mag-TESDA kahit ALS Graduate lang ako?")}
                className="rounded-full bg-[#E8F0FE] hover:bg-[#d4e3ff] text-[#0F3D91] text-sm px-5 py-2.5 border border-[#d4e3ff] font-bold transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <GraduationCap className="h-4 w-4 inline" /> Pwede ba ang ALS graduate?
              </button>
              <button
                id="preset-q-docs"
                onClick={() => handleSendChatMessage("Ano-ano po bang dokumento ang kailangan ko ihanda kapag mag-e-enroll?")}
                className="rounded-full bg-[#E8F0FE] hover:bg-[#d4e3ff] text-[#0F3D91] text-sm px-5 py-2.5 border border-[#d4e3ff] font-bold transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <FileText className="h-4 w-4 inline" /> Dokumentong kailangan?
              </button>
              <button
                id="preset-q-nc"
                onClick={() => handleSendChatMessage("Ano po ba ang makukuha kong certificate pagkatapos ng training?")}
                className="rounded-full bg-[#E8F0FE] hover:bg-[#d4e3ff] text-[#0F3D91] text-sm px-5 py-2.5 border border-[#d4e3ff] font-bold transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <Award className="h-4 w-4 inline" /> Ano ang National Certificate (NC)?
              </button>
            </div>

            {/* Chat Messages Log Frame */}
            <div className="bg-white rounded-3xl border border-[#e5e8ef] shadow-[0_4px_32px_rgba(15,61,145,0.07)] overflow-hidden flex flex-col h-[60vh] sm:h-[600px]">
              
              {/* Profile Bar indicator */}
              <div className="bg-[#0F3D91] text-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[#0F3D91]/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCD116] font-black text-sm text-[#1A1A2E] shadow-lg">
                    KT
                  </div>
                  <div>
                    <span className="block text-sm font-bold leading-tight">Ka-TrabaHO AI Companion</span>
                    <span className="block text-xs text-white/80 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> Handang tumulong ngayon
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Rate Limit Badge */}
                  {rateLimits.chat.remaining < 5 && (
                    <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      rateLimits.chat.remaining > 2 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : rateLimits.chat.remaining > 0 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      <span>{rateLimits.chat.remaining}/5 left</span>
                    </div>
                  )}
                  <div className="text-xs text-white/60 text-right hidden sm:block">
                    <span>Rehiyon: {PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.name || selectedRegion}</span>
                  </div>
                </div>
              </div>

              {/* Message log */}
              <div id="chat-messages-scrollarea" className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 bg-[#F8F9FC]">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} max-w-full animate-slide-in`}
                  >
                    <div
                      className={`rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm leading-relaxed max-w-[80%] sm:max-w-[75%] shadow-md ${
                        msg.role === "user"
                          ? "bg-[#0F3D91] text-white rounded-tr-none"
                          : "bg-white text-[#1A1A2E] border border-[#e5e8ef] rounded-tl-none whitespace-pre-line"
                      }`}
                    >
                      <div className="font-medium break-words">{msg.text}</div>
                      <div className={`text-[10px] mt-2 ${msg.role === "user" ? "text-white/70" : "text-[#6B7280]"}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isSendingMessage && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#e5e8ef] rounded-2xl rounded-tl-none px-4 sm:px-5 py-3 sm:py-4 shadow-md">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#0F3D91] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#0F3D91] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#0F3D91] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm text-[#6B7280]">Nagsusulat si Ka-TrabaHO...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Area */}
              <div className="border-t border-[#e5e8ef] bg-white p-3 sm:p-4">
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
                      value={chatInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 500) {
                          setChatInput(value);
                          setChatInputError(null);
                        }
                      }}
                      placeholder={lang === "fil" ? "Magtanong tungkol sa TESDA..." : "Ask about TESDA..."}
                      className={`w-full rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:bg-white focus:ring-3 transition-all ${
                        chatInputError 
                          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                          : 'border-[#e5e8ef] bg-white focus:border-[#0F3D91] focus:ring-[#E8F0FE]'
                      }`}
                      maxLength={500}
                    />
                    {/* Character Counter */}
                    <div className="absolute right-2 bottom-1 text-[10px] text-[#6B7280]">
                      {chatInput.length}/500
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSendingMessage || !chatInput.trim() || chatInput.length > 500}
                    className="rounded-xl bg-[#0F3D91] hover:bg-[#1a52c4] text-white px-4 sm:px-5 py-2.5 sm:py-3 font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#E8F0FE] hover:shadow-lg flex items-center gap-2"
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
                {/* Input Error Message */}
                {chatInputError && (
                  <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {chatInputError}
                  </div>
                )}
                {/* Rate Limit Warning */}
                {rateLimits.chat.remaining <= 2 && rateLimits.chat.remaining > 0 && (
                  <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {rateLimits.chat.remaining} request{rateLimits.chat.remaining !== 1 ? 's' : ''} remaining today
                  </div>
                )}
                {rateLimits.chat.remaining === 0 && (
                  <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Daily limit reached. Try again tomorrow.
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
            <div className="space-y-4" id="faq-accordions-container">
              {TESDA_FAQ.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-[#e5e8ef] p-5 shadow-[0_4px_32px_rgba(15,61,145,0.07)] space-y-2">
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-[#1A1A2E] flex items-start gap-2.5 leading-snug">
                    <span className="bg-[#E8F0FE] shrink-0 text-xs px-2 py-0.5 rounded-md text-[#0F3D91] border border-[#d4e3ff]">T{idx + 1}</span>
                    <span>{faq.question}</span>
                  </h3>
                  <div className="pl-9 text-xs sm:text-sm text-[#6B7280] leading-relaxed mt-2 font-medium">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>

            {/* Offline-apply reference block */}
            <div className="bg-white rounded-2xl border border-[#e5e8ef] p-6 shadow-[0_4px_32px_rgba(15,61,145,0.07)] mt-8 space-y-4">
              <h3 className="font-display font-bold text-sm text-[#1A1A2E] flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#0F3D91]" />
                Handa ka na bang bumisita?
              </h3>
              <p className="text-xs text-[#6B7280] leading-normal">
                Maaari mong hanapin ang pinakamalapit na TESDA Regional o Provincial Office sa inyong komunidad. Magdala lamang ng panulat, iyong PSA birth certificate, at school credentials or ALS completer duplicate certificate. Sila ay bukas mula <strong>Lunes hanggang Biyernes (8:00 AM - 5:00 PM)</strong>.
              </p>
              
              <div className="rounded-xl bg-[#E8F0FE] p-4 border border-[#d4e3ff] flex items-start gap-3">
                <Info className="h-5 w-5 text-[#0F3D91] shrink-0 mt-0.5" />
                <p className="text-xs text-[#0F3D91] leading-relaxed">
                  <strong>Iskolarship Alert:</strong> Palaging itanong ang programang <strong>UAQTE</strong> o <strong>STPES (Special Training for Employment Program)</strong> dahil ang mga ito ay may kaakibat na kumpletong libreng gamit at daily allowances!
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
            {/* Job Matching Form */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#e5e8ef] p-6 md:p-8 shadow-[0_4px_32px_rgba(15,61,145,0.07)]">
              <div className="space-y-4">
                <div className="bg-[#F8F9FC] rounded-xl p-4 border border-[#e5e8ef]">
                  <p className="text-sm text-[#1A1A2E]">
                    <strong>Current Profile:</strong> {age} years old, {education}, {selectedRegion}
                    {customInterests.length > 0 && ` | Interests: ${customInterests.join(", ")}`}
                    {careerGoal && ` | Goal: ${careerGoal}`}
                  </p>
                </div>

                <button
                  id="btn-submit-job-matching"
                  type="button"
                  onClick={handleSubmitJobMatching}
                  disabled={isJobMatching || (customInterests.length === 0 && !careerGoal)}
                  className={`w-full rounded-xl py-4 text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isJobMatching
                      ? "bg-[#fffbe6] text-[#92710a] cursor-wait border-2 border-[#FCD116]"
                      : customInterests.length === 0 && !careerGoal
                      ? "bg-[#F8F9FC] text-[#6B7280] cursor-not-allowed border-2 border-dashed border-[#e5e8ef]"
                      : "bg-[#0F3D91] hover:bg-[#1a52c4] text-white hover:shadow-xl hover:scale-[1.01]"
                  }`}
                >
                  {isJobMatching ? (
                    <>
                      <span className="animate-spin inline-block h-5 w-5 border-2 border-[#FCD116] border-t-transparent rounded-full" />
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

                {(customInterests.length === 0 && !careerGoal) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-800 font-semibold">
                      {lang === "fil" 
                        ? "Pumili ng kahit isang interes sa 'AI Matcher' tab o magsulat sa career goal para ma-unlock ang Job Matching."
                        : "Select at least one interest in the 'AI Matcher' tab or type a career goal to unlock Job Matching."
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Match Error */}
            {jobMatchError && (
              <div id="job-matching-error" className="p-6 rounded-2xl border border-red-200 flex items-start gap-4 bg-red-50 text-red-700 max-w-2xl mx-auto shadow-lg">
                <div className="p-2 rounded-xl bg-red-100">
                  <AlertCircle className="h-6 w-6 shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-base">May kaunting aberya</h4>
                  <p className="text-sm text-red-600 mt-2 leading-relaxed">{jobMatchError}</p>
                </div>
              </div>
            )}

            {/* Job Results */}
            {jobMatchResult && Array.isArray(jobMatchResult.recommendedJobs) && (
              <div id="job-results-section" className="space-y-8 max-w-5xl mx-auto">
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 bg-[#f0fdf4] text-[#166534] font-extrabold text-xs px-4 py-2 rounded-full border border-[#bbf7d0] uppercase tracking-wider mb-4">
                    <CheckCircle2 className="h-4 w-4" /> Nakakita ng Tugma!
                  </span>
                <h2 className="font-display font-extrabold text-2xl text-[#1A1A2E] sm:text-3xl">
                Ang Iyong AI Report sa Pagtutugma ng Kurso
              </h2>
                  <p className="text-sm text-[#6B7280] mt-3 max-w-2xl mx-auto leading-relaxed">
                    {jobMatchResult.matchedSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {jobMatchResult.recommendedJobs.map((job: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl border border-[#e5e8ef] shadow-[0_4px_32px_rgba(15,61,145,0.07)] overflow-hidden hover:shadow-lg transition-all flex flex-col h-full card-hover group"
                    >
                      <div className="bg-[#F8F9FC] px-6 py-5 border-b border-[#e5e8ef] flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                          Job Match #{idx + 1}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-sm font-bold px-3 py-1.5 rounded-full bg-[#0F3D91] text-white">
                          {job.matchScore}% Match
                        </span>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-display font-bold text-lg text-[#1A1A2E] leading-tight">
                            {job.jobTitle}
                          </h3>
                          
                          <div className="flex items-center gap-3 mt-3">
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                              job.demandLevel === "Very High" 
                                ? "bg-red-50 text-red-700 border border-red-200" 
                                : job.demandLevel === "High"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-[#E8F0FE] text-[#0F3D91] border border-[#d4e3ff]"
                            }`}>
                              {job.demandLevel} Demand
                            </span>
                            <span className="text-xs text-[#6B7280] font-mono font-semibold">
                              {job.averageSalary}
                            </span>
                          </div>

                          <p className="text-sm text-[#6B7280] mt-4 leading-relaxed bg-[#F8F9FC] p-4 rounded-2xl border border-[#e5e8ef]">
                            <strong className="text-[#1A1A2E]">Bakit para sa iyo:</strong> &ldquo;{job.reasonForYouth}&rdquo;
                          </p>

                          {job.description && (
                <p className="text-sm text-[#6B7280] mt-3 leading-relaxed">
                Narito ang sadyang dinisenyo na pagsusuri pagkatapos tingnan ang iyong edad, lokasyon, at kakayahan.
              </p>
                          )}
                        </div>

                        <div className="mt-8 pt-5 border-t border-[#e5e8ef] space-y-4">
                          {job.requiredCourses && job.requiredCourses.length > 0 && (
                            <div>
                              <span className="text-xs font-bold uppercase text-[#6B7280] tracking-wider">
                                Kailangang TESDA Courses:
                              </span>
                              <div className="mt-3 space-y-3">
                                {job.requiredCourses.map((course: any, cidx: number) => (
                                  <div key={cidx} className="flex items-center justify-between bg-[#F8F9FC] rounded-2xl p-3 border border-[#e5e8ef] group-hover:border-[#d4e3ff] transition-all">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 rounded-xl bg-[#E8F0FE] text-[#0F3D91]">
                                        <GraduationCap className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <span className="text-sm font-bold text-[#1A1A2E]">{course.name}</span>
                                        <span className="text-xs text-[#6B7280] block">{course.code} | {course.duration}</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        const sector = SECTORS_DATA.find((s: any) => s.id === course.sectorId);
                                        if (sector) setSelectedSector(sector);
                                        setCurrentTab("explorer");
                                      }}
                                      className="text-sm text-[#0F3D91] font-bold hover:text-[#0F3D91] px-3 py-2 rounded-xl hover:bg-[#E8F0FE] transition-all border border-[#d4e3ff]"
                                    >
                                      Detalye
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => askChatAboutJob(job.jobTitle, job.requiredCourses)}
                            className="w-full rounded-2xl bg-[#0F3D91] hover:bg-[#1a52c4] text-white font-bold text-sm py-3 text-center flex items-center justify-center gap-2 shadow-md shadow-[#E8F0FE] hover:shadow-lg hover:-translate-y-0.5 transition-all"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>Kausapin ang Counselor</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ Tip */}
                {jobMatchResult.faqTip && (
                  <div className="bg-[#0F3D91] rounded-3xl p-8 text-white border border-[#0F3D91]/20 shadow-[0_4px_32px_rgba(15,61,145,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#FCD116]/10 rounded-full blur-3xl" />
                    <div className="relative flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-white/10">
                        <Info className="h-6 w-6 text-[#FCD116]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[#FCD116] mb-2">Susunod na Hakbang</h3>
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
      <footer id="app-footer" className="mt-20 border-t border-[#e5e8ef] bg-[#F8F9FC] py-12 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-[#0F3D91] shadow-md shadow-[#E8F0FE]">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-xl font-extrabold text-[#1A1A2E]">
              Ka-Traba<span className="text-[#FCD116]">HO</span>
            </span>
          </div>
          <p className="font-bold text-[#1A1A2E] text-base">Ka-TrabaHO Career Guidance System</p>
          <p className="text-sm text-[#6B7280] max-w-lg mx-auto leading-relaxed">Hindi opisyal ngunit magalang na sumusuporta sa mga kabataang Pilipino na kumuha ng libreng TESDA vocational training.</p>
          <div className="pt-4 border-t border-[#e5e8ef] mt-6">
            <p className="text-xs text-[#6B7280]">Platform built using AI support and local job insights.</p>
          </div>
        </div>
      </footer>
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} lang={lang} />
    </div>
  );
}
