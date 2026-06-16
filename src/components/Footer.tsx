import { Link } from "react-router-dom";
import { Github, Globe, Linkedin } from "lucide-react";

interface FooterProps {
  lang: "fil" | "en";
}

const COPY = {
  tagline: {
    fil: "Ginawa para sa mga kabataang Pilipino — AI-powered na gabay sa TESDA courses at trabaho, libre.",
    en: "Made for Filipino youth — AI-powered guide to TESDA courses and jobs, free.",
  },
  copyright: {
    fil: "© 2025 Ka-TrabaHO · Sinusuportahan ng TESDA data",
    en: "© 2025 Ka-TrabaHO · Supported by TESDA data",
  },
  navLabel: { fil: "Mag-navigate", en: "Navigate" },
  legalLabel: { fil: "Legal", en: "Legal" },
  privacy: { fil: "Privacy", en: "Privacy" },
  accessibility: { fil: "Accessibility", en: "Accessibility" },
  dataPolicy: { fil: "Data Policy", en: "Data Policy" },
  builtBy: { fil: "Ginawa ni John Casper Santos", en: "Built by John Casper Santos" },
  github: { fil: "GitHub", en: "GitHub" },
  portfolio: { fil: "Portfolio", en: "Portfolio" },
  linkedin: { fil: "LinkedIn", en: "LinkedIn" },
};

const NAV_LABELS = {
  match: { fil: "AI Matcher", en: "AI Matcher" },
  explorer: { fil: "Mga Kurso", en: "Courses" },
  jobs: { fil: "Mga Trabaho", en: "Jobs" },
  chat: { fil: "Chat", en: "Chat" },
  faq: { fil: "FAQ", en: "FAQ" },
};

const NAV_LINKS = [
  { path: "/match", key: "match" as const },
  { path: "/explorer", key: "explorer" as const },
  { path: "/jobs", key: "jobs" as const },
  { path: "/chat", key: "chat" as const },
  { path: "/faq", key: "faq" as const },
];

const LEGAL_ROUTES: { key: "privacy" | "accessibility" | "dataPolicy"; to: string }[] = [
  { key: "privacy", to: "/privacy" },
  { key: "accessibility", to: "/accessibility" },
  { key: "dataPolicy", to: "/data-policy" },
];

const SOCIAL_LINKS = [
  { url: "https://github.com/Kyazs", key: "github" as const, Icon: Github },
  { url: "https://www.caspersantos.dev/", key: "portfolio" as const, Icon: Globe },
  { url: "https://www.linkedin.com/in/jcasper-santos/", key: "linkedin" as const, Icon: Linkedin },
];

export default function Footer({ lang }: FooterProps) {
  const t = (obj: { fil: string; en: string }) => obj[lang];

  return (
    <footer className="border-t border-kt-border bg-kt-bg">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="flex-1 min-w-0">
            <div className="font-display text-xl font-extrabold text-kt-blue">
              Ka-Traba<span className="text-kt-gold">HO</span>
            </div>
            <p className="text-[13px] text-kt-slate leading-[1.7] mt-3 max-w-[320px]">
              {t(COPY.tagline)}
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {SOCIAL_LINKS.map(({ url, key, Icon }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-kt-blue-light text-kt-blue text-xs font-semibold px-3 py-1.5 rounded-full border border-kt-blue-soft inline-flex items-center gap-1.5 hover:bg-kt-blue-soft transition-colors touch-manipulation"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t(COPY[key])}
                </a>
              ))}
            </div>
          </div>

          <div className="flex gap-10 md:gap-12">
            <div>
              <div className="text-xs font-bold text-kt-slate uppercase tracking-[0.08em] mb-3">
                {t(COPY.navLabel)}
              </div>
              <nav aria-label={t(COPY.navLabel)} className="flex flex-col gap-0.5">
                {NAV_LINKS.map(({ path, key }) => (
                  <Link
                    key={key}
                    to={path}
                    className="text-[13px] text-kt-near-black font-medium hover:text-kt-blue min-h-[44px] inline-flex items-center touch-manipulation"
                  >
                    {t(NAV_LABELS[key])}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <div className="text-xs font-bold text-kt-slate uppercase tracking-[0.08em] mb-3">
                {t(COPY.legalLabel)}
              </div>
              <nav aria-label={t(COPY.legalLabel)} className="flex flex-col gap-0.5">
                {LEGAL_ROUTES.map(({ key, to }) => (
                  <Link
                    key={key}
                    to={to}
                    className="text-[13px] text-kt-near-black font-medium hover:text-kt-blue min-h-[44px] inline-flex items-center touch-manipulation"
                  >
                    {t(COPY[key])}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="border-t border-kt-border mt-8 pt-5 flex flex-col sm:flex-row justify-between gap-2">
          <span className="text-xs text-kt-slate">{t(COPY.copyright)}</span>
          <span className="text-xs text-kt-blue font-bold">{t(COPY.builtBy)}</span>
        </div>
      </div>
    </footer>
  );
}
