import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import PageHeader from "./PageHeader";

interface LegalPageProps {
  pageKey: "privacy" | "accessibility" | "dataPolicy";
  lang: "fil" | "en";
}

interface LegalSection {
  heading: { fil: string; en: string };
  body: { fil: string; en: string };
}

interface LegalPageContent {
  title: { fil: string; en: string };
  subtitle: { fil: string; en: string };
  lastUpdated: string;
  sections: LegalSection[];
}

const LEGAL_CONTENT: Record<LegalPageProps["pageKey"], LegalPageContent> = {
  privacy: {
    title: { fil: "Patakaran sa Privacy", en: "Privacy Policy" },
    subtitle: {
      fil: "Paano namin pinangangalagaan ang iyong impormasyon",
      en: "How we protect your information",
    },
    lastUpdated: "2025-06-16",
    sections: [
      {
        heading: { fil: "Pangkalahatang-ideya", en: "Overview" },
        body: {
          fil: "Ang Ka-TrabaHO ay isang libreng web app na tumutulong sa mga kabataang Pilipino na maghanap ng TESDA courses at trabaho. Ipinapaliwanag ng patakaran na ito kung paano namin pinangangalagaan ang iyong data.",
          en: "Ka-TrabaHO is a free web app that helps Filipino youth find TESDA courses and jobs. This policy explains how we handle your data.",
        },
      },
      {
        heading: { fil: "Data na nakaimbak sa iyong device", en: "Data stored on your device" },
        body: {
          fil: "Lahat ng impormasyon sa iyong profile (edad, antas ng edukasyon, rehiyon, interes, kasanayan, layunin sa career) at kasaysayan ng chat ay nakaimbak sa localStorage ng iyong browser lamang. Walang anumang data ang na-upload sa server para sa permanenteng pag-iimbak.",
          en: "All profile information (age, education level, region, interests, skills, career goal) and chat history are stored in your browser's localStorage only. Nothing is uploaded to any server for permanent storage.",
        },
      },
      {
        heading: { fil: "Data na ipinapadala sa server", en: "Data sent to the server" },
        body: {
          fil: "Kapag gumamit ka ng AI features (pagtutugma ng kurso, pagtutugma ng trabaho, chat), ang iyong profile at mga mensahe ay ipinapadala sa aming server para sa pagproseso. Ipapasa ng server ang mga ito sa Google Gemini API para sa mga AI na sagot. Hindi iniimbak ng aming server o ng Google ang iyong data pagkatapos ng pagproseso.",
          en: "When you use AI features (course matching, job matching, chat), your profile and messages are sent to our server for processing. The server forwards them to Google's Gemini API for AI responses. Neither our server nor Google stores your data after processing.",
        },
      },
      {
        heading: { fil: "Rate limiting", en: "Rate limiting" },
        body: {
          fil: "Sinusubaybayan ng server ang bilang ng mga kahilingan gamit ang IP address upang maiwasan ang pang-aabuso. Ang mga IP address ay hindi permanentlyeng nakaimbak at hindi nakaugnay sa anumang personal na data ng profile.",
          en: "The server tracks request counts by IP address to prevent abuse. IP addresses are not stored permanently and are not linked to any personal profile data.",
        },
      },
      {
        heading: { fil: "Kontrol ng user", en: "User control" },
        body: {
          fil: 'Maaari mong tingnan ang iyong nakaimbak na data anumang oras sa pamamagitan ng pag-check sa localStorage ng iyong browser. Maaari mong burahin ang lahat ng iyong data agad gamit ang "Burahin ang Data Ko" na opsyon sa menu ng app.',
          en: 'You can view your stored data anytime by checking your browser\'s localStorage. You can delete all your data instantly using the "Clear My Data" option in the app menu.',
        },
      },
      {
        heading: { fil: "Mga menor-de-edad", en: "Minors" },
        body: {
          fil: "Ang Ka-TrabaHO ay dinisenyo para sa mga kabataan edad 15-24. Hindi kami nagkukolekta ng karagdagang data mula sa mga menor-de-edad bukod sa nasabi sa itaas. Walang kinakailangang paggawa ng account.",
          en: "Ka-TrabaHO is designed for youth aged 15-24. We do not collect additional data from minors beyond what is described above. No account creation is required.",
        },
      },
      {
        heading: { fil: "Iba pang partido", en: "Third parties" },
        body: {
          fil: "Ang Google Gemini API ang tanging third-party na serbisyo na kasangkot, ginagamit lamang para sa AI processing. Hindi kami gumagamit ng analytics trackers, advertising networks, o social media pixels.",
          en: "Google Gemini API is the only third-party service involved, used solely for AI processing. We do not use analytics trackers, advertising networks, or social media pixels.",
        },
      },
      {
        heading: { fil: "Mga pagbabago sa patakaran", en: "Policy changes" },
        body: {
          fil: 'Maaari naming i-update ang patakaran na ito. Ang mga pagbabago ay ipapakita sa "Last updated" na petsa. Ang patuloy na paggamit ng app ay nangangahulugan ng pagtanggap sa mga pagbabago.',
          en: 'We may update this policy. Changes will be reflected in the "Last updated" date. Continued use of the app constitutes acceptance of changes.',
        },
      },
    ],
  },
  accessibility: {
    title: { fil: "Pahayag sa Accessibility", en: "Accessibility Statement" },
    subtitle: {
      fil: "Ang aming komitment sa inklusibong disenyo",
      en: "Our commitment to inclusive design",
    },
    lastUpdated: "2025-06-16",
    sections: [
      {
        heading: { fil: "Pangkalahatang-ideya", en: "Overview" },
        body: {
          fil: "Ang Ka-TrabaHO ay dinisenyo upang maging accessible sa lahat ng kabataang Pilipino, kabilang ang mga may kapansanan. Sinusunod namin ang WCAG 2.1 guidelines bilang aming baseline.",
          en: "Ka-TrabaHO is designed to be accessible to all Filipino youth, including those with disabilities. We follow WCAG 2.1 guidelines as our baseline.",
        },
      },
      {
        heading: { fil: "Mobile-first na disenyo", en: "Mobile-first design" },
        body: {
          fil: "Ginawa para sa 5.5-inch na screen bilang minimum. Lahat ng interactive na elemento ay sumusunod sa 44px minimum na touch target size na inirerekomenda ng WCAG.",
          en: "Built for 5.5-inch screens as the minimum. All interactive elements meet the 44px minimum touch target size recommended by WCAG.",
        },
      },
      {
        heading: { fil: "Kulay at kontrast", en: "Color and contrast" },
        body: {
          fil: "Ang text ay nagpapanatili ng hindi bababa sa 4.5:1 na contrast ratio laban sa backgrounds. Ang two-anchor na color system (Depth Blue sa light backgrounds) ay nagtitiyak ng readability.",
          en: "Text maintains at least 4.5:1 contrast ratio against backgrounds. The two-anchor color system (Depth Blue on light backgrounds) ensures readability.",
        },
      },
      {
        heading: { fil: "Dalawang wika", en: "Bilingual interface" },
        body: {
          fil: "Kumpleto ang interface sa Filipino at English. Ang language toggle ay laging accessible mula sa navigation bar.",
          en: "Full interface available in Filipino and English. Language toggle is always accessible from the navigation bar.",
        },
      },
      {
        heading: { fil: "Navegasyon gamit ang keyboard", en: "Keyboard navigation" },
        body: {
          fil: "Lahat ng interactive na elemento ay abot-kamay sa keyboard. May skip-to-content link. Ang focus indicators ay gumagamit ng 3px ring para sa visibility.",
          en: "All interactive elements are reachable via keyboard. Skip-to-content link provided. Focus indicators use a 3px ring for visibility.",
        },
      },
      {
        heading: { fil: "Screen reader support", en: "Screen reader support" },
        body: {
          fil: "May ARIA labels sa navigation, live regions para sa chat updates, at semantic HTML structure. Ang mga form ay may kaukulang labels.",
          en: "ARIA labels on navigation, live regions for chat updates, semantic HTML structure. Forms have associated labels.",
        },
      },
      {
        heading: { fil: "Kilalang limitasyon", en: "Known limitations" },
        body: {
          fil: 'Ang AI chat interface ay mabilis mag-update, na maaaring mahirap para sa ilang screen reader users. Inirerekomenda namin ang paggamit ng "Burahin" na button para i-reset ang usapan kung nagiging mahirap itong sundan.',
          en: 'The AI chat interface updates rapidly, which may be challenging for some screen reader users. We recommend using the "Clear" button to reset the conversation if it becomes difficult to follow.',
        },
      },
      {
        heading: { fil: "Feedback", en: "Feedback" },
        body: {
          fil: "Kung makaranas ka ng accessibility barriers, mangyaring makipag-ugnayan sa amin sa pamamagitan ng chat feature o bisitahin ang pinakamalapit na TESDA office para sa tulong. Kami ay nakasentro sa patuloy na pagpapabuti.",
          en: "If you encounter accessibility barriers, please contact us through the chat feature or visit the nearest TESDA office for assistance. We are committed to ongoing improvement.",
        },
      },
    ],
  },
  dataPolicy: {
    title: { fil: "Patakaran sa Data", en: "Data Policy" },
    subtitle: {
      fil: "Anong data ang aming kino-collect at paano ito ginagamit",
      en: "What data we collect and how we use it",
    },
    lastUpdated: "2025-06-16",
    sections: [
      {
        heading: { fil: "Data na kino-collect", en: "Data we collect" },
        body: {
          fil: "Kolektahin lang namin ang iyong boluntaryong ibinigay: edad, antas ng edukasyon, rehiyon/probinsya, interes, kasanayan, at layunin sa career. Walang account, walang email, walang phone number ang kailangan.",
          en: "We only collect what you voluntarily provide: age, education level, region/province, interests, skills, and career goal. No accounts, no email, no phone number required.",
        },
      },
      {
        heading: { fil: "Saan naka-imbak", en: "Where it's stored" },
        body: {
          fil: 'Lahat ng data ay nakaimbak sa localStorage ng iyong browser. Hindi ito umalis sa iyong device maliban sa AI processing (tingnan ang seksyon 3). Kung nag-share ka ng device, gamitin ang "Burahin ang Data Ko" pagkatapos ng bawat session.',
          en: 'All data is stored in your browser\'s localStorage. It never leaves your device except during AI processing (see section 3). If you share a device, use "Clear My Data" after each session.',
        },
      },
      {
        heading: { fil: "Ano ang ipinapadala", en: "What's sent to the server" },
        body: {
          fil: "Kapag humingi ka ng AI matching o chat, ang iyong profile at mensahe ay pansamantalang ipinapadala sa aming server, na ipapasa ito sa Google Gemini API. Ang sagot ay ipinapadala pabalik sa iyo. Hindi man ang server o Google ang nag-iimbak ng iyong data pagkatapos makumpleto ang pagproseso.",
          en: "When you request AI matching or chat, your profile and messages are temporarily sent to our server, which forwards them to Google's Gemini API. The response is sent back to you. Neither the server nor Google retains your data after processing is complete.",
        },
      },
      {
        heading: { fil: "Retention", en: "Retention" },
        body: {
          fil: "Ang data ay nananatili sa localStorage hanggang sa burahin mo ito sa pamamagitan ng menu ng app, burahin ang data ng iyong browser, o gumamit ng ibang browser. Walang automatic expiration.",
          en: "Data remains in localStorage until you clear it via the app menu, clear your browser data, or use a different browser. There is no automatic expiration.",
        },
      },
      {
        heading: { fil: "Cookies at trackers", en: "Cookies and trackers" },
        body: {
          fil: "Ang Ka-TrabaHO ay hindi gumagamit ng cookies, analytics trackers (tulad ng Google Analytics), advertising pixels, o anumang third-party tracking scripts.",
          en: "Ka-TrabaHO does not use cookies, analytics trackers (like Google Analytics), advertising pixels, or any third-party tracking scripts.",
        },
      },
      {
        heading: { fil: "Pagbabahagi ng data", en: "Data sharing" },
        body: {
          fil: "Hindi namin ibinabahagi ang iyong data sa anumang third party maliban sa Google Gemini API para sa layuning paggawa ng AI na sagot lamang. Hindi iniimbak ng Gemini API ang iyong data o ginagamit ito para sa training.",
          en: "We do not share your data with any third party except Google's Gemini API for the sole purpose of generating AI responses. Gemini API does not store your data or use it for training.",
        },
      },
      {
        heading: { fil: "Karapatang pantao", en: "Your rights" },
        body: {
          fil: "May buong kontrol ka: tingnan ang iyong data anumang oras (browser dev tools), burahin ang lahat ng data agad (menu ng app), o simpleng isara ang browser. Walang account deletion ang kailangan dahil walang accounts na umiiral.",
          en: "You have full control: view your data anytime (browser dev tools), delete all data instantly (app menu), or simply close the browser. No account deletion needed because no accounts exist.",
        },
      },
      {
        heading: { fil: "Kontakt", en: "Contact" },
        body: {
          fil: "Para sa mga data-related na alalahanin, gamitin ang chat feature sa loob ng app o bisitahin ang pinakamalapit na TESDA office.",
          en: "For data-related concerns, use the chat feature within the app or visit the nearest TESDA office.",
        },
      },
    ],
  },
};

export default function LegalPage({ pageKey, lang }: LegalPageProps) {
  const content = LEGAL_CONTENT[pageKey];
  const t = (obj: { fil: string; en: string }) => obj[lang];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-kt-blue font-semibold text-sm hover:text-kt-blue-mid transition-colors min-h-[44px] touch-manipulation"
      >
        <ArrowLeft className="h-4 w-4" />
        {lang === "fil" ? "Bumalik" : "Back"}
      </Link>

      <PageHeader
        title={t(content.title)}
        subtitle={t(content.subtitle)}
        icon={ShieldCheck}
        accent="blue"
      />

      <div className="bg-white rounded-2xl border border-kt-border p-6 md:p-8">
        {content.sections.map((section, idx) => (
          <div key={idx} className={idx > 0 ? "mt-6" : ""}>
            <h3 className="font-display font-bold text-base text-kt-near-black mb-2">
              {idx + 1}. {t(section.heading)}
            </h3>
            <p className="text-sm text-kt-slate leading-[1.7]">{t(section.body)}</p>
          </div>
        ))}

        <div className="mt-8 pt-4 border-t border-kt-border">
          <span className="text-xs text-kt-slate">
            {lang === "fil" ? "Huling na-update" : "Last updated"}: {content.lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
}
