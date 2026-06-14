import React from "react";
import {
  Home,
  Sparkles,
  BookOpen,
  Briefcase,
  MessageSquare,
} from "lucide-react";

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: "fil" | "en";
}

const tabs = [
  { id: "landing", icon: Home, label: "Home", labelFil: "Simula" },
  { id: "match", icon: Sparkles, label: "AI Match", labelFil: "AI Match" },
  { id: "explorer", icon: BookOpen, label: "Courses", labelFil: "Kurso" },
  { id: "jobs", icon: Briefcase, label: "Jobs", labelFil: "Trabaho" },
  { id: "chat", icon: MessageSquare, label: "Chat", labelFil: "Chat" },
];

export default function BottomNav({ currentTab, setCurrentTab, lang }: BottomNavProps) {
  return (
    <nav
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-bottom md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-all touch-manipulation active-tap ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}
              role="tab"
              aria-selected={isActive}
              aria-label={lang === "fil" ? tab.labelFil : tab.label}
            >
              <div className={`relative ${isActive ? "-mt-1" : ""}`}>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full" />
                )}
                <Icon
                  className="h-6 w-6 transition-all"
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className="text-[10px] font-semibold leading-none">
                {lang === "fil" ? tab.labelFil : tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
