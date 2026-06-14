import React from "react";
import {
  Target,
  Rocket,
  BookOpen,
  Clock,
  DollarSign,
  Award,
  Sparkles,
  MessageSquare,
  Search,
  Shield,
  Lock,
  Smartphone,
} from "lucide-react";

interface LandingPageProps {
  lang: "fil" | "en";
  setCurrentTab: (tab: string) => void;
}

const SECTION_HEADER = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <h2 className="font-display font-bold text-xl text-slate-900">{title}</h2>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

export default function LandingPage({ lang, setCurrentTab }: LandingPageProps) {
  return (
    <div className="animate-fade-in">
      {/* ========== HERO SECTION ========== */}
      <section className="relative text-center py-10 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <span className="relative inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-blue-100">
          <Target className="h-4 w-4" />
          {lang === "fil" ? "Ang Iyong Landas sa Tagumpay" : "Your Path to Success"}
        </span>

        <h1 className="relative mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
          {lang === "fil" ? "Mula sa Wala, Hanggang Tagumpay" : "From Zero to Hero"}
        </h1>

        <p className="relative mt-4 text-lg text-slate-500 max-w-sm mx-auto leading-relaxed">
          {lang === "fil"
            ? "Tingnan kung paano magbabago ng TESDA ang iyong galing sa trabaho — hakbang-hakbang."
            : "See exactly how TESDA can transform your skills into a career — step by step."}
        </p>

        <button
          onClick={() => setCurrentTab("match")}
          className="relative mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto max-w-xs touch-manipulation"
        >
          <Rocket className="h-5 w-5" />
          {lang === "fil" ? "Simulan ang Iyong Paglalakbay" : "Begin Your Journey"}
        </button>
      </section>

      {/* ========== JOURNEY STEPS SECTION ========== */}
      <section className="px-4 pb-4 animate-fade-in stagger-1" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display font-bold text-xl text-slate-900">
            {lang === "fil" ? "Ang Iyong Paglalakbay" : "Your Journey"}
          </h2>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="relative">
          {[
            {
              num: 1,
              title: lang === "fil" ? "Saan Ka Ngayon?" : "Where Are You Now?",
              desc:
                lang === "fil"
                  ? "Grade 10 grad? ALS completer? Huwag mag-alala — tinatanggap ng TESDA ang lahat. Ibahagi ang iyong kwento."
                  : "Junior high grad? ALS completer? No worries — TESDA accepts all. Share your story.",
              color: "blue",
            },
            {
              num: 2,
              title: lang === "fil" ? "Tuklasin ang Iyong Match" : "Discover Your Match",
              desc:
                lang === "fil"
                  ? "Sinusuri ng AI ang 300+ kurso sa 5 sektor para hanapin ang pinaka-akma sa iyong hilig at demand sa inyong lugar."
                  : "AI scans 300+ courses across 5 sectors to find what fits your interests and local demand.",
              color: "blue",
            },
            {
              num: 3,
              title: lang === "fil" ? "Libreng Pagsasanay" : "Free Training",
              desc:
                lang === "fil"
                  ? "Mag-enroll sa anumang TESDA center. Walang bayad. May ₱160/araw na allowance para sa pamasahe at pagkain."
                  : "Enroll at any TESDA center. Zero tuition. Plus ₱160/day allowance for transport and food.",
              color: "blue",
            },
            {
              num: 4,
              title: lang === "fil" ? "Maging Certified, Makakuha ng Trabaho" : "Get Certified, Get Hired",
              desc:
                lang === "fil"
                  ? "Makuha ang iyong NC II certificate. Sumali sa 95% ng mga graduate na nakakakuha ng trabaho sa loob ng 6 na buwan."
                  : "Earn your NC II certificate. Join the 95% of graduates who land jobs within 6 months.",
              color: "emerald",
            },
          ].map((step, idx) => (
            <div key={step.num} className="flex gap-4">
              {/* Left track */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white z-10 ${
                    step.color === "emerald" ? "bg-emerald-500" : "bg-blue-600"
                  }`}
                >
                  {step.num}
                </div>
                {idx < 3 && (
                  <div className="w-0.5 flex-grow bg-blue-200 min-h-[40px]" />
                )}
              </div>

              {/* Right card */}
              <div
                className={`accent-card accent-${step.color} p-5 mb-3 flex-grow animate-fade-in`}
                style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
              >
                <h4 className="font-display font-bold text-slate-900 mb-1">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== STATS GRID ========== */}
      <section className="px-4 pb-4 animate-fade-in stagger-3" style={{ animationDelay: "0.3s" }}>
        <div className="grid grid-cols-2 gap-3">
          <div className="gradient-stat-card">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="font-display text-3xl font-extrabold text-white">
              300+
            </div>
            <div className="text-sm text-blue-100 font-medium">
              {lang === "fil" ? "Mga Kurso" : "Courses"}
            </div>
          </div>

          <div className="gradient-stat-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-3">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="font-display text-3xl font-extrabold text-white">
              15-30
            </div>
            <div className="text-sm text-emerald-100 font-medium">
              {lang === "fil" ? "Araw ng Pagsasanay" : "Days Training"}
            </div>
          </div>

          <div className="gradient-stat-card" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div className="font-display text-3xl font-extrabold text-white">
              ₱160
            </div>
            <div className="text-sm text-amber-100 font-medium">
              {lang === "fil" ? "Allowance / Araw" : "Daily Allowance"}
            </div>
          </div>

          <div className="gradient-stat-card" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" }}>
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-3">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div className="font-display text-3xl font-extrabold text-white">
              95%
            </div>
            <div className="text-sm text-violet-100 font-medium">
              {lang === "fil" ? "Nakakakuha ng Trabaho" : "Job Placement"}
            </div>
          </div>
        </div>
      </section>

      {/* ========== QUICK ACTIONS SECTION ========== */}
      <section className="px-4 pb-4 animate-fade-in stagger-4" style={{ animationDelay: "0.4s" }}>
        <SECTION_HEADER title={lang === "fil" ? "Magsimula" : "Get Started"} />

        <div className="space-y-3">
          <button
            onClick={() => setCurrentTab("match")}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 touch-manipulation min-h-[56px]"
          >
            <Sparkles className="h-5 w-5" />
            {lang === "fil" ? "AI Course Matching" : "AI Course Matching"}
          </button>

          <button
            onClick={() => setCurrentTab("chat")}
            className="w-full rounded-2xl border-2 border-blue-200 bg-white py-4 text-base font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 touch-manipulation min-h-[56px]"
          >
            <MessageSquare className="h-5 w-5 text-blue-600" />
            {lang === "fil" ? "Tanungin ang AI Counselor" : "Ask AI Counselor"}
          </button>

          <button
            onClick={() => setCurrentTab("explorer")}
            className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 text-base font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 touch-manipulation min-h-[56px]"
          >
            <Search className="h-5 w-5 text-slate-500" />
            {lang === "fil" ? "Tignan ang Lahat ng Kurso" : "Browse All Courses"}
          </button>
        </div>
      </section>

      {/* ========== TRUST BADGES ========== */}
      <section className="px-4 pb-4 animate-fade-in stagger-4" style={{ animationDelay: "0.4s" }}>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
              <Shield className="h-3 w-3 text-blue-600" />
            </div>
            {lang === "fil" ? "Suportado ng Gobyerno" : "Gov't Backed"}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
              <Lock className="h-3 w-3 text-emerald-600" />
            </div>
            {lang === "fil" ? "Libre Forever" : "Free Forever"}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center">
              <Smartphone className="h-3 w-3 text-amber-600" />
            </div>
            {lang === "fil" ? "Mobile Friendly" : "Mobile Friendly"}
          </div>
        </div>
      </section>
    </div>
  );
}
