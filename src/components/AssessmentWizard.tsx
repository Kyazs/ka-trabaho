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
import { AssessmentWizardProps, WizardStep } from "../types";
import { SECTORS_DATA } from "../data/tesdaData";

export default function AssessmentWizard(props: AssessmentWizardProps) {
  const {
    age, setAge, education, setEducation, selectedRegion, setSelectedRegion,
    selectedProvince, setSelectedProvince, selectedProvincesList,
    customInterests, setCustomInterests, customSkills, setCustomSkills,
    careerGoal, setCareerGoal, careerGoalError, interestInput, setInterestInput,
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

  const processingSteps = lang === 'fil'
    ? [
        "Sinusuri ang iyong profile...",
        "Tinitignan ang 300+ kurso...",
        "Sinusuri ang demand sa iyong rehiyon...",
        "Pini-finalize ang top matches...",
      ]
    : [
        "Analyzing your profile...",
        "Matching with 300+ courses...",
        "Checking job demand in your region...",
        "Finalizing your top matches...",
      ];

  const [processingStepIndex, setProcessingStepIndex] = useState(0);

  useEffect(() => {
    if (currentStep !== 'processing') return;
    const interval = setInterval(() => {
      setProcessingStepIndex((prev) => (prev + 1) % processingSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [currentStep, lang]);

  const stepLabels = {
    basic: lang === 'fil' ? 'Profile' : 'Profile',
    interests: lang === 'fil' ? 'Interes' : 'Interests',
    skills: lang === 'fil' ? 'Kakayahan' : 'Skills',
    goal: lang === 'fil' ? 'Layunin' : 'Goal',
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
          return { valid: false, error: lang === 'fil' ? "Piliin kahit isa, para mas maigi ang resulta mo!" : "Pick at least one so we can give you better results!" };
        }
        return { valid: true, error: "" };
      case 'skills':
        return { valid: true, error: "" };
      case 'goal':
        if (!careerGoal || careerGoal.trim().length < 5) {
          return { valid: false, error: lang === 'fil' ? "I-type ang plano mo (kahit 5 letra)." : "Type your goal (at least 5 letters)." };
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
      <div className="mb-6">
        {/* Mobile progress bar */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              {lang === 'fil' ? `Hakbang ${stepIndex + 1} ng ${stepOrder.length}` : `Step ${stepIndex + 1} of ${stepOrder.length}`}
            </span>
            <span className="text-xs font-bold text-[#0F3D91]">
              {stepLabels[currentStep]}
            </span>
          </div>
          <div className="h-2 bg-[#E8F0FE] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0F3D91] rounded-full transition-all duration-500"
              style={{ width: `${((stepIndex + 1) / stepOrder.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop step dots */}
        <div className="hidden md:flex items-center justify-center gap-2">
          {stepOrder.map((step, idx) => (
            <button
              key={step}
              onClick={() => {
                if (idx <= stepIndex) goToStep(step);
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                idx === stepIndex
                  ? "bg-[#0F3D91] text-white shadow-md"
                  : idx < stepIndex
                  ? "bg-[#E8F0FE] text-[#0F3D91] border border-[#d4e3ff]"
                  : "bg-[#F8F9FC] text-[#6B7280] border border-[#e5e8ef]"
              }`}
              disabled={idx > stepIndex}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                idx === stepIndex ? "bg-white text-[#0F3D91]" : ""
              }`}>
                {idx < stepIndex ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </span>
              <span className="hidden lg:inline">{stepLabels[step]}</span>
            </button>
          ))}
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
            <div className="flex items-center gap-3 pb-5 mb-8 border-b border-[#e5e8ef]">
              <div className="p-3 rounded-xl bg-[#0F3D91] text-white shadow-sm">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-[#1A1A2E]">
                  {lang === "fil" ? "Mabilisang Profile Assessment" : "Quick Profile Assessment"}
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  {lang === "fil" ? "Ilagay ang iyong basic info" : "Enter your basic information"}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Age Input */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  {lang === "fil" ? "Ilang Taon Ka Na? (Para sa edad 15-24)" : "Your Age (15-24)"}
                </label>
                 <div className="flex flex-col sm:flex-row items-center gap-4">
                   <input 
                     id="input-profile-age-slider"
                     type="range" 
                     min="15" 
                     max="24" 
                     value={age}
                     onChange={(e) => setAge(Math.min(24, Math.max(15, parseInt(e.target.value) || 18)))}
                     className="w-full h-3 bg-[#E8F0FE] rounded-lg appearance-none cursor-pointer accent-[#0F3D91]"
                   />
                   <span className="flex-shrink-0 inline-block bg-[#E8F0FE] text-[#0F3D91] font-bold px-4 py-2 rounded-xl text-base border border-[#d4e3ff]">
                    {age} {lang === "fil" ? "taong gulang" : "years old"}
                  </span>
                </div>
              </div>

              {/* Completed Education Level */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  {lang === "fil" ? "Ano ang pinakamataas na antas ng iyong pag-aaral?" : "What is your highest educational attainment?"}
                </label>
                <select
                  id="select-profile-edu"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                    className="w-full rounded-xl border border-[#e5e8ef] bg-white px-5 py-4 text-base focus:bg-white focus:border-[#0F3D91] focus:ring-3 focus:ring-[#E8F0FE] focus:outline-none font-medium transition-all"
                  >
                  <option value="Elementary Graduate">Grade 6 / Elementary Graduate (Completer)</option>
                  <option value="Elementary Undergrad">Elementary Undergraduate</option>
                  <option value="Junior High School Graduate">Junior High School Graduate (Grade 10 Completer)</option>
                  <option value="Junior High Undergrad">Junior High Undergraduate (Completer / Drop-out)</option>
                  <option value="Senior High School Graduate">Senior High School Graduate (Grade 12 Completer)</option>
                  <option value="ALS Graduate">ALS (Alternative Learning System) Graduate</option>
                  <option value="Vocational College Undergraduate">College Level Undergrad / Drop-out</option>
                  <option value="College Graduate">College Graduate</option>
                 </select>
              </div>

              {/* Region selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                    {lang === "fil" ? "Gustong Rehiyon (Region)" : "Desired Region"}
                  </label>
                  <select
                    id="select-profile-region"
                    value={selectedRegion}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full rounded-xl border border-[#e5e8ef] bg-white px-5 py-4 text-base focus:bg-white focus:border-[#0F3D91] focus:ring-3 focus:ring-[#E8F0FE] focus:outline-none font-medium transition-all"
                  >
                    {PHILIPPINES_REGIONS.map((region) => (
                      <option key={region.code} value={region.code}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                    {lang === "fil" ? "Probinsya / City Hub" : "Province / City Hub"}
                  </label>
                  <select
                    id="select-profile-province"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full rounded-xl border border-[#e5e8ef] bg-white px-5 py-4 text-base focus:bg-white focus:border-[#0F3D91] focus:ring-3 focus:ring-[#E8F0FE] focus:outline-none font-medium transition-all"
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
            <div className="flex items-center gap-3 pb-5 mb-8 border-b border-[#e5e8ef]">
              <div className="p-3 rounded-xl bg-[#0F3D91] text-white shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-[#1A1A2E]">
                  {lang === "fil" ? "Mga Interes" : "Your Interests"}
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  {lang === "fil" ? "Piliin kung ano ang mga hilig mo" : "Select what you enjoy doing"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  {lang === "fil" ? "Piliin ang Iyong mga Interes (Pumili ng higit sa isa):" : "Select Your Main Interests:"}
                </label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {QUICK_INTERESTS.map((int) => {
                    const isSelected = customInterests.includes(int.label);
                    return (
                    <button
                      key={int.label}
                      type="button"
                      id={`interest-quick-${int.label.replace(/\s+/g, "-")}`}
                      onClick={() => toggleInterestTag(int.label)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all touch-manipulation ${
                        isSelected
                          ? "bg-[#0F3D91] text-white shadow-sm"
                          : "bg-[#E8F0FE] border border-[#d4e3ff] text-[#0F3D91] hover:bg-[#d4e3ff]"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                      {int.label}
                    </button>
                    );
                  })}
                </div>

                {/* Manual interest add */}
                <form onSubmit={handleAddCustomInterest} className="flex gap-3">
                  <input
                    id="input-custom-interest"
                    type="text"
                    placeholder={lang === "fil" ? "Magsulat ng iba pang interes (e.g., cellphones)" : "Type other custom interests..."}
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    className="flex-1 rounded-xl border border-[#e5e8ef] bg-white px-4 py-3 text-sm focus:bg-white focus:border-[#0F3D91] focus:ring-3 focus:ring-[#E8F0FE] focus:outline-none transition-all"
                  />
                  <button
                    id="btn-add-custom-interest"
                    type="submit"
                    className="rounded-xl bg-[#0F3D91] hover:bg-[#1a52c4] text-white px-5 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all"
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
                      className="inline-flex items-center gap-1.5 bg-[#E8F0FE] text-[#0F3D91] px-3 py-1.5 rounded-full text-sm font-medium border border-[#d4e3ff]"
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
          </div>
        );

      case 'skills':
        return (
          <div className={containerClass}>
            <div className="flex items-center gap-3 pb-5 mb-8 border-b border-[#e5e8ef]">
              <div className="p-3 rounded-xl bg-[#FCD116] text-[#1A1A2E] shadow-sm">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-[#1A1A2E]">
                  {lang === "fil" ? "Mga Galing at Kakayahan" : "Your Skills"}
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  {lang === "fil" ? "Ano ang mga kakayahan mo na ngayon?" : "What can you already do?"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  {lang === "fil" ? "Anong mga praktikal na bagay ang marunong ka na?" : "What practical skills do you already have?"}
                </label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {QUICK_SKILLS.map((skill) => {
                    const isSelected = customSkills.includes(skill.label);
                    return (
                    <button
                      key={skill.label}
                      type="button"
                      id={`skill-quick-${skill.label.replace(/\s+/g, "-")}`}
                      onClick={() => toggleSkillTag(skill.label)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all touch-manipulation ${
                        isSelected
                          ? "bg-[#0F3D91] text-white shadow-sm"
                          : "bg-[#E8F0FE] border border-[#d4e3ff] text-[#0F3D91] hover:bg-[#d4e3ff]"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                      {skill.label}
                    </button>
                    );
                  })}
                </div>

                {/* Manual skill add */}
                <form onSubmit={handleAddCustomSkill} className="flex gap-3">
                  <input
                    id="input-custom-skill"
                    type="text"
                     placeholder={lang === "fil" ? "Magsulat ng iba pang kakayahan o hilig" : "Type other skill..."}
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 rounded-xl border border-[#e5e8ef] bg-white px-4 py-3 text-sm focus:bg-white focus:border-[#0F3D91] focus:ring-3 focus:ring-[#E8F0FE] focus:outline-none transition-all"
                  />
                  <button
                    id="btn-add-custom-skill"
                    type="submit"
                    className="rounded-xl bg-[#0F3D91] hover:bg-[#1a52c4] text-white px-5 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all"
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
                      className="inline-flex items-center gap-1.5 bg-[#E8F0FE] text-[#0F3D91] px-3 py-1.5 rounded-full text-sm font-medium border border-[#d4e3ff]"
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
              <button
                onClick={() => {
                  setCustomSkills([]);
                  nextStep();
                }}
                className="text-sm text-[#6B7280] underline hover:text-[#1A1A2E] transition-colors"
              >
                {lang === 'fil' ? "Walang skill? I-skip muna" : "No skills? Skip for now"}
              </button>
            </div>
          </div>
        );

      case 'goal':
        return (
          <div className={containerClass}>
            <div className="flex items-center gap-3 pb-5 mb-8 border-b border-[#e5e8ef]">
              <div className="p-3 rounded-xl bg-[#0F3D91] text-white shadow-sm">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-[#1A1A2E]">
                  {lang === "fil" ? "Plano sa Karera" : "Career Goal"}
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  {lang === "fil" ? "Ano ang pangarap mong trabaho?" : "What job do you dream of?"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  {lang === "fil" ? "Anong trabaho ang pangarap mo, o ano ang plano mong karera?" : "Any specific job or lifetime plan?"}
              </label>
              <textarea
                id="textarea-profile-goal"
                rows={4}
                value={careerGoal}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    setCareerGoal(value);
                  }
                }}
                placeholder={lang === "fil" ? "E.g., Gusto ko pong makatrabaho sa mga malalaking barko o maging sikat na chef sa amin" : "Example: I want to build a career in computer repair and help my family financially."}
                className={`w-full border rounded-xl px-4 py-3 text-base focus:ring-3 focus:outline-none transition-all resize-none ${
                  careerGoalError 
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-[#e5e8ef] bg-white focus:border-[#0F3D91] focus:ring-[#E8F0FE]'
                }`}
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-1">
                {careerGoalError && (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {careerGoalError}
                  </span>
                )}
                <span className={`text-xs ml-auto ${careerGoal.length >= 180 ? 'text-amber-500' : 'text-[#6B7280]'}`}>
                  {careerGoal.length}/200
                </span>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className={containerClass}>
            <div className="flex items-center gap-3 pb-5 mb-8 border-b border-[#e5e8ef]">
              <div className="p-3 rounded-xl bg-[#FCD116] text-[#1A1A2E] shadow-sm">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-[#1A1A2E]">
                  {lang === "fil" ? "Suriin ang Iyong Profile" : "Review Your Profile"}
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  {lang === "fil" ? "Siguraduhin tama ang lahat ng impormasyon" : "Make sure all information is correct"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-[#e5e8ef] space-y-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-[#6B7280] tracking-wider">{lang === 'fil' ? 'Edad' : 'Age'}</span>
                    <p className="text-sm font-bold text-[#1A1A2E] mt-1">{age} {lang === 'fil' ? 'taong gulang' : 'years old'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-[#6B7280] tracking-wider">{lang === 'fil' ? 'Edukasyon' : 'Education'}</span>
                    <p className="text-sm font-bold text-[#1A1A2E] mt-1">{education}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-[#6B7280] tracking-wider">{lang === 'fil' ? 'Lokasyon' : 'Location'}</span>
                  <p className="text-sm font-bold text-[#1A1A2E] mt-1">
                    {PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.name || selectedRegion} — {selectedProvince}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-[#6B7280] tracking-wider">{lang === 'fil' ? 'Mga Interes' : 'Interests'}</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {customInterests.length > 0 ? customInterests.map((interest, idx) => (
                      <span key={idx} className="bg-[#E8F0FE] text-[#0F3D91] px-3 py-1 rounded-full text-xs font-medium border border-[#d4e3ff]">
                        {interest}
                      </span>
                    )) : (
                      <span className="text-sm text-[#6B7280] italic">{lang === 'fil' ? 'Walang napiling interes' : 'No interests selected'}</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-[#6B7280] tracking-wider">{lang === 'fil' ? 'Mga Galing' : 'Skills'}</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {customSkills.length > 0 ? customSkills.map((skill, idx) => (
                      <span key={idx} className="bg-[#E8F0FE] text-[#0F3D91] px-3 py-1 rounded-full text-xs font-medium border border-[#d4e3ff]">
                        {skill}
                      </span>
                    )) : (
                       <span className="text-sm text-[#6B7280] italic">{lang === 'fil' ? 'Walang napiling kakayahan' : 'No skills selected'}</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-[#6B7280] tracking-wider">{lang === 'fil' ? 'Plano' : 'Career Goal'}</span>
                  <p className="text-sm font-bold text-[#1A1A2E] mt-1">{careerGoal || <span className="italic text-[#6B7280]">{lang === 'fil' ? 'Walang sinulat na plano' : 'No goal written'}</span>}</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-matching-form"
                type="button"
                onClick={handleSubmitProfile}
                disabled={isMatching || (customInterests.length === 0 && !careerGoal)}
                className={`w-full rounded-2xl py-5 text-base font-bold shadow-lg transition-all flex items-center justify-center gap-3 ${
                  isMatching
                    ? "bg-[#fffbe6] text-[#92710a] cursor-wait border-2 border-[#FCD116]"
                    : customInterests.length === 0 && !careerGoal
                    ? "bg-[#F8F9FC] text-[#6B7280] cursor-not-allowed border-2 border-dashed border-[#e5e8ef]"
                    : "bg-[#0F3D91] hover:bg-[#1a52c4] text-white hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                }`}
              >
                {isMatching ? (
                  <>
                    <span className="animate-spin inline-block h-6 w-6 border-[3px] border-[#FCD116] border-t-transparent rounded-full" />
                    <span className="font-extrabold">{lang === "fil" ? "Sinusuri ng AI ang iyong profile..." : "AI is analyzing your profile..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>
                      {lang === "fil" 
                        ? "Hanapan Ako ng Tugmang Libreng Kurso ng TESDA!" 
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
          <div className={containerClass}>
            <div className="text-center py-12">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-[#E8F0FE]" />
                <div className="absolute inset-0 rounded-full border-4 border-[#0F3D91] border-t-transparent animate-spin" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#1A1A2E] mb-2">
                {lang === 'fil' ? 'Sinusuri ng AI...' : 'AI is analyzing...'}
              </h3>
              <p className="text-[#6B7280] transition-opacity duration-500" key={processingStepIndex}>
                {processingSteps[processingStepIndex]}
              </p>
            </div>
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
              <h4 className="font-bold text-base">{lang === 'fil' ? 'May kaunting aberya' : 'A slight issue occurred'}</h4>
              <p className="text-sm text-red-600 mt-2 leading-relaxed">{matchError}</p>
            </div>
          </div>
        )}

        {matchResult && Array.isArray(matchResult.recommendedCourses) && (
          <div id="matching-results-section" className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-[#f0fdf4] text-[#166534] font-extrabold text-xs px-4 py-2 rounded-full border border-[#bbf7d0] uppercase tracking-wider mb-4">
                <CheckCircle2 className="h-4 w-4" /> {lang === 'fil' ? 'Nakakita ng Tugma!' : 'Found a Match!'}
              </span>
              <h2 className="font-display font-extrabold text-2xl text-[#1A1A2E] sm:text-3xl">
                {lang === 'fil' ? 'Ang Iyong AI Report sa Pagtutugma ng Kurso' : 'Your AI Course Match Report'}
              </h2>
              <p className="text-sm text-[#6B7280] mt-3 leading-relaxed">
                {lang === 'fil' ? 'Narito ang sadyang dinisenyo na pagsusuri pagkatapos tingnan ang iyong edad, lokasyon, at kakayahan.' : 'Here is your personalized analysis based on your age, location, and skills.'}
              </p>
            </div>

            {/* AI Summary card */}
            <div className="bg-[#E8F0FE] border border-[#d4e3ff] rounded-3xl p-8 shadow-lg max-w-3xl mx-auto">
              <h4 className="font-display font-extrabold text-base text-[#1A1A2E] mb-4 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#0F3D91] text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                {lang === 'fil' ? 'AI Counseling Insights:' : 'AI Counseling Insights:'}
              </h4>
              <p className="text-base text-[#1A1A2E] leading-relaxed font-medium italic">
                "{matchResult.matchedSummary || (lang === 'fil' ? 'Walang summary available.' : 'No summary available.')}"
              </p>
            </div>

            {/* Courses Match List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="matching-recommendation-grid">
              {matchResult.recommendedCourses.map((recCourse, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl border border-[#e5e8ef] shadow-[0_4px_32px_rgba(15,61,145,0.07)] overflow-hidden hover:shadow-lg transition-all flex flex-col h-full card-hover group"
                >
                  {/* Percent badge heading */}
                  <div className="bg-[#F8F9FC] px-6 py-5 border-b border-[#e5e8ef] flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      {lang === 'fil' ? 'Inirerekomendang Tugma' : 'Recommended Match'} #{idx + 1}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-sm font-bold px-3 py-1.5 rounded-full bg-[#0F3D91] text-white">
                      {recCourse.matchScore}% {lang === 'fil' ? 'Tugma' : 'Match'}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-block text-xs font-extrabold font-mono text-[#0F3D91] bg-[#E8F0FE] px-3 py-1.5 rounded-lg border border-[#d4e3ff]">
                        {lang === 'fil' ? 'Kodigo' : 'Code'}: {recCourse.courseCode}
                      </span>
                      <h3 className="font-display font-bold text-lg text-[#1A1A2E] mt-4 leading-tight">
                        {recCourse.courseName}
                      </h3>
                      
                      <p className="text-sm text-[#6B7280] mt-4 leading-relaxed bg-[#F8F9FC] p-4 rounded-2xl border border-[#e5e8ef]">
                        <strong className="text-[#1A1A2E]">{lang === 'fil' ? 'Bakit para sa iyo:' : 'Why it\'s for you:'}</strong> "{recCourse.reasonForYouth}"
                      </p>
                    </div>

                    <div className="mt-8 pt-5 border-t border-[#e5e8ef] space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-[#E8F0FE] text-[#0F3D91] mt-0.5">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-[#6B7280] font-semibold">{lang === 'fil' ? 'Oportunidad sa Trabaho' : 'Job Opportunity'}</span>
                          <span className="block text-sm font-extrabold text-[#0F3D91] mt-1">{recCourse.immediateJobTitle}</span>
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
                          className="flex-1 rounded-2xl bg-[#0F3D91] hover:bg-[#1a52c4] text-white font-bold text-sm py-3 text-center flex items-center justify-center gap-2 shadow-md shadow-[#E8F0FE] hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{lang === 'fil' ? 'Itanong sa Chat' : 'Ask in Chat'}</span>
                        </button>
                        <button
                          id={`btn-match-explore-course-${recCourse.courseCode}`}
                          onClick={() => {
                            if (onExploreCourse) {
                              onExploreCourse(recCourse.courseCode, matchResult?.targetSectors);
                            }
                          }}
                          className="rounded-2xl border border-[#d4e3ff] text-[#0F3D91] hover:bg-[#E8F0FE] font-bold text-sm px-5 hover:-translate-y-0.5 transition-all"
                        >
                          {lang === 'fil' ? 'Detalye' : 'Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enrollment Tips & Next Steps */}
            <div className="bg-[#0F3D91] rounded-3xl p-5 md:p-8 text-white border border-[#0F3D91]/20 shadow-[0_4px_32px_rgba(15,61,145,0.15)] mt-10 relative overflow-hidden" id="matching-result-enrollment-card">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FCD116]/10 rounded-full blur-3xl" />
              
              <div className="relative flex flex-col md:flex-row gap-8 items-start justify-between">
                <div className="max-w-2xl">
                    <h3 className="font-display font-black text-xl text-[#FCD116] flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    {lang === 'fil' ? 'Mahalagang Hakbang ukol sa Iskolarsyip at Allowance:' : 'Important Steps for Scholarship & Allowance:'}
                  </h3>
                  <p className="text-sm text-white/70 mt-4 leading-relaxed">
                    {matchResult.faqTip || (lang === 'fil' ? 'Pumunta sa pinakamalapit na TESDA Regional/Provincial Office upang mag-apply ng libreng scholarship.' : 'Go to the nearest TESDA Regional/Provincial Office to apply for a free scholarship.')}
                  </p>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-white/10 rounded-2xl p-5 border border-white/20 space-y-2 hover:bg-white/15 transition-all">
                      <span className="block text-xs text-white/60 font-bold uppercase tracking-wider">{lang === 'fil' ? 'Kailangang Dokumento #1' : 'Required Document #1'}</span>
                      <span className="block text-sm font-bold text-white">PSA Birth Certificate</span>
                      <span className="block text-xs text-white/60">{lang === 'fil' ? 'Patunay na ikaw ay Pilipino at sapat sa edad.' : 'Proof of Filipino citizenship and age eligibility.'}</span>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-5 border border-white/20 space-y-2 hover:bg-white/15 transition-all">
                      <span className="block text-xs text-white/60 font-bold uppercase tracking-wider">{lang === 'fil' ? 'Kailangang Dokumento #2' : 'Required Document #2'}</span>
                      <span className="block text-sm font-bold text-white">{lang === 'fil' ? 'Diploma o ALS Certificate' : 'Diploma or ALS Certificate'}</span>
                      <span className="block text-xs text-white/60">{lang === 'fil' ? 'Kung wala pa, sertipiko ng kahirapan mula sa barangay ay tinatanggap.' : 'If unavailable, a barangay certificate of indigency is accepted.'}</span>
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
                    className="rounded-2xl bg-[#FCD116] hover:bg-[#c9a700] text-[#1A1A2E] font-bold text-sm py-4 px-6 flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <span>{lang === 'fil' ? 'Kausapin ang AI Tagapayo' : 'Chat with AI Counselor'}</span>
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
                    {lang === 'fil' ? 'Tingnan ang Buong Gabay sa FAQ' : 'View Full FAQ Guide'}
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
                className="rounded-2xl bg-[#E8F0FE] hover:bg-[#d4e3ff] text-[#0F3D91] font-bold text-sm py-3 px-6 transition-all"
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
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#e5e8ef]">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all touch-manipulation ${
              isFirstStep
                ? 'bg-[#F8F9FC] text-[#e5e8ef] cursor-not-allowed'
                : 'bg-[#E8F0FE] text-[#0F3D91] hover:bg-[#d4e3ff] shadow-sm hover:shadow-md'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === 'fil' ? 'Bumalik' : 'Back'}
          </button>

          <div className="text-sm text-[#6B7280] font-medium">
            {lang === 'fil' ? `Hakbang ${stepIndex + 1} ng ${stepOrder.length}` : `Step ${stepIndex + 1} of ${stepOrder.length}`}
          </div>

          {!isReview && (
            <button
              onClick={nextStep}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all touch-manipulation ${
                isNextValid
                  ? 'bg-[#0F3D91] text-white hover:bg-[#1a52c4] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-[#F8F9FC] text-[#6B7280] cursor-not-allowed opacity-50'
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
      
      <div className="bg-white rounded-2xl border border-[#e5e8ef] shadow-[0_4px_32px_rgba(15,61,145,0.07)] overflow-hidden">
        <div className="h-1.5 bg-[#0F3D91]" />
        <div className="p-6 md:p-8">
          {renderStepContent()}
          {renderNavigation()}
        </div>
      </div>
    </div>
  );
}
