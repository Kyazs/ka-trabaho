import React, { useState } from "react";
import { Sparkles, BarChart, BookOpen, Briefcase, MessageSquare, HelpCircle, GraduationCap, Menu, X, Home } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: "fil" | "en";
  setLang: (lang: "fil" | "en") => void;
  hasProfile: boolean;
}

export default function Navbar({ currentTab, setCurrentTab, lang, setLang, hasProfile }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div 
          onClick={() => setCurrentTab("landing")}
          className="flex cursor-pointer items-center space-x-3 group"
          id="nav-brand"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 font-bold text-white shadow-lg shadow-blue-200 group-hover:shadow-xl group-hover:scale-105 transition-all">
            <GraduationCap className="h-7 w-7" id="brand-icon" />
          </div>
          <div>
            <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Ka-Traba<span className="text-blue-600">HO</span>
            </span>
            <span className="ml-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm border border-blue-100">
              AI Support
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-2" id="nav-tabs-desktop">
          <button
            id="tab-landing-btn"
            onClick={() => setCurrentTab("landing")}
            className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              currentTab === "landing"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-100"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Home className="h-5 w-5" />
            <span>{lang === "fil" ? "Simula" : "Home"}</span>
          </button>

          <button
            id="tab-match-btn"
            onClick={() => setCurrentTab("match")}
            className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              currentTab === "match"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-100"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span>{lang === "fil" ? "AI Matcher" : "AI Matcher"}</span>
          </button>

          <button
            id="tab-explorer-btn"
            onClick={() => setCurrentTab("explorer")}
            className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              currentTab === "explorer"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-100"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span>{lang === "fil" ? "Mga Kurso" : "Courses"}</span>
          </button>

          <button
            id="tab-jobs-btn"
            onClick={() => setCurrentTab("jobs")}
            className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              currentTab === "jobs"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-100"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span>{lang === "fil" ? "Mga Trabaho" : "Jobs"}</span>
          </button>

          <button
            id="tab-chat-btn"
            onClick={() => setCurrentTab("chat")}
            className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              currentTab === "chat"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-100"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>{lang === "fil" ? "Chat" : "Chat"}</span>
          </button>

          <button
            id="tab-faq-btn"
            onClick={() => setCurrentTab("faq")}
            className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              currentTab === "faq"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md border border-blue-100"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <HelpCircle className="h-5 w-5" />
            <span>FAQ</span>
          </button>
        </nav>

        {/* Global Controls */}
        <div className="flex items-center space-x-3" id="nav-info-controls">
          {/* Language Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200" id="lang-switch-container">
            <button
              id="lang-fil-btn"
              onClick={() => setLang("fil")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                lang === "fil"
                  ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Taglish
            </button>
            <button
              id="lang-en-btn"
              onClick={() => setLang("en")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                lang === "en"
                  ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => handleTabClick("landing")}
              className={`w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                currentTab === "landing"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Home className="h-5 w-5" />
              <span>{lang === "fil" ? "Simula" : "Home"}</span>
            </button>

            <button
              onClick={() => handleTabClick("match")}
              className={`w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                currentTab === "match"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="h-5 w-5" />
              <span>{lang === "fil" ? "AI Matcher" : "AI Matcher"}</span>
            </button>
            <button
              onClick={() => handleTabClick("explorer")}
              className={`w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                currentTab === "explorer"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>{lang === "fil" ? "Mga Kurso" : "Courses"}</span>
            </button>
            <button
              onClick={() => handleTabClick("jobs")}
              className={`w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                currentTab === "jobs"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span>{lang === "fil" ? "Mga Trabaho" : "Jobs"}</span>
            </button>
            <button
              onClick={() => handleTabClick("chat")}
              className={`w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                currentTab === "chat"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>{lang === "fil" ? "Chat" : "Chat"}</span>
            </button>
            <button
              onClick={() => handleTabClick("faq")}
              className={`w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                currentTab === "faq"
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <HelpCircle className="h-5 w-5" />
              <span>FAQ</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
