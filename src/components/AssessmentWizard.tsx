import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  User, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Briefcase, 
  MessageSquare, 
  Check,
  AlertTriangle,
  Award,
  Info,
  BookOpen,
  Clock,
  DollarSign,
  Search
} from "lucide-react";
import { AssessmentWizardProps, WizardStep, MatchingResult } from "../types";
import { SECTORS_DATA } from "../data/tesdaData";

export default function AssessmentWizard(props: AssessmentWizardProps) {
  const {
    age, setAge, education, setEducation, selectedRegion, setSelectedRegion,
    selectedProvince, setSelectedProvince, selectedProvincesList,
    customInterests, setCustomInterests, customSkills, setCustomSkills,
    careerGoal, setCareerGoal, interestInput, setInterestInput,
    skillInput, setSkillInput, handleAddCustomInterest, handleAddCustomSkill,
    toggleInterestTag, toggleSkillTag, handleRegionChange, handleSubmitProfile,
    isMatching, matchResult, matchError, lang,
    QUICK_INTERESTS, QUICK_SKILLS, PHILIPPINES_REGIONS,
    onChatAboutCourse, onExploreCourse, onGoToChat, onGoToFaq
  } = props;

  const stepOrder: WizardStep[] = ['basic', 'interests', 'skills', 'goal', 'review', 'processing', 'results'];
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic');
  const [fadeIn, setFadeIn] = useState(true);
  const [validationError, setValidationError] = useState<string>("");

  const stepLabels = {
    basic: lang === 'fil' ? 'Profile' : 'Profile',
    interests: lang === 'fil' ? 'Interes' : 'Interests',
    skills: lang === 'fil' ? 'Galing' : 'Skills',
    goal: lang === 'fil' ? 'Plano' : 'Goal',
    review: lang === 'fil' ? 'Suriin' : 'Review',
    processing: lang === 'fil' ? 'Sinusuri' : 'Processing',
    results: lang === 'fil' ? 'Resulta' : 'Results'
  };

  const stepIndex = stepOrder.indexOf(currentStep);

  const getStepValidation = () => {
    switch (currentStep) {
      case 'basic':
        if (!age || age < 15) {
          return { valid: false, error: lang === 'fil' ? "Piliin ang edad mo (15 pataas)." : "Please select your age (15+)." };
        }
        if (!selectedRegion) {
          return { valid: false, error: lang === 'fil' ? "Piliin ang rehiyon mo." : "Please select your region." };
        }
        return { valid: true, error: "" };
      case 'interests':
        if (customInterests.length === 0) {
          return { valid: false, error: lang === 'fil' ? "Piliin kahit isa, para mas maigi ang results mo!" : "Pick at least one so we can give you better results!" };
        }
        return { valid: true, error: "" };
      case 'skills':
        return { valid: true, error: "" };
      case 'goal':
        if (!careerGoal || careerGoal.trim().length < 5) {
          return { valid: false, error: lang === 'fil' ? "I-type ang plano mo (kahit 5 letters)." : "Type your goal (at least 5 letters)." };
        }
        return { valid: true, error: "" };
      case 'review':
        if (customInterests.length === 0 && (!careerGoal || careerGoal.trim().length < 5)) {
          return { valid: false, error: lang === 'fil' ? "Kailangan ng interes o plano para mag-match." : "Need at least interests or a goal to match." };
        }
        return { valid: true, error: "" };
      case 'processing':
      case 'results':
        return { valid: false, error: "" };
      default:
        return { valid: true, error: "" };
    }
  };

  const canProceed = () => {
    const validation = getStepValidation();
    if (!validation.valid) {
      setValidationError(validation.error);
    }
    return validation.valid;
  };
  const { valid: isNextValid } = getStepValidation();

  const goToStep = (step: WizardStep) => {
    setValidationError("");
    setFadeIn(false);
    setTimeout(() => {
      setCurrentStep(step);
      setFadeIn(true);
    }, 50);
  };

  const nextStep = () => {
    const idx = stepOrder.indexOf(currentStep);
    if (idx < stepOrder.length - 1 && canProceed()) {
      goToStep(stepOrder[idx + 1]);
    }
  };

  const prevStep = () => {
    const idx = stepOrder.indexOf(currentStep);
    if (idx > 0) {
      goToStep(stepOrder[idx - 1]);
    }
  };

  // Auto-advance on state changes
  useEffect(() => {
    if (isMatching && currentStep !== 'processing' && currentStep !== 'results') {
      goToStep('processing');
    }
  }, [isMatching]);

  useEffect(() => {
    if (matchResult && !isMatching && currentStep !== 'results') {
      goToStep('results');
    }
  }, [matchResult, isMatching]);

  useEffect(() => {
    if (matchError && currentStep === 'processing') {
      goToStep('review');
    }
  }, [matchError]);

  // Reset to basic when results are cleared
  useEffect(() => {
    if (!matchResult && !isMatching && !matchError && currentStep === 'results') {
      goToStep('basic');
    }
  }, [matchResult, isMatching, matchError]);



  const renderStepIndicator = () => {
    return (
      <div className="w-full mb-8">
        <div className="flex flex-wrap gap-2 justify-center items-center">
          {stepOrder.map((step, idx) => {
            const isActive = step === currentStep;
            const isCompleted = stepIndex > idx;
            const isFuture = stepIndex < idx;
            
            return (
              <React.Fragment key={step}>
                  <button
                  onClick={() => {
                    if (!isFuture && step !== 'processing' && step !== 'results') {
                      goToStep(step as WizardStep);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                      : isCompleted
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  } ${isFuture || step === 'processing' || step === 'results' ? 'cursor-default' : 'cursor-pointer hover:scale-105'}`}
                >
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white text-blue-600' : isCompleted ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-500'
                  }`}>
                    {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                  </span>
                  <span className="hidden sm:inline">{stepLabels[step as keyof typeof stepLabels]}</span>
                </button>
                {idx < stepOrder.length - 1 && (
                  <div className={`hidden md:block w-8 h-0.5 ${isCompleted ? 'bg-blue-400' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    const containerClass = `transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`;
    
    switch (currentStep) {
      case 'basic':
        return (
          <div className={containerClass}>
            <div className="flex items-center gap-3 pb-5 mb-8 border-b border-slate-100">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 shadow-sm">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">
                  {lang === "fil" ? "Mabilisang Profile Assessment" : "Quick Profile Assessment"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {lang === "fil" ? "Ilagay ang iyong basic info" : "Enter your basic information"}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Age Input */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
                  {lang === "fil" ? "Ilang Taon Ka Na? (Bukas para sa edad 15-24+)" : "Your Age (Targeting 15-24)"}
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    id="input-profile-age-slider"
                    type="range" 
                    min="15" 
                    max="35" 
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="flex-shrink-0 inline-block bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl text-base border border-blue-200 shadow-sm">
                    {age} {lang === "fil" ? "taong gulang" : "years old"}
                  </span>
                </div>
              </div>

              {/* Completed Education Level */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
                  {lang === "fil" ? "Ano ang huling antas ng pinag-aralan mo?" : "What is your highest educational attainment?"}
                </label>
                <select
                  id="select-profile-edu"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-base focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                >
                  <option value="Elementary Graduate">Grade 6 / Elementary Graduate (Completer)</option>
                  <option value="Elementary Undergrad">Elementary Undergraduate</option>
                  <option value="Junior High School Graduate">Junior High School Graduate (Grade 10 Completer)</option>
                  <option value="Junior High Undergrad">Junior High Undergraduate (Completer / Drop-out)</option>
                  <option value="Senior High School Graduate">Senior High School Graduate (Grade 12 Completer)</option>
                  <option value="ALS Graduate">ALS (Alternative Learning System) Graduate</option>
                  <option value="Vocational College Undergraduate">College Level Undergrad / Drop-out</option>
                </select>
              </div>

              {/* Region selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
                    {lang === "fil" ? "Rehiyon (Region)" : "Desired Region"}
                  </label>
                  <select
                    id="select-profile-region"
                    value={selectedRegion}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-base focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                  >
                    {PHILIPPINES_REGIONS.map((region) => (
                      <option key={region.code} value={region.code}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
                    {lang === "fil" ? "Probinsya / City Hub" : "Province / City Hub"}
                  </label>
                  <select
                    id="select-profile-province"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-base focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium transition-all"
                  >
                    {selectedProvincesList.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'interests':
        return (
          <div className={containerClass}>
            <div className="flex items-center gap-3 pb-5 mb-8 border-b border-slate-100">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">
                  {lang === "fil" ? "Mga Interes" : "Your Interests"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {lang === "fil" ? "Piliin kung ano ang mga hilig mo" : "Select what you enjoy doing"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
                  {lang === "fil" ? "Pilahan ng Iyong mga Interes (Pumili ng higit sa isa):" : "Select Your Main Interests:"}
                </label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {QUICK_INTERESTS.map((int) => (
                    <button
                      key={int.label}
                      type="button"
                      id={`interest-quick-${int.label.replace(/\s+/g, "-")}`}
                      onClick={() => toggleInterestTag(int.label)}
                      className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${
                        customInterests.includes(int.label)
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-md shadow-blue-200 scale-105"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      {int.label}
                    </button>
                  ))}
                </div>

                {/* Manual interest add */}
                <form onSubmit={handleAddCustomInterest} className="flex gap-3">
                  <input
                    id="input-custom-interest"
                    type="text"
                    placeholder={lang === "fil" ? "Magsulat ng iba pang interes (e.g., cellphones)" : "Type other custom interests..."}
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    id="btn-add-custom-interest"
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3 text-sm font-bold hover:from-slate-700 hover:to-slate-600 shadow-md hover:shadow-lg transition-all"
                  >
                    {lang === "fil" ? "I-add" : "Add"}
                  </button>
                </form>
              </div>

              {customInterests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customInterests.map((interest, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {interest}
                      <button 
                        onClick={() => toggleInterestTag(interest)}
                        className="text-blue-400 hover:text-blue-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className={containerClass}>
            <div className="flex items-center gap-3 pb-5 mb-8 border-b border-slate-100">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 shadow-sm">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">
                  {lang === "fil" ? "Mga Galing at Kakayahan" : "Your Skills"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {lang === "fil" ? "Ano ang mga kakayahan mo na ngayon?" : "What can you already do?"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
                  {lang === "fil" ? "Anong mga praktikal na bagay ang marunong ka na?" : "What practical skills do you already have?"}
                </label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {QUICK_SKILLS.map((skill) => (
                    <button
                      key={skill.label}
                      type="button"
                      id={`skill-quick-${skill.label.replace(/\s+/g, "-")}`}
                      onClick={() => toggleSkillTag(skill.label)}
                      className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${
                        customSkills.includes(skill.label)
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-105"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      {skill.label}
                    </button>
                  ))}
                </div>

                {/* Manual skill add */}
                <form onSubmit={handleAddCustomSkill} className="flex gap-3">
                  <input
                    id="input-custom-skill"
                    type="text"
                    placeholder={lang === "fil" ? "Magsulat ng iba pang galing o hilig" : "Type other skill..."}
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    id="btn-add-custom-skill"
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 text-white px-5 py-3 text-sm font-bold hover:from-slate-700 hover:to-slate-600 shadow-md hover:shadow-lg transition-all"
                  >
                    {lang === "fil" ? "I-add" : "Add"}
                  </button>
                </form>
              </div>

              {customSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customSkills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-200"
                    >
                      {skill}
                      <button 
                        onClick={() => toggleSkillTag(skill)}
                        className="text-indigo-400 hover:text-indigo-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={() => {
                  setCustomSkills([]);
                  nextStep();
                }}
                className="text-sm text-slate-500 underline hover:text-slate-700 transition-colors"
              >
                {lang === 'fil' ? "Walang skill? I-skip muna" : "No skills? Skip for now"}
              </button>
            </div>
          </div>
        );

      case 'goal':
        return (
          <div className={containerClass}>
            <div className="flex items-center gap-3 pb-5 mb-8 border-b border-slate-100">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 shadow-sm">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">
                  {lang === "fil" ? "Plano sa Karera" : "Career Goal"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {lang === "fil" ? "Ano ang pangarap mong trabaho?" : "What job do you dream of?"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
                {lang === "fil" ? "Ano ang pangarap o plano mong maging trabaho?" : "Any specific job or lifetime plan?"}
              </label>
              <textarea
                id="textarea-profile-goal"
                rows={4}
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder={lang === "fil" ? "E.g., Gusto ko pong makatrabaho sa mga malalaking barko o maging sikat na chef sa amin" : "Example: I want to build a career in computer repair and help my family financially."}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium transition-all resize-none"
              />
            </div>
          </div>
        );

      case 'review':
        return (
          <div className={containerClass}>
            <div className="flex items-center gap-3 pb-5 mb-8 border-b border-slate-100">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 shadow-sm">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">
                  {lang === "fil" ? "Suriin ang Iyong Profile" : "Review Your Profile"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {lang === "fil" ? "Siguraduhin tama ang lahat ng impormasyon" : "Make sure all information is correct"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{lang === 'fil' ? 'Edad' : 'Age'}</span>
                    <p className="text-sm font-bold text-slate-900 mt-1">{age} {lang === 'fil' ? 'taong gulang' : 'years old'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{lang === 'fil' ? 'Edukasyon' : 'Education'}</span>
                    <p className="text-sm font-bold text-slate-900 mt-1">{education}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{lang === 'fil' ? 'Lokasyon' : 'Location'}</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.name || selectedRegion} — {selectedProvince}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{lang === 'fil' ? 'Mga Interes' : 'Interests'}</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {customInterests.length > 0 ? customInterests.map((interest, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                        {interest}
                      </span>
                    )) : (
                      <span className="text-sm text-slate-400 italic">{lang === 'fil' ? 'Walang napiling interes' : 'No interests selected'}</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{lang === 'fil' ? 'Mga Galing' : 'Skills'}</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {customSkills.length > 0 ? customSkills.map((skill, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium border border-indigo-200">
                        {skill}
                      </span>
                    )) : (
                      <span className="text-sm text-slate-400 italic">{lang === 'fil' ? 'Walang napiling galing' : 'No skills selected'}</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{lang === 'fil' ? 'Plano' : 'Career Goal'}</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">{careerGoal || <span className="italic text-slate-400">{lang === 'fil' ? 'Walang sinulat na plano' : 'No goal written'}</span>}</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-matching-form"
                type="button"
                onClick={handleSubmitProfile}
                disabled={isMatching || (customInterests.length === 0 && !careerGoal)}
                className={`w-full rounded-2xl py-5 text-base font-bold shadow-xl transition-all flex items-center justify-center gap-3 ${
                  isMatching
                    ? "bg-amber-50 text-amber-700 cursor-wait border-2 border-amber-300"
                    : customInterests.length === 0 && !careerGoal
                    ? "bg-slate-50 text-slate-400 cursor-not-allowed border-2 border-dashed border-slate-300"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
                }`}
              >
                {isMatching ? (
                  <>
                    <span className="animate-spin inline-block h-6 w-6 border-[3px] border-amber-500 border-t-transparent rounded-full" />
                    <span className="font-extrabold">{lang === "fil" ? "Sinusuri ng AI ang iyong profile..." : "AI is analyzing your profile..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>
                      {lang === "fil" 
                        ? "I-Match Akong Libreng TESDA Courses!" 
                        : "Match My Profile Instantly!"
                      }
                    </span>
                  </>
                )}
              </button>

              {(customInterests.length === 0 && !careerGoal) && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 font-semibold leading-relaxed">
                    {lang === "fil" 
                      ? "Pumili ng kahit isang interes sa itaas o magsulat sa career goal para ma-unlock ang Matching."
                      : "Select at least one interest above or type a career goal to unlock Matching."
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className={`${containerClass} flex flex-col items-center justify-center py-20`}>
            <div className="animate-spin inline-block h-16 w-16 border-[4px] border-blue-600 border-t-transparent rounded-full mb-6" />
            <h2 className="font-display font-bold text-2xl text-slate-900 mb-3">
              {lang === "fil" ? "Sinusuri ng AI..." : "AI is analyzing..."}
            </h2>
            <p className="text-sm text-slate-500 max-w-md text-center leading-relaxed">
              {lang === "fil" 
                ? "Ini-evaluate ng aming AI counselor ang iyong profile, interes, at lokasyon para makahanap ng pinaka-angkop na TESDA courses at trabaho." 
                : "Our AI counselor is evaluating your profile, interests, and location to find the best TESDA courses and jobs for you."
              }
            </p>
          </div>
        );

      case 'results':
        return renderResults();

      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!matchResult) return null;

    const containerClass = `transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`;

    return (
      <div className={containerClass}>
        {matchError && (
          <div id="matching-error" className="p-6 rounded-2xl border border-red-200 flex items-start gap-4 bg-red-50 text-red-700 max-w-2xl mx-auto shadow-lg mb-8">
            <div className="p-2 rounded-xl bg-red-100">
              <AlertCircle className="h-6 w-6 shrink-0" />
            </div>
            <div>
              <h4 className="font-bold text-base">May kaunting aberya</h4>
              <p className="text-sm text-red-600 mt-2 leading-relaxed">{matchError}</p>
            </div>
          </div>
        )}

        {matchResult && Array.isArray(matchResult.recommendedCourses) && (
          <div id="matching-results-section" className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 font-extrabold text-xs px-4 py-2 rounded-full border border-emerald-200 uppercase tracking-wider mb-4">
                <CheckCircle2 className="h-4 w-4" /> Match Found Successfully
              </span>
              <h2 className="font-display font-extrabold text-2xl text-slate-900 sm:text-3xl">
                Iyong AI Course Compatibility Report
              </h2>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                Narito ang sadyang dinisenyo na analysis pagkatapos tignan ang iyong edad, lokasyon, at galing.
              </p>
            </div>

            {/* AI Summary card */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-3xl p-8 shadow-lg max-w-3xl mx-auto">
              <h4 className="font-display font-extrabold text-base text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                AI Counseling Insights:
              </h4>
              <p className="text-base text-slate-700 leading-relaxed font-medium italic">
                "{matchResult.matchedSummary || "Walang summary available."}"
              </p>
            </div>

            {/* Courses Match List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="matching-recommendation-grid">
              {matchResult.recommendedCourses.map((recCourse, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-2xl transition-all flex flex-col h-full card-hover group"
                >
                  {/* Percent badge heading */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Recommended Match #{idx + 1}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-sm font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200">
                      {recCourse.matchScore}% Match
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-block text-xs font-extrabold font-mono text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 rounded-lg border border-blue-100">
                        Code: {recCourse.courseCode}
                      </span>
                      <h3 className="font-display font-bold text-lg text-slate-900 mt-4 leading-tight">
                        {recCourse.courseName}
                      </h3>
                      
                      <p className="text-sm text-slate-600 mt-4 leading-relaxed bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-2xl border border-slate-100">
                        <strong className="text-slate-900">Bakit para sa iyo:</strong> "{recCourse.reasonForYouth}"
                      </p>
                    </div>

                    <div className="mt-8 pt-5 border-t border-slate-100 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-indigo-50 mt-0.5">
                          <Briefcase className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Pag-asensong Trabaho</span>
                          <span className="block text-sm font-extrabold text-indigo-700 mt-1">{recCourse.immediateJobTitle}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-3">
                        <button
                          id={`btn-match-chat-course-${recCourse.courseCode}`}
                          onClick={() => {
                            if (onChatAboutCourse) {
                              onChatAboutCourse(recCourse.courseCode, recCourse.courseName);
                            }
                          }}
                          className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm py-3 text-center flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Itanong sa Chat</span>
                        </button>
                        <button
                          id={`btn-match-explore-course-${recCourse.courseCode}`}
                          onClick={() => {
                            if (onExploreCourse) {
                              onExploreCourse(recCourse.courseCode, matchResult?.targetSectors);
                            }
                          }}
                          className="rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm px-5 hover:-translate-y-0.5 transition-all"
                        >
                          Detalyado
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enrollment Tips & Next Steps */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white border border-slate-700 shadow-2xl mt-10 relative overflow-hidden" id="matching-result-enrollment-card">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
              
              <div className="relative flex flex-col md:flex-row gap-8 items-start justify-between">
                <div className="max-w-2xl">
                  <h3 className="font-display font-black text-xl text-emerald-400 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    Mahalagang Hakbang ukol sa Scholarship & Allowance:
                  </h3>
                  <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                    {matchResult.faqTip || "Pumunta sa pinakamalapit na TESDA Regional/Provincial Office upang mag-apply ng libreng scholarship."}
                  </p>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-white/10 rounded-2xl p-5 border border-white/20 space-y-2 hover:bg-white/15 transition-all">
                      <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">Required Document #1</span>
                      <span className="block text-sm font-bold text-white">PSA Birth Certificate</span>
                      <span className="block text-xs text-slate-400">Patunay na ikaw ay Pilipino at sapat sa edad.</span>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-5 border border-white/20 space-y-2 hover:bg-white/15 transition-all">
                      <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">Required Document #2</span>
                      <span className="block text-sm font-bold text-white">Diploma o ALS Certificate</span>
                      <span className="block text-xs text-slate-400">Kung wala pa, barangay indigency ay tinatanggap.</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
                  <button 
                    id="btn-goto-chat-counselor"
                    onClick={() => {
                      if (onGoToChat) {
                        onGoToChat();
                      }
                    }}
                    className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-bold text-sm py-4 px-6 flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-900/50 hover:shadow-xl hover:-translate-y-1"
                  >
                    <span>Kausapin ang AI Counselor</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <button 
                    id="btn-goto-faq"
                    onClick={() => {
                      if (onGoToFaq) {
                        onGoToFaq();
                      }
                    }}
                    className="rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm py-4 px-6 text-center hover:-translate-y-1 transition-all"
                  >
                    Tignan ang Buong FAQ Guide
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setCustomInterests([]);
                  setCustomSkills([]);
                  setCareerGoal('');
                  setInterestInput('');
                  setSkillInput('');
                  goToStep('basic');
                }}
                className="rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3 px-6 transition-all"
              >
                {lang === 'fil' ? 'Simulang Muli' : 'Start Over'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderNavigation = () => {
    const isFirstStep = currentStep === 'basic';
    const isLastStep = currentStep === 'results';
    const isReview = currentStep === 'review';
    const isProcessing = currentStep === 'processing';

    if (isLastStep || isProcessing) return null;

    return (
      <div>
        {validationError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm mb-4">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
              isFirstStep
                ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === 'fil' ? 'Bumalik' : 'Back'}
          </button>

          <div className="text-sm text-slate-400 font-medium">
            {lang === 'fil' ? `Hakbang ${stepIndex + 1} ng ${stepOrder.length}` : `Step ${stepIndex + 1} of ${stepOrder.length}`}
          </div>

          {!isReview && (
            <button
              onClick={nextStep}
              disabled={!isNextValid}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                isNextValid
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-50'
              }`}
            >
              {lang === 'fil' ? 'Sunod' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {renderStepIndicator()}
      
      <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-lg card-hover animate-fade-in">
        {renderStepContent()}
        {renderNavigation()}
      </div>
    </div>
  );
}
