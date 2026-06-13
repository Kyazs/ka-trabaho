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
