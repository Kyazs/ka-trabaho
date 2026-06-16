# Hybrid Matching Engine — Design Spec

Date: 2026-06-16

## Goal

Improve match quality by combining a client-side weighted scoring engine with AI personalization. The local engine eliminates hallucinated course codes, works offline, and shrinks AI context from ~3KB to ~500B.

## Approach

Client-Side Weighted Scoring (Approach A from brainstorming). Local engine pre-filters candidates; AI personalizes Taglish reasons and adjusts scores.

---

## 1. Data Swap

### 1.1 Replace `tesdaData.ts` with enhanced data

- Move all content from `tesdaData_enhanced.ts` into `tesdaData.ts`
- Delete `tesdaData_enhanced.ts`
- Export names remain identical: `SECTORS_DATA`, `PHILIPPINES_REGIONS`, `TESDA_FAQ`, `TESDA_FAQ_EN`

### 1.2 Restore `islandGroup` on RegionInfo

Enhanced data dropped `islandGroup`. Add it back to all 17 regions:
- Luzon: NCR, CAR, R1, R2, R3, R4A, R4B, R5
- Visayas: R6, R7, R8
- Mindanao: R9, R10, R11, R12, R13, BARMM

### 1.3 Fix `entryReq` serialization in `api-utils.ts`

Line 42: `course.entryReq` string-interpolates as `[object Object]` when `entryReq` is `{fil, en}`. Change to `course.entryReq.en`.

### 1.4 New optional fields on interfaces

- `TesdaCourse`: add `assessmentFee?: string`, `overseasPathway?: string`
- `JobRole`: add `overseasSalary?: string`

### 1.5 Add missing sector icons to `getSectorIcon()`

Add cases for `Car` (automotive) and `Palette` (creative) in `App.tsx`.

### 1.6 Update fallback constants

`FALLBACK_RECOMMENDATION` and `FALLBACK_JOB_RECOMMENDATION` in `api-utils.ts` should reference new course codes (e.g., `ICT-CCS2` for BPO, `TOU-HK2` for housekeeping).

---

## 2. Local Matching Engine

### 2.1 Module

New file: `src/lib/matchingEngine.ts` — pure functions, no React, no API calls.

### 2.2 Scoring algorithm — `scoreCourses(profile, courses, regionInfo)`

For each course, compute weighted score 0–100:

| Dimension | Weight | Calculation |
|-----------|--------|-------------|
| Interest overlap | 40% | Jaccard similarity: user interests + career goal keywords vs course `skillsAcquired` + `description` tokens |
| Skill overlap | 30% | Jaccard similarity: user skills vs course `skillsAcquired` tokens |
| Education eligibility | 20% | 100 = eligible, 50 = borderline, 0 = disqualified |
| Region sector fit | 10% | 100 if course sector in region `topSectors`, else 40 |

Returns top 6 `ScoredCourse[]` sorted by score descending.

### 2.3 Scoring algorithm — `scoreJobs(profile, jobs, regionInfo)`

Same 4 dimensions. Interest/skill overlap computed against job `description` + union of `mappedCourses` skill sets.

Returns top 5 `ScoredJob[]`.

### 2.4 Keyword normalization

Lowercase, token-split, small synonym map for vocabulary bridging:
- "fixing" → "repair", "cooking" → "culinary", "caring" → "caregiving"
- "computer" → "pc", "gaming" → "technology", "elders" → "elderly"
- "building" → "construction", "driving" → "automotive"

### 2.5 Education eligibility rules

| Education | Eligible levels |
|-----------|-----------------|
| College Graduate | All |
| Senior High School Graduate | All NC II, NC III, Micro-credential |
| Junior High School Graduate | NC I, NC II courses that accept JHS (CSS NC II, Barista, etc.) |
| Elementary Graduate / ALS | NC I, courses accepting elementary |
| Some College | Same as SHS |

Determined by parsing `entryReq.en` for keywords like "elementary", "junior high", "high school", "no specific requirement".

### 2.6 Output types

```typescript
interface ScoredCandidate {
  code: string;
  localScore: number;
  reasonKeys: string[];
}

interface ScoredCourse extends ScoredCandidate {
  name: string;
  level: string;
  duration: string;
  sectorId: string;
  immediateJobTitle: string;
}

interface ScoredJob extends ScoredCandidate {
  jobTitle: string;
  sectorId: string;
  averageSalary: string;
  demandLevel: string;
}
```

`reasonKeys` are tags like `"interest_match"`, `"skill_match"`, `"region_hot"`, `"education_eligible"` used to generate generic Taglish reasons when AI is offline.

### 2.7 Generic reason map

When AI is unavailable, `reasonKeys` map to pre-written Taglish reasons:
- `interest_match` → "Bagay sa iyong interes ang kurso na ito!"
- `skill_match` → "Ang mga kasanayan mo ay akma sa skills na ituturo dito."
- `region_hot` → "Maraming trabaho ang available sa sector na ito sa iyong rehiyon."
- `education_eligible` → "Kwalipikado ka na para mag-enroll base sa iyong pinag-aralan."

---

## 3. Hybrid Flow

### 3.1 Course recommendation flow

```
User submits profile
  → scoreCourses() runs locally (instant)
  → top 6 ScoredCourse objects
  → POST /api/recommendation { ...profile, candidates: [{ code, localScore, reasonKeys }] }
  → Server: AI prompt changes to "personalize these 6 candidates"
  → AI returns personalized reasons + adjusted scores
  → Frontend merges AI output with local scores (AI scores preferred when available)
  → Display results
```

### 3.2 Job recommendation flow

Same pattern with `scoreJobs()` and `/api/job-recommendation`.

### 3.3 Offline path

When API fails:
- Display local scores with generic Taglish reasons from reasonKey map
- Show banner: "AI offline — showing smart matches based on your profile"
- Results are still useful, just less personalized

### 3.4 Edge case: zero local matches

If `scoreCourses()` returns 0 results (extremely unlikely with 19 courses):
- Fall back to current behavior: send full context to AI
- Skip sending `candidates` field

### 3.5 API changes

**Recommendation endpoint:**
- Request body adds optional `candidates: ScoredCandidate[]`
- System prompt changes from "find matches in this full catalog" to "here are 6 pre-scored candidates — personalize reasons, confirm or adjust scores. If a better match exists outside this list, add it."
- Grounding context still included for truth-checking but only candidate details are emphasized in the prompt

**Chat endpoint:**
- `userProfile` adds optional `topMatchedCourses: string[]` (course codes)
- System prompt includes "The student's top matched courses are: X, Y, Z — reference them naturally"

---

## 4. Chat Integration

- Ka-TrabaHO stays fully AI-dependent for freeform chat
- When user has local-scored results, top 3 course codes are passed in profile
- AI counselor can reference them: "I noticed you scored high for CSS NC II..."

---

## 5. Error Handling

| Scenario | Behavior |
|----------|----------|
| AI succeeds, local engine ran | Display AI-personalized reasons; use AI scores if provided |
| AI fails (timeout/rate limit) | Display local scores + generic Taglish reasons + "AI offline" banner |
| AI returns hallucinated course code | `mapAiJobsToExistingData` filters unrecognized codes; local candidates fill gap |
| Local engine returns 0 matches | Fall back to full-context AI call |

---

## 6. Files Changed

| File | Change |
|------|--------|
| `src/data/tesdaData.ts` | Replace with enhanced data content, add `islandGroup` back, add new optional fields to interfaces |
| `src/data/tesdaData_enhanced.ts` | Delete |
| `src/lib/matchingEngine.ts` | New — scoring algorithms, synonym map, reason map, education rules |
| `src/types.ts` | Add `ScoredCandidate`, `ScoredCourse`, `ScoredJob` |
| `src/App.tsx` | Add `Car`/`Palette` to `getSectorIcon()`, integrate local scoring before API calls, offline fallback UI |
| `api/lib/api-utils.ts` | Fix `entryReq` serialization, update fallback constants, update `getTesdaGroundingContext` to handle object `entryReq` |
| `api/recommendation.ts` | Accept `candidates` in request, update system prompt |
| `api/job-recommendation.ts` | Accept `candidates` in request, update system prompt |
| `api/chat.ts` | Accept `topMatchedCourses` in userProfile |
