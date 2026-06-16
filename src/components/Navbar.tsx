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
  Trash2,
} from "lucide-react";

interface NavbarProps {
  lang: "fil" | "en";
  setLang: (lang: "fil" | "en") => void;
  onClearData?: () => void;
  confirmClearData?: boolean;
  onConfirmClearData?: (v: boolean) => void;
}

export default function Navbar({ lang, setLang, onClearData, confirmClearData, onConfirmClearData }: NavbarProps) {
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
        return;
      }
      if (event.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    const firstFocusable = menuRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])');
    firstFocusable?.focus();

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
      <header id="app-header" className="sticky top-0 z-50 w-full border-b border-kt-border/80 bg-white/90 backdrop-blur-xl shadow-sm safe-area-top">
        <div className="mx-auto flex h-12 md:h-16 max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            id="nav-brand"
          >
            <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-kt-blue font-bold text-white group-hover:shadow-lg group-hover:scale-105 transition-all">
              <GraduationCap className="h-5 w-5 md:h-6 md:w-6" id="brand-icon" />
            </div>
            <span className="font-display text-sm md:text-xl font-extrabold tracking-tight text-kt-near-black">
              Ka-Traba<span className="text-kt-gold">HO</span>
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
                      ? "bg-kt-blue-light text-kt-blue border border-kt-blue-soft"
                      : "text-kt-slate hover:bg-kt-bg hover:text-kt-near-black"
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
            <div className="inline-flex rounded-lg bg-kt-bg p-0.5 border border-kt-border" aria-label="Switch language">
               <button
                  onClick={() => setLang("fil")}
                  aria-pressed={lang === "fil"}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                   lang === "fil"
                     ? "bg-white text-kt-near-black border border-kt-border"
                     : "text-kt-slate hover:text-kt-near-black"
                 }`}
               >
                 FIL
               </button>
               <button
                   onClick={() => setLang("en")}
                   aria-pressed={lang === "en"}
                   className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                    lang === "en"
                      ? "bg-white text-kt-near-black border border-kt-border"
                     : "text-kt-slate hover:text-kt-near-black"
                 }`}
               >
                 EN
               </button>
             </div>

            {/* Overflow menu (mobile + desktop for FAQ) */}
            <div className="relative">
              <button
                onClick={() => setOverflowOpen(!overflowOpen)}
                className="p-2 rounded-lg hover:bg-kt-bg text-kt-slate transition-all"
                aria-label="More options"
                aria-expanded={overflowOpen}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {overflowOpen && (
                <div ref={menuRef} role="menu" className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-kt-border shadow-xl py-1 z-50">
                  <Link
                    to="/faq"
                    role="menuitem"
                    onClick={() => setOverflowOpen(false)}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${
                      currentTab === "faq"
                        ? "text-kt-blue bg-kt-blue-light"
                        : "text-kt-slate hover:bg-kt-bg"
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
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-kt-slate hover:bg-kt-blue-light transition-all"
                  >
                    <Globe className="h-4 w-4" />
                    TESDA Website
                  </a>
                  <div className="border-t border-kt-border my-1" />
                  {!confirmClearData ? (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => onConfirmClearData?.(true)}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-kt-danger hover:bg-kt-danger-light transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      {lang === "fil" ? "Burahin ang Data Ko" : "Clear My Data"}
                    </button>
                  ) : (
                    <div className="px-4 py-3 space-y-2">
                      <p className="text-xs font-bold text-kt-danger-ink">
                        {lang === "fil" ? "Burahin lahat ng personal na data sa device na ito?" : "Delete all personal data on this device?"}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onClearData?.();
                            setOverflowOpen(false);
                          }}
                          className="rounded-lg bg-kt-danger text-white text-xs font-bold px-3 py-1.5 hover:bg-kt-danger/90 transition-all"
                        >
                          {lang === "fil" ? "Oo, burahin" : "Yes, clear"}
                        </button>
                        <button
                          type="button"
                          onClick={() => onConfirmClearData?.(false)}
                          className="rounded-lg bg-white text-kt-near-black text-xs font-bold px-3 py-1.5 border border-kt-border hover:bg-kt-bg transition-all"
                        >
                          {lang === "fil" ? "Huwag na" : "Cancel"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
