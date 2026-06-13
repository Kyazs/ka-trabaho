import React from "react";
import { Sparkles, BarChart, BookOpen, Briefcase, MessageSquare, HelpCircle, GraduationCap } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: "fil" | "en";
  setLang: (lang: "fil" | "en") => void;
  hasProfile: boolean;
}

export default function Navbar({ currentTab, setCurrentTab, lang, setLang, hasProfile }: NavbarProps) {
  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6lg:px-8">
        
        {/* Logo and Brand */}
        <div 
          onClick={() => setCurrentTab("match")}
          className="flex cursor-pointer items-center space-x-2"
          id="nav-brand"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-200">
            <GraduationCap className="h-6 w-6" id="brand-icon" />
          </div>
          <div>
            <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              Ka-Traba<span className="text-blue-600">HO</span>
            </span>
            <span className="ml-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 shadow-sm">
              AI Support
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1" id="nav-tabs-desktop">
          <button
            id="tab-match-btn"
            onClick={() => setCurrentTab("match")}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              currentTab === "match"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{lang === "fil" ? "AI Job & TESDA Matcher" : "AI Matcher & Assessment"}</span>
          </button>

          <button
            id="tab-explorer-btn"
            onClick={() => setCurrentTab("explorer")}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              currentTab === "explorer"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>{lang === "fil" ? "Sektor at Kurso" : "Explore Courses"}</span>
          </button>

          <button
            id="tab-jobs-btn"
            onClick={() => setCurrentTab("jobs")}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              currentTab === "jobs"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>{lang === "fil" ? "Mga Trabaho" : "Job Market"}</span>
          </button>

          <button
            id="tab-chat-btn"
            onClick={() => setCurrentTab("chat")}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              currentTab === "chat"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{lang === "fil" ? "Chat kay Ka-TrabaHO" : "AI Chat Counselor"}</span>
          </button>

          <button
            id="tab-faq-btn"
            onClick={() => setCurrentTab("faq")}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              currentTab === "faq"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>FAQ Guide</span>
          </button>
        </nav>

        {/* Global Controls */}
        <div className="flex items-center space-x-3" id="nav-info-controls">
          {/* Language Toggle */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5" id="lang-switch-container">
            <button
              id="lang-fil-btn"
              onClick={() => setLang("fil")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                lang === "fil"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Taglish
            </button>
            <button
              id="lang-en-btn"
              onClick={() => setLang("en")}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                lang === "en"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              English
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
