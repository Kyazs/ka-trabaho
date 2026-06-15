import React from "react";
import { Sparkles, Award, Check, AlertTriangle } from "lucide-react";
import { ProfileMiniFormProps } from "../types";

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
    <div className="bg-[#F8F9FC] rounded-2xl p-5 border border-[#e5e8ef] space-y-6">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-[#0F3D91] text-white shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-[#1A1A2E]">
            {copy.title[lang]}
          </h3>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
            {copy.subtitle[lang]}
          </p>
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          {copy.interestsLabel[lang]}
        </label>
        <div className="flex flex-wrap gap-2">
          {QUICK_INTERESTS.map((int) => {
            const selected = customInterests.includes(int.label);
            return (
              <button
                key={int.label}
                type="button"
                onClick={() => toggleInterestTag(int.label)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all touch-manipulation ${
                  selected
                    ? "bg-[#0F3D91] text-white shadow-sm"
                    : "bg-[#E8F0FE] border border-[#d4e3ff] text-[#0F3D91] hover:bg-[#d4e3ff]"
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
                {int.label}
              </button>
            );
          })}
        </div>
        <form onSubmit={handleAddCustomInterest} className="flex gap-2">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            placeholder={copy.interestPlaceholder[lang]}
            className="flex-1 rounded-xl border border-[#e5e8ef] bg-white px-3 py-2 text-sm focus:border-[#0F3D91] focus:ring-3 focus:ring-[#E8F0FE] focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#0F3D91] hover:bg-[#1a52c4] text-white px-4 py-2 text-xs font-bold shadow-md transition-all"
          >
            {copy.addBtn[lang]}
          </button>
        </form>
        {customInterests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {customInterests.map((interest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-[#E8F0FE] text-[#0F3D91] px-2.5 py-1 rounded-full text-xs font-medium border border-[#d4e3ff]"
              >
                {interest}
                <button
                  onClick={() => toggleInterestTag(interest)}
                  className="text-[#0F3D91]/60 hover:text-[#0F3D91] font-bold"
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
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          {copy.skillsLabel[lang]}
        </label>
        <div className="flex flex-wrap gap-2">
          {QUICK_SKILLS.map((skill) => {
            const selected = customSkills.includes(skill.label);
            return (
              <button
                key={skill.label}
                type="button"
                onClick={() => toggleSkillTag(skill.label)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all touch-manipulation ${
                  selected
                    ? "bg-[#FCD116] text-[#1A1A2E] shadow-sm"
                    : "bg-[#fffbe6] border border-[#FCD116] text-[#92710a] hover:bg-[#FCD116]/20"
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
                {skill.label}
              </button>
            );
          })}
        </div>
        <form onSubmit={handleAddCustomSkill} className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder={copy.skillPlaceholder[lang]}
            className="flex-1 rounded-xl border border-[#e5e8ef] bg-white px-3 py-2 text-sm focus:border-[#0F3D91] focus:ring-3 focus:ring-[#E8F0FE] focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#0F3D91] hover:bg-[#1a52c4] text-white px-4 py-2 text-xs font-bold shadow-md transition-all"
          >
            {copy.addBtn[lang]}
          </button>
        </form>
        {customSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {customSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-[#E8F0FE] text-[#0F3D91] px-2.5 py-1 rounded-full text-xs font-medium border border-[#d4e3ff]"
              >
                {skill}
                <button
                  onClick={() => toggleSkillTag(skill)}
                  className="text-[#0F3D91]/60 hover:text-[#0F3D91] font-bold"
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
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
          {copy.goalLabel[lang]}
        </label>
        <textarea
          rows={3}
          value={careerGoal}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 200) setCareerGoal(value);
          }}
          placeholder={copy.goalHint[lang]}
          className="w-full border border-[#e5e8ef] bg-white rounded-xl px-3 py-2.5 text-sm focus:border-[#0F3D91] focus:ring-3 focus:ring-[#E8F0FE] focus:outline-none transition-all resize-none"
          maxLength={200}
        />
        <div className="flex justify-end items-center">
          <span className={`text-xs ${careerGoal.length >= 180 ? "text-amber-500" : "text-[#6B7280]"}`}>
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
            className="text-xs font-bold text-[#0F3D91] hover:underline decoration-dotted"
          >
            {copy.fullAssessmentLink[lang]}
          </button>
        </div>
      )}
    </div>
  );
}
