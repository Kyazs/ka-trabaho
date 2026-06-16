import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Sparkles,
  BookOpen,
  Briefcase,
  MessageSquare,
} from "lucide-react";

interface BottomNavProps {
  lang: "fil" | "en";
}

const tabs = [
  { id: "landing", path: "/", icon: Home, label: "Home", labelFil: "Simula" },
  { id: "match", path: "/match", icon: Sparkles, label: "AI Match", labelFil: "AI Match" },
  { id: "explorer", path: "/explorer", icon: BookOpen, label: "Courses", labelFil: "Kurso" },
  { id: "jobs", path: "/jobs", icon: Briefcase, label: "Jobs", labelFil: "Trabaho" },
  { id: "chat", path: "/chat", icon: MessageSquare, label: "Chat", labelFil: "Chat" },
];

export default function BottomNav({ lang }: BottomNavProps) {
  const location = useLocation();
  const currentTab = location.pathname === "/" ? "landing" : location.pathname.slice(1);

  return (
    <nav
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-kt-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-bottom md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-all touch-manipulation active-tap ${
                isActive ? "text-kt-blue" : "text-kt-slate"
              }`}
              aria-current={isActive ? "page" : undefined}
              aria-label={lang === "fil" ? tab.labelFil : tab.label}
            >
              <div className={`relative ${isActive ? "-mt-1" : ""}`}>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-kt-blue rounded-full" />
                )}
                <Icon
                  className="h-6 w-6 transition-all"
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className="text-xs font-semibold leading-none">
                {lang === "fil" ? tab.labelFil : tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
