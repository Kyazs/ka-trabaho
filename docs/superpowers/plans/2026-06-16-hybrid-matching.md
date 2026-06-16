# Hybrid Matching Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the TESDA data file with enhanced data, build a client-side weighted scoring engine, and integrate it as a pre-filter before AI calls to improve match quality and enable offline fallback.

**Architecture:** Frontend runs local scoring (interest overlap, skill overlap, education eligibility, region fit) to produce top candidates. These candidates are sent alongside the user profile to the AI API, which personalizes Taglish reasons instead of searching the full catalog. When AI fails, local scores + generic reasons are shown directly.

**Tech Stack:** TypeScript, React, Vercel serverless functions, Fireworks AI (kimi-k2p7-code), Zod

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/data/tesdaData.ts` | Replace with enhanced data, add `islandGroup`, add new optional fields to interfaces |
| Delete | `src/data/tesdaData_enhanced.ts` | No longer needed after swap |
| Create | `src/lib/matchingEngine.ts` | Pure scoring functions: `scoreCourses`, `scoreJobs`, synonym map, education rules, generic reason map |
| Modify | `src/types.ts` | Add `ScoredCandidate`, `ScoredCourse`, `ScoredJob` types |
| Modify | `src/App.tsx` | Add `Car`/`Palette` icons, integrate local scoring before API calls, offline fallback, offline banner |
| Modify | `api/lib/api-utils.ts` | Fix `entryReq` serialization, update `getTesdaGroundingContext`, update fallback constants |
| Modify | `api/recommendation.ts` | Accept `candidates` in request, update system prompt to candidate-based |
| Modify | `api/job-recommendation.ts` | Accept `candidates` in request, update system prompt |
| Modify | `api/chat.ts` | Accept `topMatchedCourses` in userProfile |
| Modify | `api/lib/api-middleware.ts` | Extend Zod schemas to accept `candidates` and `topMatchedCourses` |

---

### Task 1: Add New Types to `src/types.ts`

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Add ScoredCandidate, ScoredCourse, and ScoredJob types**

Append after the existing `JobMatchResult` interface (after line 54):

```typescript
export interface ScoredCandidate {
  code: string;
  localScore: number;
  reasonKeys: string[];
}

export interface ScoredCourse extends ScoredCandidate {
  name: string;
  level: string;
  duration: string;
  sectorId: string;
  immediateJobTitle: string;
}

export interface ScoredJob extends ScoredCandidate {
  jobTitle: string;
  sectorId: string;
  averageSalary: string;
  demandLevel: string;
  description: string;
  requiredCourses: JobMatchCourse[];
}
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors (types only, no usage yet)

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add ScoredCandidate, ScoredCourse, ScoredJob types"
```

---

### Task 2: Swap Data File with Enhanced Data

**Files:**
- Modify: `src/data/tesdaData.ts`
- Delete: `src/data/tesdaData_enhanced.ts`

- [ ] **Step 1: Replace `tesdaData.ts` content with enhanced data, adding missing fields**

Copy all content from `tesdaData_enhanced.ts` into `tesdaData.ts` with these modifications:

1. Add `islandGroup` field to `RegionInfo` interface:
```typescript
export interface RegionInfo {
  code: string;
  name: string;
  provinces: string[];
  topSectors: string[];
  islandGroup: "Luzon" | "Visayas" | "Mindanao";
}
```

2. Add `islandGroup` to every region object:
- Luzon: NCR, CAR, R1, R2, R3, R4A, R4B, R5 → `islandGroup: "Luzon"`
- Visayas: R6, R7, R8 → `islandGroup: "Visayas"`
- Mindanao: R9, R10, R11, R12, R13, BARMM → `islandGroup: "Mindanao"`

3. Add optional fields to `TesdaCourse` interface:
```typescript
assessmentFee?: string;
overseasPathway?: string;
```

4. Add optional field to `JobRole` interface:
```typescript
overseasSalary?: string;
```

- [ ] **Step 2: Delete `tesdaData_enhanced.ts`**

Run: `Remove-Item -LiteralPath "src\data\tesdaData_enhanced.ts"`

- [ ] **Step 3: Fix the `R9` provinces duplicate**

The enhanced data already cleaned the R9 duplicate ("Zamboanga City" standalone removed). Verify the R9 entry has exactly 3 provinces:
```
"Zamboanga del Sur (Zamboanga City, Pagadian)",
"Zamboanga del Norte (Dipolog, Dapitan)",
"Zamboanga Sibugay (Ipil)"
```

- [ ] **Step 4: Run typecheck**

Run: `npx tsc --noEmit`
Expected: Errors in `api-utils.ts` because `entryReq` is now an object. That's expected — Task 3 fixes it.

- [ ] **Step 5: Commit**

```bash
git add src/data/tesdaData.ts
git rm src/data/tesdaData_enhanced.ts
git commit -m "feat: swap to enhanced TESDA data (7 sectors, 19 courses, 15 jobs, 8 FAQs)"
```

---

### Task 3: Fix `entryReq` Serialization in API Utils

**Files:**
- Modify: `api/lib/api-utils.ts`

- [ ] **Step 1: Fix `getTesdaGroundingContext` entryReq serialization**

In `api/lib/api-utils.ts`, the line that reads:
```typescript
context += `      Entry Requirements: ${course.entryReq}\n`;
```

Change to:
```typescript
context += `      Entry Requirements: ${typeof course.entryReq === 'string' ? course.entryReq : course.entryReq.en}\n`;
```

This handles both the old string format (backward compat) and the new `{fil, en}` object format.

- [ ] **Step 2: Update fallback constants with new course codes**

Replace `FALLBACK_RECOMMENDATION`:
```typescript
export const FALLBACK_RECOMMENDATION = {
  matchedSummary: "Mabuhay! Si Ka-TrabaHO ay naghanda ng pangkalahatang rekomendasyon base sa iyong profile. Para sa mas detalyadong counseling, maaari mong kausapin ang AI counselor sa 'Chat kay Ka-TrabaHO' tab.",
  targetSectors: ["ict", "tourism"],
  recommendedCourses: [
    {
      courseCode: "ICT-CSS2",
      courseName: "Computer Systems Servicing NC II",
      matchScore: 90,
      reasonForYouth: "Dahil hilig mo ang teknolohiya at computer games, bagay sa iyo ang pagse-setup at pag-repair ng computer networks!",
      immediateJobTitle: "Technical Support / Help Desk Representative (BPO)"
    },
    {
      courseCode: "ICT-CCS2",
      courseName: "Contact Center Services NC II",
      matchScore: 85,
      reasonForYouth: "Kung marunong kang makipag-usap at may clear na diction, mabilis makakuha ng trabaho sa BPO — ang pinakamalaking employer ng TVET grads!",
      immediateJobTitle: "BPO Customer Service / Chat Support Agent"
    }
  ],
  faqTip: "Pumunta sa pinakamalapit na TESDA Regional/Provincial Office upang mag-apply ng libreng scholarship at ₱160 daily allowance!"
};
```

Replace `FALLBACK_JOB_RECOMMENDATION`:
```typescript
export const FALLBACK_JOB_RECOMMENDATION = {
  matchedSummary: "Mabuhay! Batay sa iyong profile, narito ang mga posibleng trabaho na akma sa iyong kakayahan. Para sa mas detalyadong job matching, maaari mong kausapin ang AI counselor.",
  recommendedJobs: [
    {
      jobTitle: "Technical Support / Help Desk Representative (BPO)",
      matchScore: 90,
      reasonForYouth: "Dahil may interes ka sa teknolohiya at computer, ang BPO tech support ay magandang simula — maraming openings sa NCR, Cebu, at Iloilo.",
      sectorId: "ict",
      requiredCourseCodes: ["ICT-CSS2", "ICT-CCS2"]
    },
    {
      jobTitle: "BPO Customer Service / Chat Support Agent",
      matchScore: 85,
      reasonForYouth: "Kung magaling kang makipag-usap, ang BPO industry ang pinakamabilis na daan patungo sa trabaho — entry-level na ₱18K-₱26K/month.",
      sectorId: "ict",
      requiredCourseCodes: ["ICT-CCS2"]
    }
  ],
  faqTip: "Pumunta sa pinakamalapit na TESDA Regional/Provincial Office para sa libreng assessment at job placement assistance."
};
```

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors related to `entryReq` or fallbacks.

- [ ] **Step 4: Commit**

```bash
git add api/lib/api-utils.ts
git commit -m "fix: entryReq object serialization in AI grounding context, update fallbacks"
```

---

### Task 4: Add Missing Sector Icons to `App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add `Car` and `Palette` import**

In the lucide-react import block (line 5-29), add `Car` and `Palette` to the import list:

```typescript
import { 
  Sparkles, 
  MapPin, 
  GraduationCap, 
  Search, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Briefcase, 
  DollarSign, 
  Award, 
  BadgeHelp,
  Hammer,
  Laptop,
  Utensils,
  Sprout,
  HeartPulse,
  Car,
  Palette,
  Info,
  FileText,
  AlertTriangle,
  Trash2,
  ChevronDown,
  ChevronUp,
  type LucideIcon
} from "lucide-react";
```

- [ ] **Step 2: Add icon cases to `getSectorIcon`**

In the `getSectorIcon` function (around line 60), add two new cases before the default:

```typescript
case "Car":
  return <Car className="h-6 w-6 text-kt-gold" />;
case "Palette":
  return <Palette className="h-6 w-6 text-kt-chat-purple" />;
```

Note: `text-kt-chat-purple` is already defined in the Tailwind config (used for micro-credential badges). If it's not available as a text color, use `text-purple-600` instead.

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add Car and Palette sector icons for automotive and creative sectors"
```

---

### Task 5: Build the Matching Engine

**Files:**
- Create: `src/lib/matchingEngine.ts`

- [ ] **Step 1: Create the matching engine module**

Create `src/lib/matchingEngine.ts` with the full implementation:

```typescript
import { SECTORS_DATA, PHILIPPINES_REGIONS, type TesdaCourse, type JobRole, type Sector } from '../data/tesdaData';
import type { ScoredCourse, ScoredJob } from '../types';

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
  "College Graduate": 5,
  "Vocational College Undergraduate": 4,
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
        const course = sector.courses.find(c => c.code === code);
        return course ? tokenize(course.skillsAcquired.join(' ')) : [];
      });
      const allJobSkills = expandWithSynonyms(new Set(courseSkillSets.flat()));
      const jobDescTokens = expandWithSynonyms(tokenize(job.description));

      const interestScore = jaccardSimilarity(interestTokens, new Set([...allJobSkills, ...jobDescTokens]));
      const skillScore = jaccardSimilarity(skillTokens, allJobSkills);

      const highestEduReq = job.mappedCourses.map(code => {
        const course = sector.courses.find(c => c.code === code);
        if (!course) return 0.5;
        const reqEn = typeof course.entryReq === 'string' ? course.entryReq : course.entryReq.en;
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

      const requiredCourses = job.mappedCourses.map(code => {
        const course = sector.courses.find(c => c.code === code);
        return course ? { name: course.name, code: course.code, duration: course.duration, sectorId: sector.id } : { name: code, code, duration: "", sectorId: sector.id };
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
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/matchingEngine.ts
git commit -m "feat: add client-side weighted scoring matching engine"
```

---

### Task 6: Extend API Zod Schemas for Candidates

**Files:**
- Modify: `api/lib/api-middleware.ts`

- [ ] **Step 1: Add ScoredCandidate schema and extend ProfileSchema**

After `ChatMessageSchema` (line 88), add:

```typescript
export const ScoredCandidateSchema = z.object({
  code: z.string().max(20),
  localScore: z.number().int().min(0).max(99),
  reasonKeys: z.array(z.string().max(30)).max(5),
});
```

Change `RecommendationSchema` (line 97) from:
```typescript
export const RecommendationSchema = ProfileSchema;
```
to:
```typescript
export const RecommendationSchema = ProfileSchema.extend({
  candidates: z.array(ScoredCandidateSchema).max(6).optional(),
});
```

Change `JobRecommendationSchema` (line 96) from:
```typescript
export const JobRecommendationSchema = ProfileSchema;
```
to:
```typescript
export const JobRecommendationSchema = ProfileSchema.extend({
  candidates: z.array(ScoredCandidateSchema).max(5).optional(),
});
```

Extend `ChatSchema` (line 90) to accept `topMatchedCourses` in `userProfile`:
```typescript
export const ChatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(ChatMessageSchema).max(MAX_HISTORY_LENGTH).optional(),
  userProfile: ProfileSchema.extend({
    topMatchedCourses: z.array(z.string().max(20)).max(3).optional(),
  }).optional(),
});
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: May show errors in recommendation.ts / job-recommendation.ts referencing `candidates` from validation data — that's expected, Task 7 fixes those.

- [ ] **Step 3: Commit**

```bash
git add api/lib/api-middleware.ts
git commit -m "feat: extend Zod schemas to accept candidates and topMatchedCourses"
```

---

### Task 7: Update Recommendation API for Candidate-Based Prompt

**Files:**
- Modify: `api/recommendation.ts`

- [ ] **Step 1: Extract candidates from validated data**

After the destructuring of validation data (around line 62), add:

```typescript
const candidates = validation.data.candidates;
```

- [ ] **Step 2: Update system prompt to be candidate-based**

Replace the existing system prompt string. When candidates are present, use a focused prompt; when absent, fall back to full catalog:

```typescript
const candidateContext = candidates && candidates.length > 0
  ? `The local matching engine has already pre-scored these candidates for this student. Your job is to:
1. Confirm these are good matches or suggest better alternatives from the full catalog if one is clearly wrong
2. Write warm, personalized Taglish reasons for each recommended course
3. Adjust matchScores if you think they should be different (keep between 70-99)

Pre-scored candidates:
${candidates.map(c => `- [${c.code}] Score: ${c.localScore}/99 (Reasons: ${c.reasonKeys.join(', ')})`).join('\n')}`
  : 'No pre-scored candidates provided. Find the best matches from the full catalog below.';

const systemPrompt = `STRICT JSON OUTPUT REQUIRED. You must return ONLY a valid JSON object. No markdown, no code blocks, no extra text, no explanations outside the JSON.

You are a Filipino vocational counselor specialist mapping out-of-school youth (aged 15-24) to available free TESDA courses in their province.
Your tone should be highly encouraging, warm, conversational, and use friendly Taglish (Tagalog-English mix) appropriate for young adults.

${candidateContext}

Utilize the following catalog for truth-checking and as the source of all course details:
${groundContext}

The JSON must match this exact schema with NO extra fields, NO markdown formatting, and NO text before or after the JSON:
{
  "matchedSummary": "string (warm, encouraging overview in Taglish, 2-3 sentences)",
  "targetSectors": ["string array of sector IDs like 'ict', 'tourism', 'construction'"],
  "recommendedCourses": [
    {
      "courseCode": "string (e.g. ICT-CSS2)",
      "courseName": "string (full course name)",
      "matchScore": number (70-99),
      "reasonForYouth": "string (warm, personalized reason in Taglish, 1-2 sentences)",
      "immediateJobTitle": "string (job they can get after this course)"
    }
  ],
  "faqTip": "string (practical next step advice in Taglish)"
}

Recommend 2 to 3 specific TESDA courses with matchScore between 70 and 99. Return ONLY valid JSON, no other text.`;
```

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors in recommendation.ts

- [ ] **Step 4: Commit**

```bash
git add api/recommendation.ts
git commit -m "feat: candidate-based AI prompt for course recommendations"
```

---

### Task 8: Update Job Recommendation API for Candidate-Based Prompt

**Files:**
- Modify: `api/job-recommendation.ts`

- [ ] **Step 1: Extract candidates from validated data**

After the destructuring of validation data (around line 57), add:

```typescript
const candidates = validation.data.candidates;
```

- [ ] **Step 2: Update system prompt to be candidate-based**

Replace the existing system prompt. Same pattern as Task 7 — when candidates exist, focus the AI on personalizing them:

```typescript
const candidateContext = candidates && candidates.length > 0
  ? `The local matching engine has already pre-scored these job candidates for this student. Your job is to:
1. Confirm these are good matches or suggest better alternatives from the full catalog
2. Write warm, personalized Taglish reasons for each recommended job
3. Adjust matchScores if needed (keep between 70-99)

Pre-scored job candidates:
${candidates.map(c => `- [${c.code}] ${c.localScore}/99 (Reasons: ${c.reasonKeys.join(', ')})`).join('\n')}`
  : 'No pre-scored candidates provided. Find the best matches from the full catalog below.';

const systemPrompt = `STRICT JSON OUTPUT REQUIRED. You must return ONLY a valid JSON object. No markdown, no code blocks, no extra text, no explanations outside the JSON.

You are a Filipino career counselor specializing in TESDA vocational job placement for out-of-school youth (aged 15-24) in the Philippines.
Your tone should be highly encouraging, warm, conversational, and use friendly Taglish (Tagalog-English mix) appropriate for young adults.

${candidateContext}

Based on the student's profile and the catalog below, recommend 3-5 specific job roles they can realistically pursue after completing TESDA courses.
${groundContext}

The JSON must match this exact schema with NO extra fields:
{
  "matchedSummary": "string (warm, encouraging overview in Taglish, 2-3 sentences)",
  "recommendedJobs": [
    {
      "jobTitle": "string (exact job title from the job list)",
      "matchScore": number (70-99),
      "reasonForYouth": "string (warm, personalized reason in Taglish, 1-2 sentences)",
      "sectorId": "string (e.g. 'ict', 'tourism', 'construction')",
      "requiredCourseCodes": ["array of TESDA course codes needed for this job"]
    }
  ],
  "faqTip": "string (practical next step advice in Taglish)"
}

Return ONLY valid JSON, no other text.`;
```

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add api/job-recommendation.ts
git commit -m "feat: candidate-based AI prompt for job recommendations"
```

---

### Task 9: Update Chat API for Top Matched Courses Context

**Files:**
- Modify: `api/chat.ts`

- [ ] **Step 1: Extract topMatchedCourses from userProfile**

In the `userProfile` handling section (around line 66), update `studentContext` to include matched courses:

```typescript
if (userProfile) {
  const sanitizedInterests = sanitizeInput(userProfile.interests, 500);
  const topCourses = (userProfile as any).topMatchedCourses as string[] | undefined;
  studentContext = `You are chatting with a student who is ${userProfile.age} years old from ${userProfile.province || userProfile.region}. Active educational status: Finished ${userProfile.education}. Interests: ${sanitizedInterests || "none specified"}.`;
  if (topCourses && topCourses.length > 0) {
    studentContext += ` Their top matched TESDA courses are: ${topCourses.join(', ')}. Reference these naturally in conversation.`;
  }
}
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add api/chat.ts
git commit -m "feat: pass top matched courses to chat AI for context enrichment"
```

---

### Task 10: Integrate Local Scoring into Frontend — Course Matching

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add matchingEngine import**

At the top of `App.tsx`, add after the existing imports:

```typescript
import { scoreCourses, scoreJobs, localCourseResult, localJobResult } from './lib/matchingEngine';
```

- [ ] **Step 2: Replace `handleSubmitProfile` with hybrid flow**

Replace the existing `handleSubmitProfile` function (starting around line 397). The key changes:
1. Run `scoreCourses()` before the API call
2. Send `candidates` in the POST body
3. On API failure, use `localCourseResult()` as fallback

```typescript
const handleSubmitProfile = async () => {
    if (isMatching) return;

    setIsMatching(true);
    setMatchError(null);
    setMatchResult(null);

    const profile = {
      age,
      education,
      region: selectedRegion,
      province: selectedProvince,
      interests: customInterests.join(", "),
      practicalSkills: customSkills.join(", "),
      careerGoal: careerGoal.trim()
    };

    const localScored = scoreCourses({
      interests: customInterests,
      practicalSkills: customSkills,
      careerGoal: careerGoal.trim(),
      education,
      region: selectedRegion,
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          candidates: localScored.map(s => ({
            code: s.code,
            localScore: s.localScore,
            reasonKeys: s.reasonKeys,
          })),
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const remainingHeader = response.headers.get('X-RateLimit-Remaining');
      const resetHeader = response.headers.get('X-RateLimit-Reset');
      if (remainingHeader) {
        setRateLimits(prev => ({
          ...prev,
          recommendation: { remaining: parseInt(remainingHeader), resetDate: resetHeader || '' }
        }));
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error(`Daily limit reached: ${errorData.message || 'You have used all 5 requests for today. Try again tomorrow.'}`);
        } else if (response.status === 403) {
          throw new Error(`Access blocked: ${errorData.message || 'Your IP has been blocked due to abuse.'}`);
        } else if (response.status === 413) {
          throw new Error(`Request too large: ${errorData.message || 'Please reduce the amount of text.'}`);
        } else if (response.status === 415) {
          throw new Error(`Invalid request format: ${errorData.message || 'Please try again.'}`);
        }
        throw new Error(`Server returned ${response.status}: Failed to load recommendation.`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.recommendedCourses)) {
        setMatchError(lang === "fil" ? "Nakatanggap ang server ng kakaibang sagot. Subukang muli, o gamitin ang fallback na rekomendasyon." : "The server returned an unexpected response. Please try again, or use the fallback recommendation.");
        return;
      }
      
      setMatchResult(data);
      
      const regionText = PHILIPPINES_REGIONS.find(r => r.code === selectedRegion)?.name || selectedRegion;
      setChatMessages(prev => [
        ...prev,
        {
          id: `match-update-${Date.now()}`,
          role: "model",
           text: lang === "fil"
             ? `Salamat sa pagkumpleto ng iyong profile! Batay sa pagsusuri ko, narito ang mga pinakamagandang TESDA course para sa iyo sa ${selectedProvince || regionText}. Tingnan ang listahan sa ibaba! Kung may mabilis kang tanong ukol sa enrolment, mag-chat lang dito sa "Chat kay Ka-TrabaHO" tab!`
             : `Thank you for completing your profile! Based on my analysis, here are the best TESDA courses for you in ${selectedProvince || regionText}. Check the list below! If you have a quick question about enrollment, just chat in the "Chat with Ka-TrabaHO" tab!`,
          timestamp: new Date()
        }
      ]);

    } catch {
      setMatchResult(localCourseResult(lang, localScored));
    } finally {
      setIsMatching(false);
    }
  };
```

- [ ] **Step 3: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors (or errors only in job handler — Task 11 fixes that)

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate local scoring into course recommendation with offline fallback"
```

---

### Task 11: Integrate Local Scoring into Frontend — Job Matching

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace `handleSubmitJobMatching` with hybrid flow**

Replace the existing `handleSubmitJobMatching` function (starting around line 484). Same pattern as Task 10:

```typescript
const handleSubmitJobMatching = async () => {
    if (isJobMatching) return;

    setIsJobMatching(true);
    setJobMatchError(null);
    setJobMatchResult(null);

    const profile = {
      age,
      education,
      region: selectedRegion,
      province: selectedProvince,
      interests: customInterests.join(", "),
      practicalSkills: customSkills.join(", "),
      careerGoal: careerGoal.trim()
    };

    const localScored = scoreJobs({
      interests: customInterests,
      practicalSkills: customSkills,
      careerGoal: careerGoal.trim(),
      education,
      region: selectedRegion,
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch("/api/job-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          candidates: localScored.map(s => ({
            code: s.code,
            localScore: s.localScore,
            reasonKeys: s.reasonKeys,
          })),
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const remainingHeader = response.headers.get('X-RateLimit-Remaining');
      const resetHeader = response.headers.get('X-RateLimit-Reset');
      if (remainingHeader) {
        setRateLimits(prev => ({
          ...prev,
          'job-recommendation': { remaining: parseInt(remainingHeader), resetDate: resetHeader || '' }
        }));
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error(`Daily limit reached: ${errorData.message || 'You have used all 5 requests for today. Try again tomorrow.'}`);
        } else if (response.status === 403) {
          throw new Error(`Access blocked: ${errorData.message || 'Your IP has been blocked due to abuse.'}`);
        }
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.recommendedJobs)) {
        throw new Error("Invalid response format from server");
      }
      
      setJobMatchResult(data);
      
    } catch (err: unknown) {
      setJobMatchResult(localJobResult(lang, localScored));
    } finally {
      setIsJobMatching(false);
    }
  };
```

- [ ] **Step 2: Add offline banner to match results display**

In the match results section (where `matchResult` is displayed), add an offline banner when the result came from local scoring. After the success header, add:

```typescript
{matchResult._isLocalFallback && (
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-amber-700 text-xs font-semibold max-w-2xl mx-auto">
    <AlertTriangle className="h-4 w-4 shrink-0" />
    {lang === "fil" 
      ? "AI offline — nagpapakita ng smart matches base sa iyong profile" 
      : "AI offline — showing smart matches based on your profile"}
  </div>
)}
```

And similarly for job results:

```typescript
{jobMatchResult._isLocalFallback && (
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-amber-700 text-xs font-semibold max-w-2xl mx-auto">
    <AlertTriangle className="h-4 w-4 shrink-0" />
    {lang === "fil" 
      ? "AI offline — nagpapakita ng smart matches base sa iyong profile" 
      : "AI offline — showing smart matches based on your profile"}
  </div>
)}
```

Note: `_isLocalFallback` is a custom property on the result objects from `localCourseResult` / `localJobResult`. To make TypeScript happy, either cast or add it to `MatchingResult` / `JobMatchResult` as optional. The simplest approach is to add `_isLocalFallback?: boolean` to both interfaces in `types.ts`.

- [ ] **Step 3: Add `_isLocalFallback` to result interfaces in `types.ts`**

In `src/types.ts`, add `_isLocalFallback?: boolean` to both `MatchingResult` and `JobMatchResult`:

```typescript
export interface MatchingResult {
  matchedSummary: string;
  targetSectors: string[];
  recommendedCourses: RecommendationCourse[];
  faqTip: string;
  _isLocalFallback?: boolean;
}

export interface JobMatchResult {
  matchedSummary: string;
  recommendedJobs: JobMatch[];
  faqTip: string;
  _isLocalFallback?: boolean;
}
```

- [ ] **Step 4: Update chat context with top matched courses**

In the `handleSendChatMessage` function, the `userProfile` object that's sent to the chat API (around line 591) should include the top matched course codes:

```typescript
const topMatchedCourses = matchResult?.recommendedCourses?.slice(0, 3).map(c => c.courseCode) || [];

const userProfile = {
  age,
  education,
  region: selectedRegion,
  province: selectedProvince,
  interests: customInterests.join(", "),
  practicalSkills: customSkills.join(", "),
  careerGoal,
  topMatchedCourses,
};
```

- [ ] **Step 5: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/types.ts
git commit -m "feat: integrate local scoring into job matching with offline fallback and chat context"
```

---

### Task 12: Final Typecheck and Smoke Test

- [ ] **Step 1: Run full typecheck**

Run: `npx tsc --noEmit`
Expected: Zero errors

- [ ] **Step 2: Run dev server**

Run: `npm run dev`
Expected: Server starts without errors, app loads in browser

- [ ] **Step 3: Manual smoke test — course matching**

1. Navigate to "AI Course Matcher" tab
2. Fill out profile (age, education, region, interests like "Computers & Gaming", skills like "Basic computer use")
3. Submit — should see matched courses with scores
4. If AI is available: results have warm Taglish reasons
5. If AI is down: results still appear with generic reasons + amber "AI offline" banner

- [ ] **Step 4: Manual smoke test — job matching**

1. Navigate to "Job Market" tab
2. Fill profile and submit
3. Should see job cards with scores and demand levels
4. Same offline behavior as course matching

- [ ] **Step 5: Manual smoke test — new sectors appear in explorer**

1. Navigate to "Course & Job Explorer" tab
2. Should see 7 sectors including "Automotive Servicing & Land Transport" and "Creative Digital Media & Design"
3. Click each sector — should show courses, jobs, icons correctly

- [ ] **Step 6: Manual smoke test — chat context**

1. After getting match results, go to "Chat with Ka-TrabaHO"
2. Ask "Ano ang best course para sa akin?"
3. Ka-TrabaHO should reference your top matched courses if AI is online

- [ ] **Step 7: Commit any final fixes**

```bash
git add -A
git commit -m "fix: final adjustments after smoke testing hybrid matching"
```
