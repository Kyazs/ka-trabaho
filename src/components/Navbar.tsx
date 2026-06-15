import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Briefcase,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  Home,
  MoreVertical,
  Globe,
} from "lucide-react";

interface NavbarProps {
  lang: "fil" | "en";
  setLang: (lang: "fil" | "en") => void;
}

export default function Navbar({ lang, setLang }: NavbarProps) {
  const location = useLocation();
  const currentTab = location.pathname === "/" ? "landing" : location.pathname.slice(1);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overflowOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOverflowOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOverflowOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [overflowOpen]);

  const tabPathMap: Record<string, string> = {
    "landing": "/",
    "match": "/match",
    "explorer": "/explorer",
    "jobs": "/jobs",
    "chat": "/chat",
    "faq": "/faq"
  };

  const desktopTabs = [
    { id: "landing", label: lang === "fil" ? "Simula" : "Home", icon: Home },
    { id: "match", label: "AI Matcher", icon: Sparkles },
    { id: "explorer", label: lang === "fil" ? "Mga Kurso" : "Courses", icon: BookOpen },
    { id: "jobs", label: lang === "fil" ? "Mga Trabaho" : "Jobs", icon: Briefcase },
    { id: "chat", label: "Chat", icon: MessageSquare },
  ];

  return (
    <>
      {/* === Top Header === */}
      <header id="app-header" className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm safe-area-top">
        <div className="mx-auto flex h-12 md:h-16 max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            id="nav-brand"
          >
            <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-[#0F3D91] font-bold text-white shadow-md shadow-[#E8F0FE] group-hover:shadow-lg group-hover:scale-105 transition-all">
              <GraduationCap className="h-5 w-5 md:h-6 md:w-6" id="brand-icon" />
            </div>
            <span className="font-display text-sm md:text-xl font-extrabold tracking-tight text-[#1A1A2E]">
              Ka-Traba<span className="text-[#FCD116]">HO</span>
            </span>
          </Link>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1" id="nav-tabs-desktop">
            {desktopTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  to={tabPathMap[tab.id] || "/"}
                  id={`tab-${tab.id}-btn`}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#E8F0FE] text-[#0F3D91] shadow-sm border border-[#d4e3ff]"
                      : "text-[#6B7280] hover:bg-[#F8F9FC] hover:text-[#1A1A2E]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language Toggle - compact on mobile */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200" aria-label="Switch language">
               <button
                  onClick={() => setLang("fil")}
                  aria-pressed={lang === "fil"}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                   lang === "fil"
                     ? "bg-white text-[#1A1A2E] shadow-sm border border-[#e5e8ef]"
                     : "text-[#6B7280] hover:text-[#1A1A2E]"
                 }`}
               >
                 TL
               </button>
               <button
                  onClick={() => setLang("en")}
                  aria-pressed={lang === "en"}
                 className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                   lang === "en"
                     ? "bg-white text-[#1A1A2E] shadow-sm border border-[#e5e8ef]"
                     : "text-[#6B7280] hover:text-[#1A1A2E]"
                 }`}
               >
                 EN
               </button>
             </div>

            {/* Overflow menu (mobile + desktop for FAQ) */}
            <div className="relative">
              <button
                onClick={() => setOverflowOpen(!overflowOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all"
                aria-label="More options"
                aria-expanded={overflowOpen}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {overflowOpen && (
                <div ref={menuRef} role="menu" className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-50">
                  <Link
                    to="/faq"
                    role="menuitem"
                    onClick={() => setOverflowOpen(false)}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${
                      currentTab === "faq"
                        ? "text-[#0F3D91] bg-[#E8F0FE]"
                        : "text-[#6B7280] hover:bg-[#F8F9FC]"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4" />
                    FAQ
                  </Link>
                  <a
                    role="menuitem"
                    href="https://www.tesda.gov.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    <Globe className="h-4 w-4" />
                    TESDA Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
