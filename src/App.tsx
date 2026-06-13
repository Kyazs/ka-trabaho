import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  MapPin, 
  GraduationCap, 
  Search, 
  ChevronRight, 
  ArrowRight, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Clock, 
  User, 
  Briefcase, 
  DollarSign, 
  Award, 
  BadgeHelp,
  Hammer,
  Laptop,
  Utensils,
  Sprout,
  HeartPulse,
  Info
} from "lucide-react";
import Navbar from "./components/Navbar";
import { PHILIPPINES_REGIONS, SECTORS_DATA, TESDA_FAQ, Sector, TesdaCourse, JobRole, RegionInfo } from "./data/tesdaData";
import { UserProfile, MatchingResult, ChatMessage } from "./types";

// Dynamic mapper for Sector icons
const getSectorIcon = (iconName: string) => {
  switch (iconName) {
    case "Laptop":
      return <Laptop className="h-6 w-6 text-blue-600" />;
    case "Utensils":
      return <Utensils className="h-6 w-6 text-emerald-600" />;
    case "Hammer":
      return <Hammer className="h-6 w-6 text-amber-600" />;
    case "Sprout":
      return <Sprout className="h-6 w-6 text-green-600" />;
    case "HeartPulse":
      return <HeartPulse className="h-6 w-6 text-rose-600" />;
    default:
      return <GraduationCap className="h-6 w-6 text-blue-600" />;
  }
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("match");
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
    console.log("[handleSubmitProfile] Clicked!");
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
    console.log("[handleSubmitProfile] Sending profile:", profile);

    try {
      const response = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      
      console.log("[handleSubmitProfile] Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: Failed to load recommendation.`);
      }

      const data = await response.json();
      console.log("[handleSubmitProfile] Response data:", data);

      if (!data || !Array.isArray(data.recommendedCourses)) {
        console.warn("[handleSubmitProfile] Malformed response - missing recommendedCourses:", data);
        setMatchError("Nakatanggap ang server ng kakaibang sagot. Subukang muli, o gamitin ang fallback na rekomendasyon.");
        return;
      }
      
      setMatchResult(data);
      
      // Auto pre-populate Chatbot perspective with context
      const regionText = PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.name || selectedRegion;
      const initialChatPrompt = `Mabuhay! Nakita ko ang iyong profiling: Ikaw ay isang ${age}-taong gulang na natapos ang ${education}. Labis mong gustong dumaan sa mga kurso patungkol sa [${customInterests.join(", ")}]. Handa kaming tulungan ka! Alin sa aming inirekomendang mga TESDA courses ang pinakagusto mong simulan? O may katanungan ka ba ukol sa scholarships?`;
      
      setChatMessages(prev => [
        ...prev,
        {
          id: `match-update-${Date.now()}`,
          role: "model",
          text: `Salamat sa pagkumpleto ng iyong profile! Batay sa pagsusuri ko, narito ang mga pinakamagandang TESDA course para sa iyo sa ${selectedProvince || regionText}. Tignan ang listahan sa ibaba! Kung may mabilis kang tanong ukol sa enrolment, mag-chat lang dito sa "Chat kay Ka-TrabaHO" tab!`,
          timestamp: new Date()
        }
      ]);

    } catch (err: any) {
      console.error("[handleSubmitProfile] Error:", err);
      setMatchError("Hindi namin ma-konekta sa aming AI server ngayon. Huwag mag-alala! Maaari mo pa ring manual na tignan ang mga kurso sa 'Sektor at Kurso' tab sa itaas.");
    } finally {
      console.log("[handleSubmitProfile] Finished. isMatching=false");
      setIsMatching(false);
    }
  };

  // Job matching handler
  const handleSubmitJobMatching = async () => {
    console.log("[handleSubmitJobMatching] Clicked!");
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

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log("[handleSubmitJobMatching] Response:", data);
      
      if (!data || !Array.isArray(data.recommendedJobs)) {
        throw new Error("Invalid response format from server");
      }
      
      setJobMatchResult(data);
      
    } catch (err: any) {
      console.error("[handleSubmitJobMatching] Error:", err);
      setJobMatchError("Hindi namin ma-konekta sa aming AI server. Subukang muli o manu-manong tignan ang mga sektor sa itaas.");
    } finally {
      setIsJobMatching(false);
    }
  };

  // Chat message submission
  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;

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
      // Map history to fit server structure
      const apiHistory = chatMessages.slice(-8).map(msg => ({
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

      if (!response.ok) {
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
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "model",
          text: "Sensya na po, parang naputol ang aking internet. Pakiunawa na palagi kang pwedeng pumunta sa pinakamalapit na TESDA branch sa inyong komunidad para sa agarang suporta!",
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800" id="main-root-container">
      {/* Navbar section */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        lang={lang} 
        setLang={setLang}
        hasProfile={!!matchResult}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="app-main">
        
        {/* Banner Informational Header */}
        <div id="welcome-alert-banner" className="mb-8 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 shadow-xl text-white sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" /> Special AI Guidance for OSYs & Youth (Ages 15-24)
              </span>
              <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3.5xl">
                {lang === "fil" 
                  ? "I-Match ang Iyong Galing sa Libreng Kurso ng TESDA!" 
                  : "Match Your Talents to High-Demand Free TESDA Courses!"
                }
              </h1>
              <p className="mt-3 text-sm text-blue-100 sm:text-base leading-relaxed">
                {lang === "fil"
                  ? "Huwag hayaang maging balakid ang kahirapan o kawalan ng diploma sa ngayon. Sa tulong ng ating AI Counselor, maghanap ng de-kalidad na kurso na may kaakibat na trabaho sa inyong rehiyon—at may kaukulang daily allowance!"
                  : "Find vocational routes mapped directly to local vacancies and salaries. Completely free under government scholarships with daily stipends."
                }
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button 
                id="banner-profile-start"
                onClick={startAiMatching}
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {lang === "fil" ? "Simulan ang AI Matching" : "Start AI Assessment"}
              </button>
              <button 
                id="banner-chat-assistant"
                onClick={() => setCurrentTab("chat")}
                className="rounded-xl bg-blue-500/20 border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                {lang === "fil" ? "Kausapin si Ka-TrabaHO" : "Talk to Counselor"}
              </button>
            </div>
          </div>
        </div>

        {/* ======================================= */}
        {/* TAB 1: AI JOB & COURSE MATCHER */}
        {/* ======================================= */}
        {currentTab === "match" && (
          <div id="tab-matching-content" className="space-y-8 animate-fade-in">
            {/* Step 1 Form & Profile Creation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Questionnaire Form Side */}
              <div id="matching-questionnaire-card" ref={matchingCardRef} className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-slate-900">
                      {lang === "fil" ? "Mabilisang Profile Assessment" : "Quick Profile Assessment"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {lang === "fil" ? "Gamitin ang AI upang hanapin ang akmang trabaho" : "Let AI evaluate your custom preferences"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Age Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {lang === "fil" ? "Ilang Taon Ka Na? (Bukas para sa edad 15-24+)" : "Your Age (Targeting 15-24)"}
                    </label>
                    <div className="flex items-center gap-4">
                      <input 
                        id="input-profile-age-slider"
                        type="range" 
                        min="15" 
                        max="35" 
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <span className="flex-shrink-0 inline-block bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-sm border border-blue-200">
                        {age} {lang === "fil" ? "taong gulang" : "years old"}
                      </span>
                    </div>
                  </div>

                  {/* Completed Education Level */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {lang === "fil" ? "Ano ang huling antas ng pinag-aralan mo?" : "What is your highest educational attainment?"}
                    </label>
                    <select
                      id="select-profile-edu"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 font-medium"
                    >
                      <option value="Elementary Graduate">Grade 6 / Elementary Graduate (Completer)</option>
                      <option value="Elementary Undergrad">Elementary Undergraduate</option>
                      <option value="Junior High School Graduate">Junior High School Graduate (Grade 10 Completer)</option>
                      <option value="Junior High Undergrad">Junior High Undergraduate (Completer / Drop-out)</option>
                      <option value="Senior High School Graduate">Senior High School Graduate (Grade 12 Completer)</option>
                      <option value="ALS Graduate">ALS (Alternative Learning System) Graduate</option>
                      <option value="Vocational College Undergraduate">College Level Undergrad / Drop-out</option>
                    </select>
                  </div>

                  {/* Region selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        {lang === "fil" ? "Rehiyon (Region)" : "Desired Region"}
                      </label>
                      <select
                        id="select-profile-region"
                        value={selectedRegion}
                        onChange={(e) => handleRegionChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 font-medium"
                      >
                        {PHILIPPINES_REGIONS.map((region) => (
                          <option key={region.code} value={region.code}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        {lang === "fil" ? "Probinsya / City Hub" : "Province / City Hub"}
                      </label>
                      <select
                        id="select-profile-province"
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 font-medium"
                      >
                        {selectedProvincesList.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Interests Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Step 4: {lang === "fil" ? "Pilahan ng lyong mga Interes (Pumili ng higit sa isa):" : "Select Your Main Interests:"}
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {QUICK_INTERESTS.map((int) => (
                        <button
                          key={int.label}
                          type="button"
                          id={`interest-quick-${int.label.replace(/\s+/g, "-")}`}
                          onClick={() => toggleInterestTag(int.label)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                            customInterests.includes(int.label)
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {int.label}
                        </button>
                      ))}
                    </div>

                    {/* Manual interest add */}
                    <form onSubmit={handleAddCustomInterest} className="flex gap-2">
                      <input
                        id="input-custom-interest"
                        type="text"
                        placeholder={lang === "fil" ? "Magsulat ng iba pang interes (e.g., cellphones)" : "Type other custom interests..."}
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-500"
                      />
                      <button
                        id="btn-add-custom-interest"
                        type="submit"
                        className="rounded-xl bg-slate-800 text-white px-3 py-2 text-xs font-bold hover:bg-slate-700"
                      >
                        {lang === "fil" ? "I-add" : "Add"}
                      </button>
                    </form>
                  </div>

                  {/* Practical Skills Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Step 5: {lang === "fil" ? "Anong mga praktikal na bagay ang marunong ka na?" : "What practical skills do you already have?"}
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {QUICK_SKILLS.map((skill) => (
                        <button
                          key={skill.label}
                          type="button"
                          id={`skill-quick-${skill.label.replace(/\s+/g, "-")}`}
                          onClick={() => toggleSkillTag(skill.label)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                            customSkills.includes(skill.label)
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {skill.label}
                        </button>
                      ))}
                    </div>

                    {/* Manual skill add */}
                    <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                      <input
                        id="input-custom-skill"
                        type="text"
                        placeholder={lang === "fil" ? "Magsulat ng iba pang galing o hilig" : "Type other skill..."}
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-500"
                      />
                      <button
                        id="btn-add-custom-skill"
                        type="submit"
                        className="rounded-xl bg-slate-800 text-white px-3 py-2 text-xs font-bold hover:bg-slate-700"
                      >
                        {lang === "fil" ? "I-add" : "Add"}
                      </button>
                    </form>
                  </div>

                  {/* Career Goal Textarea */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {lang === "fil" ? "Ano ang pangarap o plano mong maging trabaho?" : "Any specific job or lifetime plan?"}
                    </label>
                    <textarea
                      id="textarea-profile-goal"
                      rows={2}
                      value={careerGoal}
                      onChange={(e) => setCareerGoal(e.target.value)}
                      placeholder={lang === "fil" ? "E.g., Gusto ko pong makatrabaho sa mga malalaking barko o maging sikat na chef sa amin" : "Example: I want to build a career in computer repair and help my family financially."}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:bg-white focus:border-blue-500 font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    id="btn-submit-matching-form"
                    type="button"
                    onClick={handleSubmitProfile}
                    disabled={isMatching || (customInterests.length === 0 && !careerGoal)}
                    className={`w-full rounded-xl py-4 text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                      isMatching
                        ? "bg-amber-100 text-amber-700 cursor-wait border-2 border-amber-300"
                        : customInterests.length === 0 && !careerGoal
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-dashed border-slate-300"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-[1.01]"
                    }`}
                  >
                    {isMatching ? (
                      <>
                        <span className="animate-spin inline-block h-5 w-5 border-3 border-amber-500 border-t-transparent rounded-full" />
                        <span className="font-extrabold">{lang === "fil" ? "Sinusuri ng AI ang iyong profile..." : "AI is analyzing your profile..."}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>
                          {lang === "fil" 
                            ? "I-Match Akong Libreng TESDA Courses!" 
                            : "Match My Profile Instantly!"
                          }
                        </span>
                      </>
                    )}
                  </button>

                  {(customInterests.length === 0 && !careerGoal) && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                      <span className="text-amber-500 text-lg leading-none">&#9888;</span>
                      <p className="text-xs text-amber-800 font-semibold">
                        {lang === "fil" 
                          ? "Pumili ng kahit isang interes sa itaas o magsulat sa career goal para ma-unlock ang Matching."
                          : "Select at least one interest above or type a career goal to unlock Matching."
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informational Guidance on how it works */}
              <div id="matching-intro-info-card" className="lg:col-span-6 space-y-6">
                
                {/* Visual Banner */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white border border-slate-700 shadow-xl">
                  <h3 className="font-display font-black text-lg text-blue-400 flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    Bakit maganda mag-aral sa TESDA?
                  </h3>
                  <ul className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 text-xs text-blue-400 font-bold items-center justify-center rounded-full bg-blue-500/10 shrink-0 mt-0.5">✓</span>
                      <span><strong>100% Libreng Matrikula:</strong> Walang bayad ang pagsasanay sa pampublikong TESDA schools.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 text-xs text-blue-400 font-bold items-center justify-center rounded-full bg-blue-500/10 shrink-0 mt-0.5">✓</span>
                      <span><strong>May Daily Allowance:</strong> Karamihan ng may scholarship ay tumatanggap ng <strong>₱160 kada araw</strong> para sa pamasahe at pagkain.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 text-xs text-blue-400 font-bold items-center justify-center rounded-full bg-blue-500/10 shrink-0 mt-0.5">✓</span>
                      <span><strong>National Certificate (NC):</strong> Ang lisensyang ibinibigay ng TESDA ay napakalakas na credential para makapasok sa mga kumpanya rito o sa ibang bansa!</span>
                    </li>
                  </ul>
                </div>

                {/* Regional Hotjobs Highlight */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-display font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-indigo-600" />
                    Sektor na May Mataas na Demand sa {PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.name || selectedRegion}:
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Ang TESDA programs ay iniaakma sa pangangailangan ng inyong lokal na merkado. Narito ang mga naghahanap ng mas maraming skilled labor sa iyong piniling rehiyon:
                  </p>
                  
                  <div className="space-y-3" id="regional-high-sectors">
                    {SECTORS_DATA.filter(s => 
                      PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.topSectors.includes(s.id)
                    ).map((sector) => (
                      <div 
                        key={sector.id} 
                        onClick={() => {
                          setSelectedSector(sector);
                          setCurrentTab("explorer");
                        }}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100">
                            {getSectorIcon(sector.iconName)}
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-850">{sector.name}</span>
                            <span className="block text-[10px] text-slate-500">May {sector.courses.length} na akreditadong mga kurso</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-blue-600 font-bold">
                          <span>Suriin</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex items-start gap-2.5">
                    <Info className="h-4 w-4 text-slate-500/80 mt-0.5" />
                    <p className="text-[11px] text-slate-500 leading-normal">
                      <strong>Paano sumailalim?</strong> I-accomplish lamang ang form sa kaliwa upang matukoy ng aming AI counselor kung alin sa mga sector ang pinaka-akma sa iyong hilig at tapos na baitang.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Results Mapping View */}
            {matchError && (
              <div id="matching-error bg-rose-50" className="p-4 rounded-xl border border-rose-100 flex items-start gap-3 bg-red-50 text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">May kaunting aberya</h4>
                  <p className="text-xs text-red-600 mt-1">{matchError}</p>
                </div>
              </div>
            )}

            {matchResult && Array.isArray(matchResult.recommendedCourses) && (
              <div id="matching-results-section" className="space-y-6 pt-4 border-t border-slate-200">
                <div className="text-center max-w-xl mx-auto">
                  <span className="inline-block bg-emerald-50 text-emerald-800 font-extrabold text-[10px] px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider mb-2">
                    ✓ Match Found Successfully
                  </span>
                  <h2 className="font-display font-extrabold text-xl text-slate-900 sm:text-2xl">
                    Iyong AI Course Compatibility Report
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Narito ang sadyang dinisenyo na analysis pagkatapos tignan ang iyong edad, lokasyon, at galing.
                  </p>
                </div>

                {/* AI Summary card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
                  <h4 className="font-display font-extrabold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    AI Counseling Insights:
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    "{matchResult.matchedSummary || "Walang summary available."}"
                  </p>
                </div>

                {/* Courses Match List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="matching-recommendation-grid">
                  {matchResult.recommendedCourses.map((recCourse, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col h-full"
                    >
                      {/* Percent badge heading */}
                      <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Recommended Match #{idx + 1}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-xs font-bold px-2 rounded bg-emerald-100 text-emerald-800 border-emerald-200 border">
                          {recCourse.matchScore}% Match
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                            Code: {recCourse.courseCode}
                          </span>
                          <h3 className="font-display font-bold text-base text-slate-900 mt-2.5 leading-tight">
                            {recCourse.courseName}
                          </h3>
                          
                          <p className="text-xs text-slate-600 mt-3 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <strong>Bakit para sa iyo:</strong> "{recCourse.reasonForYouth}"
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                            <div>
                              <span className="block text-[10px] uppercase text-slate-400">Pag-asensong Trabaho (Job Demand)</span>
                              <span className="block text-xs font-extrabold text-indigo-700">{recCourse.immediateJobTitle}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              id={`btn-match-chat-course-${recCourse.courseCode}`}
                              onClick={() => askChatAboutCourse(recCourse.courseCode, recCourse.courseName)}
                              className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 text-center flex items-center justify-center gap-1.5 transition-all"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>Itanong sa Chat</span>
                            </button>
                            <button
                              id={`btn-match-explore-course-${recCourse.courseCode}`}
                              onClick={() => {
                                // Find relevant sector to show details
                                const sector = SECTORS_DATA.find(sec => 
                                  sec.courses.some(c => c.code === recCourse.courseCode) || 
                                  matchResult.targetSectors?.includes(sec.id)
                                );
                                if (sector) {
                                  setSelectedSector(sector);
                                }
                                setCurrentTab("explorer");
                              }}
                              className="rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5"
                            >
                              Detalyado
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enrollment Tips & Next Steps */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-lg mt-8" id="matching-result-enrollment-card">
                  <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                    <div className="max-w-2xl">
                      <h3 className="font-display font-black text-lg text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Mahalagang Hakbang ukol sa Scholarship & Allowance:
                      </h3>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {matchResult.faqTip || "Pumunta sa pinakamalapit na TESDA Regional/Provincial Office upang mag-apply ng libreng scholarship."}
                      </p>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/10 space-y-1">
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Required Document #1</span>
                          <span className="block text-xs font-bold text-white">PSA Birth Certificate</span>
                          <span className="block text-[10px] text-slate-400">Patunay na ikaw ay Pilipino at sapat sa edad.</span>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/10 space-y-1">
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Required Document #2</span>
                          <span className="block text-xs font-bold text-white">Diploma o ALS Certificate</span>
                          <span className="block text-[10px] text-slate-400">Kung wala pa, barangay indigency ay tinatanggap.</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                      <button 
                        id="btn-goto-chat-counselor"
                        onClick={() => setCurrentTab("chat")}
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-3 px-5 flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950"
                      >
                        <span>Kausapin ang AI Counselor</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button 
                        id="btn-goto-faq"
                        onClick={() => setCurrentTab("faq")}
                        className="rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-3 px-5 text-center"
                      >
                        Tignan ang Buong FAQ Guide
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 2: SECTOR & COURSE DATABASE EXPLORER */}
        {/* ======================================= */}
        {currentTab === "explorer" && (
          <div id="tab-explorer-content" className="space-y-8 animate-fade-in">
            
            {/* Search Input Filter */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm max-w-xl">
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2" htmlFor="input-explorer-search">
                {lang === "fil" ? "Mabilisang Paghahanap sa Sektor o Kurso" : "Search Vocational Database"}
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="input-explorer-search"
                  type="text"
                  placeholder={lang === "fil" ? "I-type e.g., computer, barista, welding, NC II..." : "Type keywords like welding, cookery..."}
                  value={explorerQuery}
                  onChange={(e) => setExplorerQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm focus:bg-white focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sector Selection Grid Left */}
              <div id="explorer-left-sectors" className="lg:col-span-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1 mb-2">
                  {lang === "fil" ? "Pumili ng Sektor na Ninanais:" : "Choose a Vocational Sector:"}
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
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg shrink-0 ${
                        selectedSector.id === sector.id ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {getSectorIcon(sector.iconName)}
                      </div>
                      <div>
                        <span className="block font-display font-bold text-sm tracking-tight leading-none">
                          {sector.name}
                        </span>
                        <span className={`block text-[11px] mt-1.5 leading-normal ${
                          selectedSector.id === sector.id ? "text-blue-100" : "text-slate-500"
                        }`}>
                          {sector.courses.length} na accredited courses
                        </span>
                      </div>
                    </button>
                  ))}

                  {filteredSectors.length === 0 && (
                    <div className="text-center p-8 bg-slate-100/50 rounded-xl border border-dashed border-slate-200">
                      <BadgeHelp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-bold">Walang tumugmang sektor</p>
                      <button 
                        id="btn-clear-search"
                        onClick={() => setExplorerQuery("")}
                        className="mt-2 text-xs font-bold text-blue-600 decoration-dotted underline"
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
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      {getSectorIcon(selectedSector.iconName)}
                    </div>
                    <div>
                      <h2 className="font-display font-black text-xl text-slate-900">
                        {selectedSector.name}
                      </h2>
                      <span className="inline-block bg-blue-50 text-blue-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full mt-1 uppercase">
                        Accredited Sector Program
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedSector.description}
                  </p>
                </div>

                {/* Section Jobs mapped */}
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                    <Briefcase className="h-4.5 w-4.5 text-blue-600" />
                    Paghahanap ng Trabaho at Kita (Employment Demand Index)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="explorer-jobs-list">
                    {selectedSector.jobs.map((job, idx) => (
                      <div key={idx} className="bg-slate-55 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-display font-bold text-xs text-slate-900 leading-tight">
                              {job.title}
                            </h4>
                            <span className={`flex-shrink-0 text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                              job.demandLevel === "Very High" 
                                ? "bg-red-50 text-red-700 border-red-200" 
                                : job.demandLevel === "High"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-indigo-50 text-indigo-700 border-indigo-200"
                            }`}>
                              {job.demandLevel} Demand
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                            {job.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 p-2.5 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Salary Estimate</span>
                          <span className="font-mono text-xs font-bold text-slate-900">{job.averageSalary}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Courses detail tabs */}
                <div id="explorer-courses-list" className="space-y-4">
                  <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
                    <GraduationCap className="h-4.5 w-4.5 text-blue-600" />
                    Mga Accredited TESDA Program at Micro-Credentials
                  </h3>

                  <div className="space-y-4">
                    {selectedSector.courses.map((course) => (
                      <div 
                        key={course.code} 
                        id={`course-card-${course.code}`}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono text-xs font-bold px-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                              {course.code}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                              course.level === "Micro-credential" 
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            }`}>
                              {course.level}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              {course.duration}
                            </span>
                          </div>

                          <button
                            id={`btn-explorer-engage-chat-${course.code}`}
                            onClick={() => askChatAboutCourse(course.code, course.name)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-lg px-3 py-1.5 border border-blue-200 flex items-center gap-1.5 self-start sm:self-auto"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Itanong kung paano sumali</span>
                          </button>
                        </div>

                        <div>
                          <h4 className="font-display font-bold text-sm sm:text-base text-slate-900">
                            {course.name}
                          </h4>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Prerequisite (Sino ang pwede?)</span>
                            <span className="block text-xs font-bold text-slate-700">{course.entryReq}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Matututunang Kakayahan (Skills)</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {course.skillsAcquired.map((skill, idx) => (
                                <span key={idx} className="bg-slate-50 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200">
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
          <div id="tab-chat-content" className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            
            {/* Header chat instruction */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center">
              <span className="inline-block bg-blue-50 text-blue-800 font-bold text-xs px-3 py-1 rounded-full mb-2">
                🟢 Live AI Companion Assistance
              </span>
              <h2 className="font-display font-black text-xl text-slate-900">
                Kausapin si Ka-TrabaHO
              </h2>
              <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed mt-1">
                Kumpanero mo sa pagpili at pag-apply sa TESDA. Huwag mahiyang magtanong gamit ang sariling wika o Taglish ukol sa matrikula, matitirhan, o allowance.
              </p>
            </div>

            {/* Quick pre-seeded questions */}
            <div className="flex flex-wrap gap-2 justify-center" id="frequent-questions-row">
              <button
                id="preset-q-allowance"
                onClick={() => handleSendChatMessage("May allowance po ba habang nag-aaral sa TESDA?")}
                className="rounded-full bg-blue-50/50 hover:bg-blue-100/50 text-blue-700 text-xs px-4 py-2 border border-blue-200 font-bold transition-all"
              >
                💸 May daily allowance po ba?
              </button>
              <button
                id="preset-q-als"
                onClick={() => handleSendChatMessage("Pwede po ba akong mag-TESDA kahit ALS Graduate lang ako?")}
                className="rounded-full bg-blue-50/50 hover:bg-blue-100/50 text-blue-700 text-xs px-4 py-2 border border-blue-200 font-bold transition-all"
              >
                🎓 Pwede ba ang ALS graduate?
              </button>
              <button
                id="preset-q-docs"
                onClick={() => handleSendChatMessage("Ano-ano po bang dokumento ang kailangan ko ihanda kapag mag-e-enroll?")}
                className="rounded-full bg-blue-50/50 hover:bg-blue-100/50 text-blue-700 text-xs px-4 py-2 border border-blue-200 font-bold transition-all"
              >
                📂 Dokumentong kailangan?
              </button>
              <button
                id="preset-q-nc"
                onClick={() => handleSendChatMessage("Ano po ba ang makukuha kong certificate pagkatapos ng training?")}
                className="rounded-full bg-blue-50/50 hover:bg-blue-100/50 text-blue-700 text-xs px-4 py-2 border border-blue-200 font-bold transition-all"
              >
                🏆 Ano ang National Certificate (NC)?
              </button>
            </div>

            {/* Chat Messages Log Frame */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[500px]">
              
              {/* Profile Bar indicator */}
              <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-black text-sm text-white">
                    KT
                  </div>
                  <div>
                    <span className="block text-xs font-bold leading-tight">Ka-TrabaHO AI Companion</span>
                    <span className="block text-[10px] text-emerald-400">Handang tumulong ngayon</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-right hidden sm:block">
                  <span>Rehiyon: {PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.name || selectedRegion}</span>
                </div>
              </div>

              {/* Message log */}
              <div id="chat-messages-scrollarea" className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} max-w-full`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed max-w-[85%] sm:max-w-[75%] shadow-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`block text-[8px] text-right mt-1.5 ${msg.role === "user" ? "text-blue-200" : "text-slate-400"}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {isSendingMessage && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-none bg-white border border-slate-200 px-4 py-3 flex items-center gap-2">
                      <span className="animate-bounce inline-block h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span className="animate-bounce inline-block h-1.5 w-1.5 rounded-full bg-slate-400 [animation-delay:0.2s]" />
                      <span className="animate-bounce inline-block h-1.5 w-1.5 rounded-full bg-slate-400 [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Form panel */}
              <div className="p-4 bg-white border-t border-slate-200">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage();
                  }}
                  className="flex gap-2.5"
                >
                  <input
                    id="input-chat-query"
                    type="text"
                    placeholder={lang === "fil" ? "Magsulat o magtanong kay Ka-TrabaHO dito..." : "Ask your vocational query here..."}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isSendingMessage}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                  />
                  <button
                    id="btn-send-chat"
                    type="submit"
                    disabled={isSendingMessage || !chatInput.trim()}
                    className={`rounded-xl px-5 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      isSendingMessage || !chatInput.trim()
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"
                    }`}
                  >
                    <span>Send</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* TAB 4: FREQUENTLY ASKED QUESTIONS */}
        {/* ======================================= */}
        {currentTab === "faq" && (
          <div id="tab-faq-content" className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            
            <div className="text-center max-w-md mx-auto mb-8">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 inline-block mb-3">
                <HelpCircle className="h-6 w-6" />
              </span>
              <h2 className="font-display font-black text-xl text-slate-900">
                Mga Karaniwang Katanungan (FAQ)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Kabilang dito ang mga detalyadong sagot tungkol sa TESDA scholarships, bayarin, at paano makapagsimula agad.
              </p>
            </div>

            <div className="space-y-4" id="faq-accordions-container">
              {TESDA_FAQ.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 flex items-start gap-2.5 leading-snug">
                    <span className="text-blue-650 bg-blue-50 shrink-0 text-xs px-2 py-0.5 rounded-md text-blue-700">T{idx + 1}</span>
                    <span>{faq.question}</span>
                  </h3>
                  <div className="pl-9 text-xs sm:text-sm text-slate-650 leading-relaxed text-slate-650 mt-2 font-medium">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>

            {/* Offline-apply reference block */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-8 space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-blue-600" />
                Handa ka na bang bumisita?
              </h3>
              <p className="text-xs text-slate-600 leading-normal">
                Maaari mong hanapin ang pinakamalapit na TESDA Regional o Provincial Office sa inyong komunidad. Magdala lamang ng panulat, iyong PSA birth certificate, at school credentials or ALS completer duplicate certificate. Sila ay bukas mula <strong>Lunes hanggang Biyernes (8:00 AM - 5:00 PM)</strong>.
              </p>
              
              <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
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
            {/* Job Matching Form */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    {lang === "fil" ? "Hanapin ang Angkop na Trabaho" : "Find Matching Jobs"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === "fil" ? "Gamitin ang AI para malaman ang mga trabahong akma sa iyong profile" : "Let AI find jobs that match your skills and interests"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-sm text-slate-700">
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
                      ? "bg-amber-100 text-amber-700 cursor-wait border-2 border-amber-300"
                      : customInterests.length === 0 && !careerGoal
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-dashed border-slate-300"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:scale-[1.01]"
                  }`}
                >
                  {isJobMatching ? (
                    <>
                      <span className="animate-spin inline-block h-5 w-5 border-3 border-emerald-500 border-t-transparent rounded-full" />
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
                    <span className="text-amber-500 text-lg leading-none">&#9888;</span>
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
              <div id="job-matching-error" className="p-4 rounded-xl border border-rose-100 flex items-start gap-3 bg-red-50 text-red-700 max-w-2xl mx-auto">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">May kaunting aberya</h4>
                  <p className="text-xs text-red-600 mt-1">{jobMatchError}</p>
                </div>
              </div>
            )}

            {/* Job Results */}
            {jobMatchResult && Array.isArray(jobMatchResult.recommendedJobs) && (
              <div id="job-results-section" className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <span className="inline-block bg-emerald-50 text-emerald-800 font-extrabold text-[10px] px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider mb-2">
                    ✓ Job Matches Found
                  </span>
                  <h2 className="font-display font-extrabold text-xl text-slate-900 sm:text-2xl">
                    {lang === "fil" ? "Mga Trabahong Akma sa Iyo" : "Jobs Matched to Your Profile"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
                    {jobMatchResult.matchedSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobMatchResult.recommendedJobs.map((job: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col h-full"
                    >
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Job Match #{idx + 1}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-xs font-bold px-2 rounded bg-emerald-100 text-emerald-800 border-emerald-200 border">
                          {job.matchScore}% Match
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-display font-bold text-base text-slate-900 leading-tight">
                            {job.jobTitle}
                          </h3>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              job.demandLevel === "Very High" 
                                ? "bg-red-100 text-red-700" 
                                : job.demandLevel === "High"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {job.demandLevel} Demand
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {job.averageSalary}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-3 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <strong>Bakit para sa iyo:</strong> &ldquo;{job.reasonForYouth}&rdquo;
                          </p>

                          {job.description && (
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                              {job.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                          {job.requiredCourses && job.requiredCourses.length > 0 && (
                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Kailangang TESDA Courses:
                              </span>
                              <div className="mt-2 space-y-2">
                                {job.requiredCourses.map((course: any, cidx: number) => (
                                  <div key={cidx} className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-slate-100">
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4 text-blue-600" />
                                      <div>
                                        <span className="text-xs font-bold text-slate-800">{course.name}</span>
                                        <span className="text-[10px] text-slate-500 block">{course.code} | {course.duration}</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        const sector = SECTORS_DATA.find((s: any) => s.id === course.sectorId);
                                        if (sector) setSelectedSector(sector);
                                        setCurrentTab("explorer");
                                      }}
                                      className="text-xs text-blue-600 font-bold hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-all"
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
                            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 text-center flex items-center justify-center gap-1.5 transition-all"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Kausapin ang Counselor</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ Tip */}
                {jobMatchResult.faqTip && (
                  <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm text-emerald-400">Next Step</h3>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{jobMatchResult.faqTip}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer Branding Area */}
      <footer id="app-footer" className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-bold text-slate-500">Ka-TrabaHO Career Guidance System</p>
          <p className="font-medium">Hindi opisyal ngunit magalang na sumusuporta sa mga kabataang Pilipino na kumuha ng libreng TESDA vocational training.</p>
          <p className="text-[10px] text-slate-350">Platform built using Google Gemini 3.5 AI support and local job insights.</p>
        </div>
      </footer>
    </div>
  );
}
