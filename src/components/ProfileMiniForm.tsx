import React from "react";
import { Sparkles, Award, Check, AlertTriangle, ChevronDown } from "lucide-react";
import { ProfileMiniFormProps } from "../types";

const TAG_LIMIT = 4;

export default function ProfileMiniForm(props: ProfileMiniFormProps) {
  const {
    lang,
    customInterests,
    customSkills,
    careerGoal,
    setCareerGoal,
    interestInput,
    setInterestInput,
    skillInput,
    setSkillInput,
    handleAddCustomInterest,
    handleAddCustomSkill,
    toggleInterestTag,
    toggleSkillTag,
    QUICK_INTERESTS,
    QUICK_SKILLS,
    onGoToFullAssessment
  } = props;

  const isReady = customInterests.length > 0 || careerGoal.trim().length >= 5;

  const [showMoreInterests, setShowMoreInterests] = React.useState(false);
  const [showMoreSkills, setShowMoreSkills] = React.useState(false);

  const visibleInterests = showMoreInterests ? QUICK_INTERESTS : QUICK_INTERESTS.slice(0, TAG_LIMIT);
  const visibleSkills = showMoreSkills ? QUICK_SKILLS : QUICK_SKILLS.slice(0, TAG_LIMIT);
  const hasMoreInterests = QUICK_INTERESTS.length > TAG_LIMIT;
  const hasMoreSkills = QUICK_SKILLS.length > TAG_LIMIT;

  const copy = {
    title: isReady
      ? { fil: "Iyong profile", en: "Your profile" }
      : { fil: "Kumpletuhin ang iyong profile", en: "Complete your profile" },
    subtitle: isReady
      ? {
          fil: "Handa na ang iyong profile. Maaari mo pa ring dagdagan o baguhin bago mag-submit.",
          en: "Your profile is ready. You can still add or change details before submitting."
        }
      : {
          fil: "Kailangan naming malaman ang iyong interes o plano para mahanap ang tamang trabaho.",
          en: "We need to know your interests or goal to find matching jobs."
        },
    interestsLabel: { fil: "Ano ang mga hilig mo?", en: "What do you enjoy?" },
    interestsHint: { fil: "Pumili ng kahit isa:", en: "Pick at least one:" },
    skillsLabel: { fil: "Mga kakayahan mo (optional)", en: "Your skills (optional)" },
    skillsHint: {
      fil: "Idagdag ang mga kakayahan na meron ka na:",
      en: "Add any skills you already have:"
    },
    goalLabel: { fil: "Ano ang plano mong trabaho?", en: "What job do you want?" },
    goalHint: {
      fil: "Magsulat ng maikling plano o pangarap...",
      en: "Write a short goal or dream job..."
    },
    interestPlaceholder: { fil: "I-type ang iba pang interes...", en: "Type another interest..." },
    skillPlaceholder: { fil: "I-type ang iba pang kakayahan...", en: "Type another skill..." },
    addBtn: { fil: "I-add", en: "Add" },
    ready: {
      fil: "Profile ready! Pindutin ang 'Hanapin ang Trabaho para sa Akin!' button.",
      en: "Profile ready! Click the 'Find Jobs for Me!' button."
    },
    missing: {
      fil: "Pumili ng interes o magsulat ng career goal para ma-unlock ang button.",
      en: "Select an interest or write a career goal to unlock the button."
    },
    fullAssessmentLink: { fil: "Punta sa AI Matcher tab", en: "Go to AI Matcher tab" }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-kt-border space-y-6">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-kt-blue text-white shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-kt-near-black">
            {copy.title[lang]}
          </h3>
          <p className="text-xs text-kt-slate mt-1 leading-relaxed">
            {copy.subtitle[lang]}
          </p>
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <label htmlFor="mini-interest-input" className="block text-xs font-bold text-kt-slate">
          {copy.interestsLabel[lang]}
        </label>
        <div className="flex flex-wrap gap-2">
          {visibleInterests.map((int) => {
            const selected = customInterests.includes(int.label);
            return (
              <button
                key={int.label}
                type="button"
                onClick={() => toggleInterestTag(int.label)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all touch-manipulation ${
                  selected
                    ? "bg-kt-blue text-white"
                    : "bg-kt-blue-light border border-kt-blue-soft text-kt-blue hover:bg-kt-blue-soft"
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
                {int.label}
              </button>
            );
          })}
          {hasMoreInterests && (
            <button
              type="button"
              onClick={() => setShowMoreInterests(!showMoreInterests)}
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold text-kt-blue bg-kt-bg border border-kt-border hover:bg-kt-blue-light transition-all touch-manipulation"
              aria-expanded={showMoreInterests}
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showMoreInterests ? "rotate-180" : ""}`} />
              {showMoreInterests
                ? (lang === "fil" ? "Wala na" : "Less")
                : (lang === "fil" ? `+${QUICK_INTERESTS.length - TAG_LIMIT} pa` : `+${QUICK_INTERESTS.length - TAG_LIMIT} more`)}
            </button>
          )}
        </div>
        <form onSubmit={handleAddCustomInterest} className="flex gap-2">
          <input
            id="mini-interest-input"
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            placeholder={copy.interestPlaceholder[lang]}
            className="flex-1 rounded-xl border border-kt-border bg-white px-3 py-2 text-sm focus:border-kt-blue focus:ring-3 focus:ring-kt-blue-light focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="rounded-xl bg-kt-blue hover:bg-kt-blue-mid active:scale-95 text-white px-4 py-2 text-xs font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            {copy.addBtn[lang]}
          </button>
        </form>
        {customInterests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {customInterests.map((interest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-kt-blue-light text-kt-blue px-2.5 py-1 rounded-full text-xs font-medium border border-kt-blue-soft"
              >
                {interest}
                <button
                  onClick={() => toggleInterestTag(interest)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-kt-blue/50 hover:text-kt-danger font-bold rounded-full hover:bg-kt-danger-light transition-colors"
                  aria-label={lang === 'fil' ? `Alisin ang ${interest}` : `Remove ${interest}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Optional Skills */}
      <div className="space-y-3">
        <label htmlFor="mini-skill-input" className="block text-xs font-bold text-kt-slate">
          {copy.skillsLabel[lang]}
        </label>
        <div className="flex flex-wrap gap-2">
          {visibleSkills.map((skill) => {
            const selected = customSkills.includes(skill.label);
            return (
              <button
                key={skill.label}
                type="button"
                onClick={() => toggleSkillTag(skill.label)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all touch-manipulation ${
                  selected
                    ? "bg-kt-blue text-white"
                    : "bg-kt-blue-light border border-kt-blue-soft text-kt-blue hover:bg-kt-blue-soft"
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
                {skill.label}
              </button>
            );
          })}
          {hasMoreSkills && (
            <button
              type="button"
              onClick={() => setShowMoreSkills(!showMoreSkills)}
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold text-kt-blue bg-kt-bg border border-kt-border hover:bg-kt-blue-light transition-all touch-manipulation"
              aria-expanded={showMoreSkills}
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showMoreSkills ? "rotate-180" : ""}`} />
              {showMoreSkills
                ? (lang === "fil" ? "Wala na" : "Less")
                : (lang === "fil" ? `+${QUICK_SKILLS.length - TAG_LIMIT} pa` : `+${QUICK_SKILLS.length - TAG_LIMIT} more`)}
            </button>
          )}
        </div>
        <form onSubmit={handleAddCustomSkill} className="flex gap-2">
          <input
            id="mini-skill-input"
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder={copy.skillPlaceholder[lang]}
            className="flex-1 rounded-xl border border-kt-border bg-white px-3 py-2 text-sm focus:border-kt-blue focus:ring-3 focus:ring-kt-blue-light focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="rounded-xl bg-kt-blue hover:bg-kt-blue-mid active:scale-95 text-white px-4 py-2 text-xs font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            {copy.addBtn[lang]}
          </button>
        </form>
        {customSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {customSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-kt-blue-light text-kt-blue px-2.5 py-1 rounded-full text-xs font-medium border border-kt-blue-soft"
              >
                {skill}
                <button
                  onClick={() => toggleSkillTag(skill)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-kt-blue/50 hover:text-kt-danger font-bold rounded-full hover:bg-kt-danger-light transition-colors"
                  aria-label={lang === 'fil' ? `Alisin ang ${skill}` : `Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Career Goal */}
      <div className="space-y-2">
        <label htmlFor="mini-career-goal" className="block text-xs font-bold text-kt-slate">
          {copy.goalLabel[lang]}
        </label>
        <textarea
          id="mini-career-goal"
          rows={3}
          value={careerGoal}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 200) setCareerGoal(value);
          }}
          placeholder={copy.goalHint[lang]}
          className="w-full border border-kt-border bg-white rounded-xl px-3 py-2.5 text-sm focus:border-kt-blue focus:ring-3 focus:ring-kt-blue-light focus:outline-none transition-all resize-none"
          maxLength={200}
        />
        <div className="flex justify-end items-center">
          <span className={`text-xs ${careerGoal.length >= 180 ? "text-amber-500" : "text-kt-slate"}`}>
            {careerGoal.length}/200
          </span>
        </div>
      </div>

      {/* Status */}
      <div
        className={`rounded-xl p-3 flex items-start gap-2 border ${
          isReady
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-amber-50 border-amber-200 text-amber-800"
        }`}
      >
        {isReady ? (
          <Check className="h-5 w-5 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        )}
        <p className="text-xs font-semibold leading-relaxed">
          {isReady ? copy.ready[lang] : copy.missing[lang]}
        </p>
      </div>

      {onGoToFullAssessment && (
        <div className="text-center">
          <button
            onClick={onGoToFullAssessment}
            className="text-xs font-bold text-kt-blue hover:underline decoration-dotted"
          >
            {copy.fullAssessmentLink[lang]}
          </button>
        </div>
      )}
    </div>
  );
}
