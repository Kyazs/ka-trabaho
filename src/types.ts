export interface UserProfile {
  age: number;
  education: string;
  region: string;
  province: string;
  interests: string;
  practicalSkills: string;
  careerGoal: string;
}

export interface RecommendationCourse {
  courseCode: string;
  courseName: string;
  matchScore: number;
  reasonForYouth: string;
  immediateJobTitle: string;
}

export interface MatchingResult {
  matchedSummary: string;
  targetSectors: string[];
  recommendedCourses: RecommendationCourse[];
  faqTip: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export type WizardStep = 'basic' | 'interests' | 'skills' | 'goal' | 'review' | 'processing' | 'results';

export interface ProfileMiniFormProps {
  lang: "fil" | "en";
  customInterests: string[];
  customSkills: string[];
  careerGoal: string;
  setCareerGoal: (goal: string) => void;
  interestInput: string;
  setInterestInput: (input: string) => void;
  skillInput: string;
  setSkillInput: (input: string) => void;
  handleAddCustomInterest: (e: React.FormEvent) => void;
  handleAddCustomSkill: (e: React.FormEvent) => void;
  toggleInterestTag: (interest: string) => void;
  toggleSkillTag: (skill: string) => void;
  QUICK_INTERESTS: { label: string; category: string }[];
  QUICK_SKILLS: { label: string; category: string }[];
  onGoToFullAssessment?: () => void;
}

export interface AssessmentWizardProps {
  age: number;
  setAge: (age: number) => void;
  education: string;
  setEducation: (education: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedProvince: string;
  setSelectedProvince: (province: string) => void;
  selectedProvincesList: string[];
  customInterests: string[];
  setCustomInterests: (interests: string[]) => void;
  customSkills: string[];
  setCustomSkills: (skills: string[]) => void;
  careerGoal: string;
  setCareerGoal: (goal: string) => void;
  careerGoalError?: string | null;
  interestInput: string;
  setInterestInput: (input: string) => void;
  skillInput: string;
  setSkillInput: (input: string) => void;
  handleAddCustomInterest: (e: React.FormEvent) => void;
  handleAddCustomSkill: (e: React.FormEvent) => void;
  toggleInterestTag: (interest: string) => void;
  toggleSkillTag: (skill: string) => void;
  handleRegionChange: (regionCode: string) => void;
  handleSubmitProfile: () => void;
  isMatching: boolean;
  matchResult: MatchingResult | null;
  matchError: string | null;
  lang: "fil" | "en";
  QUICK_INTERESTS: { label: string; category: string }[];
  QUICK_SKILLS: { label: string; category: string }[];
  PHILIPPINES_REGIONS: { code: string; name: string; provinces: string[]; topSectors: string[] }[];
  onChatAboutCourse?: (courseCode: string, courseName: string) => void;
  onExploreCourse?: (courseCode: string, targetSectors?: string[]) => void;
  onGoToChat?: () => void;
  onGoToFaq?: () => void;
}
