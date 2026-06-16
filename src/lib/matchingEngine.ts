import { SECTORS_DATA, PHILIPPINES_REGIONS } from '../data/tesdaData';
import type { ScoredCourse, ScoredJob, JobMatchCourse } from '../types';

const SYNONYM_MAP: Record<string, string[]> = {
  "fixing": ["repair", "maintenance", "troubleshoot", "servicing"],
  "cooking": ["culinary", "cookery", "kitchen", "baking", "food prep"],
  "caring": ["caregiving", "caregiver", "nursing", "elderly", "pediatric"],
  "computer": ["pc", "hardware", "software", "it", "digital", "tech"],
  "gaming": ["technology", "animation", "3d", "digital"],
  "elders": ["elderly", "geriatric", "senior", "aged"],
  "building": ["construction", "welding", "electrical", "plumbing", "infrastructure"],
  "driving": ["automotive", "vehicle", "car", "transport", "mechanic"],
  "massage": ["therapy", "wellness", "spa", "therapeutic"],
  "coffee": ["barista", "espresso", "cafe", "beverage"],
  "farming": ["agriculture", "organic", "crop", "livestock", "nursery"],
  "art": ["design", "graphic", "creative", "visual", "layout", "illustration"],
  "video": ["editing", "production", "content", "filmmaking", "cinematography"],
  "electricity": ["electrical", "wiring", "circuit", "power", "conduit"],
  "welding": ["metalwork", "sma", "fabrication", "structural"],
  "plumbing": ["pipe", "water", "drainage", "sanitary"],
  "english": ["communication", "language", "speaking", "bpo", "call center"],
  "customer": ["service", "hospitality", "tourism", "client", "guest"],
};

const EDUCATION_LEVELS: Record<string, number> = {
  "College Level Undergrad": 4,
  "College Graduate": 5,
  "Senior High School Graduate": 3,
  "Junior High School Graduate": 2,
  "Junior High Undergrad": 1.5,
  "ALS Graduate": 3,
  "Elementary Graduate": 1,
  "Elementary Undergrad": 0.5,
};

const GENERIC_REASONS: Record<string, { fil: string; en: string }> = {
  "interest_match": {
    fil: "Bagay sa iyong interes ang kurso na ito!",
    en: "This course matches your interests!"
  },
  "skill_match": {
    fil: "Ang mga kasanayan mo ay akma sa skills na ituturo dito.",
    en: "Your existing skills align well with what this course teaches."
  },
  "region_hot": {
    fil: "Maraming trabaho ang available sa sector na ito sa iyong rehiyon.",
    en: "There are plenty of jobs in this sector in your region."
  },
  "education_eligible": {
    fil: "Kwalipikado ka na para mag-enroll base sa iyong pinag-aralan.",
    en: "You're eligible to enroll based on your education level."
  },
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

function expandWithSynonyms(tokens: string[]): Set<string> {
  const expanded = new Set<string>(tokens);
  for (const token of tokens) {
    const synonyms = SYNONYM_MAP[token];
    if (synonyms) {
      for (const syn of synonyms) {
        expanded.add(syn);
      }
    }
    for (const [key, values] of Object.entries(SYNONYM_MAP)) {
      if (values.includes(token)) {
        expanded.add(key);
        for (const v of values) expanded.add(v);
      }
    }
  }
  return expanded;
}

function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function findCourse(code: string) {
  for (const sector of SECTORS_DATA) {
    const course = sector.courses.find(c => c.code === code);
    if (course) return { course, sectorId: sector.id };
  }
  return null;
}

function checkEducationEligibility(education: string, entryReqEn: string): number {
  const eduLevel = EDUCATION_LEVELS[education] ?? 2;
  const reqLower = entryReqEn.toLowerCase();

  if (reqLower.includes("no specific") || reqLower.includes("no requirement")) return 100;
  if (reqLower.includes("basic computer") || reqLower.includes("basic understanding")) return eduLevel >= 1 ? 100 : 30;
  if (reqLower.includes("elementary")) return eduLevel >= 1 ? 100 : 30;
  if (reqLower.includes("junior high")) return eduLevel >= 2 ? 100 : 30;
  if (reqLower.includes("high school") || reqLower.includes("shs")) return eduLevel >= 3 ? 100 : 50;
  if (reqLower.includes("als")) return eduLevel >= 1.5 ? 100 : 50;
  if (reqLower.includes("css nc ii") || reqLower.includes("has css")) return eduLevel >= 2 ? 80 : 30;
  if (reqLower.includes("may") || reqLower.includes("interest") || reqLower.includes("talent") || reqLower.includes("physically")) return eduLevel >= 1 ? 100 : 50;

  return eduLevel >= 2 ? 80 : 40;
}

export function scoreCourses(
  profile: { interests: string[]; practicalSkills: string[]; careerGoal: string; education: string; region: string },
  limit: number = 6
): ScoredCourse[] {
  const regionInfo = PHILIPPINES_REGIONS.find(r => r.code === profile.region);
  const topSectorIds = new Set(regionInfo?.topSectors || []);

  const interestTokens = expandWithSynonyms(tokenize(
    [...profile.interests, profile.careerGoal].filter(Boolean).join(' ')
  ));
  const skillTokens = expandWithSynonyms(tokenize(
    profile.practicalSkills.join(' ')
  ));

  const results: ScoredCourse[] = [];

  for (const sector of SECTORS_DATA) {
    for (const course of sector.courses) {
      const courseSkillTokens = expandWithSynonyms(tokenize(course.skillsAcquired.join(' ')));
      const courseDescTokens = expandWithSynonyms(tokenize(course.description));

      const interestScore = jaccardSimilarity(interestTokens, new Set([...courseSkillTokens, ...courseDescTokens]));
      const skillScore = jaccardSimilarity(skillTokens, courseSkillTokens);

      const entryReqEn = typeof course.entryReq === 'string' ? course.entryReq : course.entryReq.en;
      const eduScore = checkEducationEligibility(profile.education, entryReqEn) / 100;

      const regionScore = topSectorIds.has(sector.id) ? 1.0 : 0.4;

      const rawScore = (interestScore * 0.40) + (skillScore * 0.30) + (eduScore * 0.20) + (regionScore * 0.10);
      const finalScore = Math.round(Math.min(99, Math.max(0, rawScore * 100)));

      const primaryJob = sector.jobs.find(j => j.mappedCourses.includes(course.code));
      const immediateJobTitle = primaryJob?.title || sector.jobs[0]?.title || "";

      const reasonKeys: string[] = [];
      if (interestScore > 0.05) reasonKeys.push("interest_match");
      if (skillScore > 0.05) reasonKeys.push("skill_match");
      if (regionScore > 0.5) reasonKeys.push("region_hot");
      if (eduScore >= 0.8) reasonKeys.push("education_eligible");
      if (reasonKeys.length === 0) reasonKeys.push("education_eligible");

      results.push({
        code: course.code,
        localScore: finalScore,
        reasonKeys,
        name: course.name,
        level: course.level,
        duration: course.duration,
        sectorId: sector.id,
        immediateJobTitle,
      });
    }
  }

  results.sort((a, b) => b.localScore - a.localScore);
  return results.slice(0, limit);
}

export function scoreJobs(
  profile: { interests: string[]; practicalSkills: string[]; careerGoal: string; education: string; region: string },
  limit: number = 5
): ScoredJob[] {
  const regionInfo = PHILIPPINES_REGIONS.find(r => r.code === profile.region);
  const topSectorIds = new Set(regionInfo?.topSectors || []);

  const interestTokens = expandWithSynonyms(tokenize(
    [...profile.interests, profile.careerGoal].filter(Boolean).join(' ')
  ));
  const skillTokens = expandWithSynonyms(tokenize(
    profile.practicalSkills.join(' ')
  ));

  const results: ScoredJob[] = [];

  for (const sector of SECTORS_DATA) {
    for (const job of sector.jobs) {
      const courseSkillSets = job.mappedCourses.map(code => {
        const found = findCourse(code);
        return found ? tokenize(found.course.skillsAcquired.join(' ')) : [];
      });
      const allJobSkills = expandWithSynonyms(courseSkillSets.flat());
      const jobDescTokens = expandWithSynonyms(tokenize(job.description));

      const interestScore = jaccardSimilarity(interestTokens, new Set([...allJobSkills, ...jobDescTokens]));
      const skillScore = jaccardSimilarity(skillTokens, allJobSkills);

      const highestEduReq = job.mappedCourses.map(code => {
        const found = findCourse(code);
        if (!found) return 0.5;
        const reqEn = typeof found.course.entryReq === 'string' ? found.course.entryReq : found.course.entryReq.en;
        return checkEducationEligibility(profile.education, reqEn) / 100;
      });
      const eduScore = Math.max(0, ...highestEduReq);

      const regionScore = topSectorIds.has(sector.id) ? 1.0 : 0.4;

      const rawScore = (interestScore * 0.40) + (skillScore * 0.30) + (eduScore * 0.20) + (regionScore * 0.10);
      const finalScore = Math.round(Math.min(99, Math.max(0, rawScore * 100)));

      const reasonKeys: string[] = [];
      if (interestScore > 0.05) reasonKeys.push("interest_match");
      if (skillScore > 0.05) reasonKeys.push("skill_match");
      if (regionScore > 0.5) reasonKeys.push("region_hot");
      if (eduScore >= 0.8) reasonKeys.push("education_eligible");
      if (reasonKeys.length === 0) reasonKeys.push("region_hot");

      const requiredCourses: JobMatchCourse[] = job.mappedCourses.map(code => {
        const found = findCourse(code);
        return found ? { name: found.course.name, code: found.course.code, duration: found.course.duration, sectorId: found.sectorId } : { name: code, code, duration: "", sectorId: sector.id };
      });

      results.push({
        code: job.mappedCourses[0] || sector.id,
        localScore: finalScore,
        reasonKeys,
        jobTitle: job.title,
        sectorId: sector.id,
        averageSalary: job.averageSalary,
        demandLevel: job.demandLevel,
        description: job.description,
        requiredCourses,
      });
    }
  }

  results.sort((a, b) => b.localScore - a.localScore);
  return results.slice(0, limit);
}

export function buildGenericReason(reasonKeys: string[], lang: "fil" | "en"): string {
  const reasons = reasonKeys
    .map(key => GENERIC_REASONS[key]?.[lang])
    .filter(Boolean);
  return reasons.length > 0 ? reasons.join(' ') : (lang === "fil" ? "Akma ito sa iyong profile." : "This matches your profile.");
}

export function localCourseResult(lang: "fil" | "en", scored: ScoredCourse[]) {
  return {
    matchedSummary: lang === "fil"
      ? "Narito ang mga kurso na akma sa iyong profile base sa aming smart matching. Para sa mas personalized na rekomendasyon, subukan muli kapag online ang AI counselor."
      : "Here are courses matched to your profile using smart matching. For more personalized recommendations, try again when the AI counselor is online.",
    targetSectors: [...new Set(scored.map(s => s.sectorId))],
    recommendedCourses: scored.map(s => ({
      courseCode: s.code,
      courseName: s.name,
      matchScore: s.localScore,
      reasonForYouth: buildGenericReason(s.reasonKeys, lang),
      immediateJobTitle: s.immediateJobTitle,
    })),
    faqTip: lang === "fil"
      ? "Pumunta sa pinakamalapit na TESDA Regional/Provincial Office upang mag-apply ng libreng scholarship at ₱160 daily allowance!"
      : "Visit your nearest TESDA Regional/Provincial Office to apply for free scholarship and ₱160 daily allowance!",
    _isLocalFallback: true,
  };
}

export function localJobResult(lang: "fil" | "en", scored: ScoredJob[]) {
  return {
    matchedSummary: lang === "fil"
      ? "Narito ang mga trabahong akma sa iyong profile base sa smart matching. Para sa mas detalyadong rekomendasyon, subukan muli kapag online ang AI."
      : "Here are jobs matched to your profile using smart matching. For detailed recommendations, try again when the AI is online.",
    recommendedJobs: scored.map(s => ({
      jobTitle: s.jobTitle,
      matchScore: s.localScore,
      reasonForYouth: buildGenericReason(s.reasonKeys, lang),
      sectorId: s.sectorId,
      averageSalary: s.averageSalary,
      demandLevel: s.demandLevel,
      description: s.description,
      requiredCourses: s.requiredCourses,
    })),
    faqTip: lang === "fil"
      ? "Bisitahin ang pinakamalapit na TESDA office o PESO para sa job placement assistance."
      : "Visit your nearest TESDA office or PESO for job placement assistance.",
    _isLocalFallback: true,
  };
}
