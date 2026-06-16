import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Cpu,
  ShieldCheck,
  Coins,
  GraduationCap,
  MapPin,
  UserCircle,
  Brain,
  Calendar,
  Award,
  Briefcase,
  MessageSquare,
  Search,
  Zap,
} from "lucide-react";

interface LandingPageProps {
  lang: "fil" | "en";
}

const copy = {
  heroEyebrow: { fil: "Para sa mga Out-of-School Youth", en: "For Out-of-School Youth" },
  heroTitleLine1: { fil: "Ang tamang", en: "The right" },
  heroTitleHighlight: { fil: "trabaho", en: "job" },
  heroTitleLine2: { fil: "para sa", en: "for" },
  heroTitleAccent: { fil: "iyo", en: "you" },
  heroTitleLine3: { fil: "ay nasa TESDA.", en: "is at TESDA." },
  heroSub: {
    fil: "Hindi kailangan ng diploma para magsimula. Sabihin mo ang iyong interes — hahanapin ng AI ang tamang kurso at trabaho para sa 'yo, libre.",
    en: "No diploma needed to start. Tell us your interests — AI will find the right course and job for you, for free.",
  },
  ctaPrimary: { fil: "Simulan ang Assessment", en: "Start Assessment" },
  ctaSecondary: { fil: "Tingnan ang mga Kurso", en: "Browse Courses" },
  qCardLabel: { fil: "AI Assessment — Aktibo", en: "AI Assessment — Active" },
  qCardQuestion: { fil: "Ano ang gusto mong gawin sa buhay?", en: "What do you want to do in life?" },
  qCardHint: { fil: "Piliin ang lahat ng angkop sa iyo:", en: "Select all that apply to you:" },
  qCardTopMatch: { fil: "Top match para sa iyo", en: "Top match for you" },
  qCardMatchLocation: { fil: "Dagupan, Pangasinan · 15-30 araw · Libre", en: "Dagupan, Pangasinan · 15-30 days · Free" },
  qCardMatchBadge: { fil: "97% Match", en: "97% Match" },
  chips: [
    { fil: "Mag-abroad", en: "Work abroad" },
    { fil: "Magtayo ng negosyo", en: "Start a business" },
    { fil: "Magtrabaho agad", en: "Work immediately" },
    { fil: "Mag-aral pa", en: "Study more" },
    { fil: "Tulungan ang pamilya", en: "Help family" },
    { fil: "Mag-earn online", en: "Earn online" },
  ],
  trustItems: [
    { fil: "Opisyal na programa ng TESDA", en: "Official TESDA program", icon: ShieldCheck, tone: "blue" },
    { fil: "₱160/araw na allowance", en: "₱160/day allowance", icon: Coins, tone: "gold" },
    { fil: "300+ kurso, zero tuition", en: "300+ courses, zero tuition", icon: GraduationCap, tone: "green" },
    { fil: "Nakabatay sa demand ng inyong lugar", en: "Based on your local demand", icon: MapPin, tone: "blue" },
  ],
  howEyebrow: { fil: "Paano Gumagana", en: "How It Works" },
  howTitle: { fil: "Apat na hakbang patungo sa trabaho", en: "Four steps toward a job" },
  howSub: {
    fil: "Dinisenyo para sa mga estudyante, high school grad, at ALS completer na gustong magsimula agad.",
    en: "Designed for students, high school grads, and ALS completers who want to start right away.",
  },
  howSteps: [
    {
      icon: UserCircle,
      title: { fil: "Ibahagi ang iyong kwento", en: "Share your story" },
      desc: { fil: "Sabihin ang iyong interes, kasanayan, at layunin sa buhay. Walang dapat ipahiya.", en: "Share your interests, skills, and life goals. No shame in starting." },
      tone: "blue",
    },
    {
      icon: Brain,
      title: { fil: "Hanapin ng AI ang tamang kurso", en: "AI finds the right course" },
      desc: { fil: "Sinusuri ng AI ang 300+ TESDA courses at lokal na job demand para sa iyong lugar.", en: "AI scans 300+ TESDA courses and local job demand for your area." },
      tone: "blue",
    },
    {
      icon: Calendar,
      title: { fil: "Mag-enroll, libre", en: "Enroll for free" },
      desc: { fil: "Gabay sa pagpunta sa pinakamalapit na TESDA center. Walang bayad, may allowance pa.", en: "Guidance to the nearest TESDA center. No fees, plus an allowance." },
      tone: "blue",
    },
    {
      icon: Award,
      title: { fil: "Makakuha ng sertipiko at trabaho", en: "Get certified and hired" },
      desc: { fil: "NC II certificate ang iyong tiket sa trabaho — lokal o abroad — sa loob ng 6 na buwan.", en: "Your NC II certificate is your ticket to a job — local or abroad — within 6 months." },
      tone: "green",
    },
  ],
  featuresEyebrow: { fil: "Mga Feature", en: "Features" },
  featuresTitle: { fil: "Lahat ng kailangan mo, nasa iisang lugar", en: "Everything you need in one place" },
  features: [
    {
      icon: Sparkles,
      title: { fil: "AI Skills Assessment", en: "AI Skills Assessment" },
      desc: {
        fil: "Hindi ka basta binabagsak ng listahan ng kurso. Tinatanong ka muna tungkol sa iyong interes, sitwasyon, at layunin — tapos mag-aanalisa ang AI ng tamang ruta para sa iyo batay sa tunay na trabaho sa inyong probinsya.",
        en: "You are not just given a list of courses. We first ask about your interests, situation, and goals — then AI analyzes the best route for you based on real jobs in your province.",
      },
      tag: { fil: "Nakabatay sa lokal na job data", en: "Based on local job data" },
      tagIcon: MapPin,
      tone: "blue",
      big: true,
    },
    {
      icon: Briefcase,
      title: { fil: "Job Recommendation", en: "Job Recommendation" },
      desc: {
        fil: "Makita kung anong trabaho ang magbubukas pagkatapos ng bawat kurso — kasama ang average na sahod at demand sa inyong lugar.",
        en: "See what jobs open up after each course — including average salary and demand in your area.",
      },
      tone: "gold",
    },
    {
      icon: MessageSquare,
      title: { fil: "AI Counselor Chatbot", en: "AI Counselor Chatbot" },
      desc: {
        fil: "May tanong ka tungkol sa enrollment, requirements, o scholarship? Ang AI chatbot ay laging sasagot sa iyo, 24/7, sa Filipino.",
        en: "Have questions about enrollment, requirements, or scholarships? The AI chatbot answers you 24/7 in Filipino.",
      },
      tone: "purple",
    },
    {
      icon: Coins,
      title: { fil: "Scholarship & Allowance Guide", en: "Scholarship & Allowance Guide" },
      desc: {
        fil: "Alamin ang lahat ng available na subsidyo — TWSP, STEP, at iba pa — at kung paano mag-apply, hakbang-hakbang.",
        en: "Learn about all available subsidies — TWSP, STEP, and more — and how to apply step by step.",
      },
      tone: "green",
    },
    {
      icon: Search,
      title: { fil: "Course Explorer", en: "Course Explorer" },
      desc: {
        fil: "I-browse ang buong listahan ng TESDA courses. I-filter ayon sa sektor, lokasyon, o haba ng training.",
        en: "Browse the full TESDA course list. Filter by sector, location, or training length.",
      },
      tone: "blue",
    },
  ],
  statsEyebrow: { fil: "Mga Numero", en: "The Numbers" },
  statsTitle: { fil: "Napatunayan na ng TESDA", en: "Proven by TESDA" },
  statsSub: {
    fil: "Ang mga datos na ito ang dahilan kung bakit TESDA ang pinaka-abot-kayang landas sa trabaho para sa mga kabataan.",
    en: "These figures are why TESDA is the most accessible path to work for young people.",
  },
  stats: [
    { num: "300", suffix: "+", label: { fil: "Mga kurso sa 5 sektor", en: "Courses across 5 sectors" } },
    { num: "₱160", suffix: "", label: { fil: "Daily allowance sa training", en: "Daily training allowance" } },
    { num: "95", suffix: "%", label: { fil: "Job placement rate", en: "Job placement rate" } },
    { num: "15", suffix: "–30", label: { fil: "Araw lang ang training", en: "Days of training" } },
  ],
  ctaBadge: { fil: "Libre. Walang sign-up required.", en: "Free. No sign-up required." },
  ctaTitle: { fil: "Handa ka na bang magsimula?", en: "Ready to start?" },
  ctaSub: {
    fil: "Ilang tanong lang. Hindi kailangan ng diploma, trabaho, o kahit anong bayad para makita ang iyong tamang landas.",
    en: "Just a few questions. No diploma, job, or payment needed to see your right path.",
  },
  ctaButton: { fil: "Gawin ang Assessment — Libre", en: "Take the Assessment — Free" },
};

const TONE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-kt-blue-light", text: "text-kt-blue", border: "border-kt-blue-soft" },
  gold: { bg: "bg-kt-gold-light", text: "text-kt-gold-ink", border: "border-kt-gold" },
  green: { bg: "bg-kt-success-light", text: "text-kt-success-ink", border: "border-kt-success-border" },
  purple: { bg: "bg-kt-chat-purple-light", text: "text-kt-chat-purple", border: "border-kt-chat-purple-border" },
};

export default function LandingPage({ lang }: LandingPageProps) {
  const text = (obj: { fil: string; en: string }) => obj[lang];

  return (
    <div className="bg-kt-bg text-kt-near-black font-sans">
      {/* Hidden accessibility heading for the page mockup */}
      <h2 className="sr-only">
        {lang === "fil"
          ? "ka-trabaHO landing page — desktop view na nagpapakita ng hero, how it works, features, stats, at CTA sections"
          : "ka-trabaHO landing page — desktop view showing hero, how it works, features, stats, and CTA sections"}
      </h2>

      {/* ========== HERO ========== */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Hero left */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2.5 text-sm font-semibold text-kt-blue mb-5 md:mb-6">
              <span className="w-5 h-0.5 bg-kt-gold rounded-full" />
              {text(copy.heroEyebrow)}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-black leading-[1.08] tracking-[-1.5px] text-kt-near-black mb-5 md:mb-6">
              {text(copy.heroTitleLine1)}
              <br />
              <span className="relative inline-block">
                {text(copy.heroTitleHighlight)}
                <span className="absolute left-0 -bottom-1 w-full h-1 bg-kt-gold rounded-full" />
              </span>{" "}
              {text(copy.heroTitleLine2)}
              <br />
              <span className="text-kt-blue">{text(copy.heroTitleAccent)}</span>{" "}
              {text(copy.heroTitleLine3)}
            </h1>

            <p className="text-base md:text-[17px] text-kt-slate leading-[1.7] mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
              {text(copy.heroSub)}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 md:gap-4">
              <Link
                to="/match"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-kt-blue hover:bg-kt-blue-mid text-white font-display font-bold text-base px-6 md:px-7 py-3.5 md:py-4 rounded-[10px] transition-all hover:-translate-y-0.5 active:scale-95 touch-manipulation"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                {text(copy.ctaPrimary)}
              </Link>
              <Link
                to="/explorer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-kt-blue font-display font-semibold text-[15px] px-5 md:px-6 py-3.5 md:py-4 rounded-[10px] border-[1.5px] border-kt-blue-soft hover:bg-kt-blue-light transition-all touch-manipulation"
              >
                {text(copy.ctaSecondary)}
              </Link>
            </div>
          </div>

          {/* Hero right — question card */}
          <div className="relative">
            <div className="bg-white border border-kt-border rounded-[20px] p-5 md:p-7">
              <div className="text-xs font-semibold text-kt-slate mb-4 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-kt-online" />
                {text(copy.qCardLabel)}
              </div>

              <div className="font-display text-lg md:text-[20px] font-extrabold text-kt-near-black mb-5 md:mb-6 leading-[1.3]">
                {text(copy.qCardQuestion)}
                <span className="inline-block w-0.5 h-5 bg-kt-blue rounded-full align-middle ml-0.5 animate-blink" />
              </div>

              <p className="text-[13px] text-kt-slate mb-3">
                {text(copy.qCardHint)}
              </p>

              <div className="flex flex-wrap gap-2 mb-5" aria-hidden="true">
                {copy.chips.map((chip, idx) => (
                  <span
                    key={idx}
                    className={`font-display text-[13px] font-semibold px-3.5 py-1.5 rounded-full border cursor-default transition-colors ${
                      idx === 1 || idx === 5
                        ? "bg-kt-gold-light text-kt-gold-ink border-kt-gold"
                        : "bg-kt-blue-light text-kt-blue border-kt-blue-soft"
                    }`}
                  >
                    {text(chip)}
                  </span>
                ))}
              </div>

              <hr className="border-t border-kt-border my-4" />

              <p className="text-xs font-semibold text-kt-slate mb-2.5">
                {text(copy.qCardTopMatch)}
              </p>

              <div className="flex items-center gap-2.5 p-3 bg-kt-blue-light rounded-[10px]">
                <div className="w-9 h-9 rounded-lg bg-kt-blue flex items-center justify-center text-white shrink-0">
                  <Cpu className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <strong className="block font-display font-bold text-sm text-kt-blue truncate" title="Computer Systems Servicing NC II">
                    Computer Systems Servicing NC II
                  </strong>
                  <span className="block text-xs text-kt-slate truncate" title={text(copy.qCardMatchLocation)}>
                    {text(copy.qCardMatchLocation)}
                  </span>
                </div>
                <div className="shrink-0 bg-kt-blue text-white font-display text-xs font-bold px-2.5 py-1 rounded-full">
                  {text(copy.qCardMatchBadge)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TRUST STRIP ========== */}
      <div className="border-y border-kt-border bg-white py-4 md:py-5">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10">
            {copy.trustItems.map((item, idx) => {
              const Icon = item.icon;
              const tone = TONE_STYLES[item.tone];
              return (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-kt-slate">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center ${tone.bg} ${tone.text}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    {text({ fil: item.fil, en: item.en })}
                  </div>
                  {idx < copy.trustItems.length - 1 && (
                    <span className="hidden md:inline text-kt-border">|</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========== HOW IT WORKS + FEATURES + STATS + CTA ========== */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* How it works */}
        <section className="mb-12 md:mb-16 lg:mb-20">
          <h2 className="font-display text-3xl md:text-[36px] font-extrabold tracking-[-0.8px] text-kt-near-black mb-3 leading-[1.2]">
            {text(copy.howTitle)}
          </h2>
          <p className="text-base text-kt-slate leading-[1.7] max-w-lg">
            {text(copy.howSub)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-8 md:mt-12">
            {copy.howSteps.map((step, idx) => {
              const Icon = step.icon;
              const isGreen = step.tone === "green";
              return (
                <div
                  key={idx}
                  className="relative bg-white border border-kt-border rounded-2xl p-5 md:p-6 overflow-hidden"
                >
                  <span className="absolute -top-2.5 right-3 font-display text-[48px] md:text-[72px] font-black text-kt-blue-light leading-none z-0 select-none" aria-hidden="true">
                    {idx + 1}
                  </span>
                  <div
                    className={`relative z-10 w-11 h-11 rounded-[10px] flex items-center justify-center text-white mb-4 ${
                      isGreen ? "bg-kt-success" : "bg-kt-blue"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h4 className="relative z-10 font-display font-bold text-[15px] text-kt-near-black mb-2">
                    {text(step.title)}
                  </h4>
                  <p className="relative z-10 text-[13px] text-kt-slate leading-[1.65]">
                    {text(step.desc)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features */}
        <section className="mb-12 md:mb-16 lg:mb-20">
          <h2 className="font-display text-3xl md:text-[36px] font-extrabold tracking-[-0.8px] text-kt-near-black mb-8 md:mb-12 leading-[1.2]">
            {text(copy.featuresTitle)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {copy.features.map((feature, idx) => {
              const Icon = feature.icon;
              const TagIcon = feature.tagIcon;
              const tone = TONE_STYLES[feature.tone];
              return (
                <div
                  key={idx}
                  className={`bg-white border border-kt-border rounded-2xl p-5 md:p-7 flex flex-col md:flex-row gap-4 md:gap-5 items-start ${
                    feature.big ? "md:col-span-2 md:items-center" : ""
                  }`}
                >
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl shrink-0 ${tone.bg} ${tone.text}`}
                  >
                    <Icon className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-kt-near-black mb-1.5">
                      {text(feature.title)}
                    </h3>
                    <p className="text-sm text-kt-slate leading-[1.65]">
                      {text(feature.desc)}
                    </p>
                    {feature.tag && TagIcon && (
                      <div className="inline-flex items-center gap-1.5 mt-3 bg-kt-blue-light text-kt-blue text-xs font-bold px-2.5 py-1 rounded-full">
                        <TagIcon className="h-3 w-3" aria-hidden="true" />
                        {text(feature.tag)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-kt-blue rounded-3xl p-6 md:p-10 lg:p-12 mb-12 md:mb-16 lg:mb-20">
          <h2 className="font-display text-3xl md:text-[36px] font-extrabold tracking-[-0.8px] text-white mb-3 leading-[1.2]">
            {text(copy.statsTitle)}
          </h2>
          <p className="text-base text-white/70 leading-[1.7] max-w-lg mb-8 md:mb-10">
            {text(copy.statsSub)}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 bg-white/10 rounded-xl overflow-hidden">
            {copy.stats.map((stat, idx) => (
              <div key={idx} className="bg-white/[0.06] p-5 md:p-6 text-center">
                <div className="font-display text-3xl md:text-[40px] font-black text-white tracking-[-1px] leading-none">
                  {stat.num.includes("₱") ? (
                    <>
                      <span className="text-kt-gold">₱</span>
                      {stat.num.replace("₱", "")}
                    </>
                  ) : stat.num === "15" ? (
                    <>
                      15<span className="text-kt-gold">–30</span>
                    </>
                  ) : (
                    <>
                      {stat.num}
                      <span className="text-kt-gold">{stat.suffix}</span>
                    </>
                  )}
                </div>
                <div className="text-[13px] text-white/60 mt-1.5 font-medium">
                  {text(stat.label)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white border border-kt-border rounded-3xl p-6 md:p-10 lg:p-14 text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 bg-kt-gold text-kt-near-black text-xs font-extrabold px-4 py-1.5 rounded-full mb-5 tracking-[0.03em]">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            {text(copy.ctaBadge)}
          </div>
          <h2 className="font-display text-3xl md:text-[36px] font-black text-kt-near-black tracking-[-1px] mb-3">
            {text(copy.ctaTitle)}
          </h2>
          <p className="text-base md:text-[17px] text-kt-slate max-w-lg mx-auto mb-6 md:mb-8">
            {text(copy.ctaSub)}
          </p>
          <Link
            to="/match"
            className="inline-flex items-center justify-center gap-2 bg-kt-blue hover:bg-kt-blue-mid text-white font-display font-bold text-base md:text-[17px] px-7 md:px-9 py-3.5 md:py-4 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 touch-manipulation"
          >
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            {text(copy.ctaButton)}
          </Link>
        </section>
      </div>

</div>
  );
}
