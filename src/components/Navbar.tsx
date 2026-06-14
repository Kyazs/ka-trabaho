import React, { useState } from "react";
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
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: "fil" | "en";
  setLang: (lang: "fil" | "en") => void;
}

export default function Navbar({ currentTab, setCurrentTab, lang, setLang }: NavbarProps) {
  const [overflowOpen, setOverflowOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    setOverflowOpen(false);
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
          <div
            onClick={() => setCurrentTab("landing")}
            className="flex cursor-pointer items-center gap-2 group"
            id="nav-brand"
          >
            <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 font-bold text-white shadow-md shadow-blue-200 group-hover:shadow-lg group-hover:scale-105 transition-all">
              <GraduationCap className="h-5 w-5 md:h-6 md:w-6" id="brand-icon" />
            </div>
            <span className="font-display text-sm md:text-xl font-extrabold tracking-tight text-slate-900">
              Ka-Traba<span className="text-blue-600">HO</span>
            </span>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1" id="nav-tabs-desktop">
            {desktopTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}-btn`}
                  onClick={() => setCurrentTab(tab.id)}
                  aria-current={currentTab === tab.id ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    currentTab === tab.id
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Language Toggle - compact on mobile */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setLang("fil")}
                className={`rounded-md px-2 py-1 text-xs font-bold transition-all ${
                  lang === "fil"
                    ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                TL
              </button>
              <button
                onClick={() => setLang("en")}
                className={`rounded-md px-2 py-1 text-xs font-bold transition-all ${
                  lang === "en"
                    ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
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
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {overflowOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-50">
                  <button
                    onClick={() => handleTabClick("faq")}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${
                      currentTab === "faq"
                        ? "text-blue-700 bg-blue-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <HelpCircle className="h-4 w-4" />
                    FAQ
                  </button>
                  <a
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
