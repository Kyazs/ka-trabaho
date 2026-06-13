# AI Job Matching Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated Job Market tab where users get AI-personalized job recommendations based on their profile, enriched with real job data (salary, demand, description) from existing `SECTORS_DATA`, showing which TESDA courses are required for each job.

**Architecture:** Create a new backend endpoint `/api/job-recommendation` that uses the AI model to suggest job titles, then maps those to existing `JobRole` data from `SECTORS_DATA`. Frontend adds a "Job Market" tab with job cards showing real salary/demand info and links to matching courses.

**Tech Stack:** React + TypeScript + Tailwind CSS + Express + Fireworks AI API

---

## File Structure

| File | Responsibility |
|------|---------------|
| `server.ts` | Add `/api/job-recommendation` endpoint, AI prompt, job mapping logic |
| `src/App.tsx` | Add Job Market tab, job results UI, navigation integration |
| `src/data/tesdaData.ts` | Add job-to-course mapping helper if needed |

---

## Task 1: Backend API Endpoint - Job Recommendation

**Files:**
- Modify: `server.ts`

- [ ] **Step 1: Add job recommendation AI prompt and schema**

Add after the existing `FALLBACK_RECOMMENDATION` constant:

```typescript
const FALLBACK_JOB_RECOMMENDATION = {
  matchedSummary: "Mabuhay! Batay sa iyong profile, narito ang mga posibleng trabaho na akma sa iyong kakayahan. Para sa mas detalyadong job matching, maaari mong kausapin ang AI counselor.",
  recommendedJobs: [
    {
      jobTitle: "Computer Repair & Network Technician",
      matchScore: 90,
      reasonForYouth: "Dahil may interes ka sa teknolohiya at computer, ang pag-aayos at pag-maintain ng computer networks ay magandang simula.",
      sectorId: "ict",
      requiredCourseCodes: ["ICT-CSS2"]
    },
    {
      jobTitle: "Specialty Café Barista",
      matchScore: 85,
      reasonForYouth: "Kung gusto mong makasalamuha ang tao at gumawa ng kape, mabilis makakuha ng trabaho sa mga café.",
      sectorId: "tourism",
      requiredCourseCodes: ["TOU-BAR2"]
    }
  ],
  faqTip: "Pumunta sa pinakamalapit na TESDA Regional/Provincial Office para sa libreng assessment at job placement assistance."
};
```

- [ ] **Step 2: Add job data mapping function**

Add before the endpoint:

```typescript
// Map AI job recommendations to existing JobRole data with full enrichment
const mapAiJobsToExistingData = (aiJobs: any[], regionCode: string) => {
  if (!Array.isArray(aiJobs)) return [];
  
  return aiJobs.map((aiJob: any) => {
    // Find matching job in SECTORS_DATA by title similarity
    let matchedJob: any = null;
    let matchedSector: any = null;
    
    for (const sector of SECTORS_DATA) {
      for (const job of sector.jobs) {
        if (job.title.toLowerCase().includes(aiJob.jobTitle?.toLowerCase()) ||
            aiJob.jobTitle?.toLowerCase().includes(job.title.toLowerCase())) {
          matchedJob = job;
          matchedSector = sector;
          break;
        }
      }
      if (matchedJob) break;
    }
    
    // Find required courses for this job
    const requiredCourses = matchedJob?.mappedCourses?.map((courseCode: string) => {
      for (const sector of SECTORS_DATA) {
        const course = sector.courses.find((c: any) => c.code === courseCode);
        if (course) return { ...course, sectorId: sector.id, sectorName: sector.name };
      }
      return null;
    }).filter(Boolean) || [];
    
    return {
      jobTitle: aiJob.jobTitle || matchedJob?.title || "Unknown Job",
      matchScore: aiJob.matchScore || 80,
      reasonForYouth: aiJob.reasonForYouth || matchedJob?.description || "",
      sectorId: aiJob.sectorId || matchedSector?.id || "",
      sectorName: aiJob.sectorName || matchedSector?.name || "",
      averageSalary: matchedJob?.averageSalary || "Competitive",
      demandLevel: matchedJob?.demandLevel || "High",
      description: matchedJob?.description || "",
      requiredCourses: requiredCourses
    };
  });
};
```

- [ ] **Step 3: Add `/api/job-recommendation` endpoint**

Add after the existing `/api/recommendation` endpoint:

```typescript
// Endpoint 3: Job Recommendation based on Profile
app.post("/api/job-recommendation", async (req, res) => {
  try {
    const {
      age,
      education,
      region,
      province,
      interests,
      practicalSkills,
      careerGoal
    } = req.body;

    if (!age || !education || !region) {
      return res.status(400).json({ error: "Missing required profile fields (age, education, region)." });
    }

    if (apiKey === "dummy_key_for_build") {
      return res.json(FALLBACK_JOB_RECOMMENDATION);
    }

    const groundContext = getTesdaGroundingContext();
    const regionInfo = PHILIPPINES_REGIONS.find(r => r.code === region);
    const regionName = regionInfo?.name || region;
    const topSectors = regionInfo?.topSectors || [];

    const systemPrompt = `STRICT JSON OUTPUT REQUIRED. You must return ONLY a valid JSON object. No markdown, no code blocks, no extra text, no explanations outside the JSON.

You are a Filipino career counselor specializing in TESDA vocational job placement for out-of-school youth (aged 15-24) in the Philippines.
Your tone should be highly encouraging, warm, conversational, and use friendly Taglish (Tagalog-English mix) appropriate for young adults.

Based on the student's profile, recommend 3-5 specific job roles they can realistically pursue after completing TESDA courses.
Consider their education level, practical skills, interests, and career goals.

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

${groundContext}`;

    const userPrompt = `Please recommend 3-5 jobs for this student and return ONLY a JSON object:
- Age: ${age}
- Education: ${education}
- Region: ${regionName} (Top sectors: ${topSectors.join(", ")})
- Province: ${province || "Any"}
- Interests: ${interests || "None"}
- Practical Skills: ${practicalSkills || "None"}
- Career Goal: ${careerGoal || "None"}

Return ONLY valid JSON, no other text.`;

    const response = await client.chat.completions.create({
      model: "accounts/fireworks/models/kimi-k2p7-code",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    let rawContent = response.choices[0].message.content || "";
    let parsedData = extractJsonFromText(rawContent);

    if (!parsedData || !Array.isArray(parsedData.recommendedJobs)) {
      console.warn("AI returned malformed job data, using fallback.");
      return res.json(FALLBACK_JOB_RECOMMENDATION);
    }

    // Enrich with real job data from SECTORS_DATA
    const enrichedJobs = mapAiJobsToExistingData(parsedData.recommendedJobs, region);
    
    res.json({
      matchedSummary: parsedData.matchedSummary || FALLBACK_JOB_RECOMMENDATION.matchedSummary,
      recommendedJobs: enrichedJobs,
      faqTip: parsedData.faqTip || FALLBACK_JOB_RECOMMENDATION.faqTip
    });
    
  } catch (error: any) {
    console.error("Job Recommendation Error:", error);
    res.status(500).json({ error: "Failed to load job recommendations. Please try again." });
  }
});
```

- [ ] **Step 4: Test the endpoint**

Run:
```bash
curl -X POST http://localhost:3000/api/job-recommendation \
  -H "Content-Type: application/json" \
  -d '{"age":20,"education":"Junior High School Graduate","region":"NCR","interests":"Computers","practicalSkills":"Basic computer use","careerGoal":"IT technician"}'
```

Expected: JSON response with `recommendedJobs` array containing enriched job data with `averageSalary`, `demandLevel`, and `requiredCourses`.

---

## Task 2: Frontend - Add Job Market Tab and UI

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Add state for job matching**

In `src/App.tsx`, add after existing matching state:

```typescript
  // Job matching states
  const [isJobMatching, setIsJobMatching] = useState<boolean>(false);
  const [jobMatchResult, setJobMatchResult] = useState<any | null>(null);
  const [jobMatchError, setJobMatchError] = useState<string | null>(null);
```

- [ ] **Step 2: Add job matching handler function**

Add after `handleSubmitProfile`:

```typescript
  const handleSubmitJobMatching = async () => {
    console.log("[handleSubmitJobMatching] Clicked!");
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

    try {
      const response = await fetch("/api/job-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log("[handleSubmitJobMatching] Response:", data);
      
      if (!data || !Array.isArray(data.recommendedJobs)) {
        throw new Error("Invalid response format from server");
      }
      
      setJobMatchResult(data);
      
    } catch (err: any) {
      console.error("[handleSubmitJobMatching] Error:", err);
      setJobMatchError("Hindi namin ma-konekta sa aming AI server. Subukang muli o manu-manong tignan ang mga sektor sa itaas.");
    } finally {
      setIsJobMatching(false);
    }
  };
```

- [ ] **Step 3: Add Job Market tab to Navbar**

In `src/components/Navbar.tsx`, add between Explorer and Chat tabs:

```tsx
          <button
            id="tab-jobs-btn"
            onClick={() => setCurrentTab("jobs")}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              currentTab === "jobs"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>{lang === "fil" ? "Mga Trabaho" : "Job Market"}</span>
          </button>
```

Import `Briefcase` from `lucide-react` at the top of the file.

- [ ] **Step 4: Add Job Market tab content to App.tsx**

Add after the existing `faq` tab content:

```tsx
        {currentTab === "jobs" && (
          <div id="tab-jobs-content" className="space-y-8 animate-fade-in">
            {/* Job Matching Form */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    {lang === "fil" ? "Hanapin ang Angkop na Trabaho" : "Find Matching Jobs"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === "fil" ? "Gamitin ang AI para malaman ang mga trabahong akma sa iyong profile" : "Let AI find jobs that match your skills and interests"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-sm text-slate-700">
                    <strong>Current Profile:</strong> {age} years old, {education}, {selectedRegion}
                    {customInterests.length > 0 && ` | Interests: ${customInterests.join(", ")}`}
                    {careerGoal && ` | Goal: ${careerGoal}`}
                  </p>
                </div>

                <button
                  id="btn-submit-job-matching"
                  type="button"
                  onClick={handleSubmitJobMatching}
                  disabled={isJobMatching || (customInterests.length === 0 && !careerGoal)}
                  className={`w-full rounded-xl py-4 text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isJobMatching
                      ? "bg-amber-100 text-amber-700 cursor-wait border-2 border-amber-300"
                      : customInterests.length === 0 && !careerGoal
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-dashed border-slate-300"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:scale-[1.01]"
                  }`}
                >
                  {isJobMatching ? (
                    <>
                      <span className="animate-spin inline-block h-5 w-5 border-3 border-emerald-500 border-t-transparent rounded-full" />
                      <span className="font-extrabold">{lang === "fil" ? "Sinusuri ng AI ang mga trabaho..." : "AI is analyzing jobs..."}</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-4 w-4" />
                      <span>
                        {lang === "fil" 
                          ? "Hanapin ang Trabaho para sa Akin!" 
                          : "Find Jobs for Me!"
                        }
                      </span>
                    </>
                  )}
                </button>

                {(customInterests.length === 0 && !careerGoal) && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                    <span className="text-amber-500 text-lg leading-none">&#9888;</span>
                    <p className="text-xs text-amber-800 font-semibold">
                      {lang === "fil" 
                        ? "Pumili ng kahit isang interes sa 'AI Matcher' tab o magsulat sa career goal para ma-unlock ang Job Matching."
                        : "Select at least one interest in the 'AI Matcher' tab or type a career goal to unlock Job Matching."
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Match Error */}
            {jobMatchError && (
              <div id="job-matching-error" className="p-4 rounded-xl border border-rose-100 flex items-start gap-3 bg-red-50 text-red-700 max-w-2xl mx-auto">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">May kaunting aberya</h4>
                  <p className="text-xs text-red-600 mt-1">{jobMatchError}</p>
                </div>
              </div>
            )}

            {/* Job Results */}
            {jobMatchResult && Array.isArray(jobMatchResult.recommendedJobs) && (
              <div id="job-results-section" className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <span className="inline-block bg-emerald-50 text-emerald-800 font-extrabold text-[10px] px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider mb-2">
                    ✓ Job Matches Found
                  </span>
                  <h2 className="font-display font-extrabold text-xl text-slate-900 sm:text-2xl">
                    {lang === "fil" ? "Mga Trabahong Akma sa Iyo" : "Jobs Matched to Your Profile"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
                    {jobMatchResult.matchedSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobMatchResult.recommendedJobs.map((job: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col h-full"
                    >
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Job Match #{idx + 1}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-xs font-bold px-2 rounded bg-emerald-100 text-emerald-800 border-emerald-200 border">
                          {job.matchScore}% Match
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-display font-bold text-base text-slate-900 leading-tight">
                            {job.jobTitle}
                          </h3>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              job.demandLevel === "Very High" 
                                ? "bg-red-100 text-red-700" 
                                : job.demandLevel === "High"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {job.demandLevel} Demand
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {job.averageSalary}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-3 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <strong>Bakit para sa iyo:</strong> "{job.reasonForYouth}"
                          </p>

                          {job.description && (
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                              {job.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                          {job.requiredCourses && job.requiredCourses.length > 0 && (
                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Kailangang TESDA Courses:
                              </span>
                              <div className="mt-2 space-y-2">
                                {job.requiredCourses.map((course: any, cidx: number) => (
                                  <div key={cidx} className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-slate-100">
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4 text-blue-600" />
                                      <div>
                                        <span className="text-xs font-bold text-slate-800">{course.name}</span>
                                        <span className="text-[10px] text-slate-500 block">{course.code} | {course.duration}</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        const sector = SECTORS_DATA.find((s: any) => s.id === course.sectorId);
                                        if (sector) setSelectedSector(sector);
                                        setCurrentTab("explorer");
                                      }}
                                      className="text-xs text-blue-600 font-bold hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-all"
                                    >
                                      Detalye
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => setCurrentTab("chat")}
                            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 text-center flex items-center justify-center gap-1.5 transition-all"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Kausapin ang Counselor</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ Tip */}
                {jobMatchResult.faqTip && (
                  <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm text-emerald-400">Next Step</h3>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{jobMatchResult.faqTip}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
```

- [ ] **Step 5: Import required icons in App.tsx**

Add to existing imports from `lucide-react`:
```typescript
import { Briefcase, GraduationCap, Info } from "lucide-react";
```
(Note: `GraduationCap` and `Info` might already be imported, but `Briefcase` needs to be added.)

---

## Task 3: Integration and Polish

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Add job count badge to Navbar (optional)**

Show a small badge on the Job Market tab if job results are available:

```tsx
          <button
            id="tab-jobs-btn"
            onClick={() => setCurrentTab("jobs")}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-medium transition-all relative ${
              currentTab === "jobs"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>{lang === "fil" ? "Mga Trabaho" : "Job Market"}</span>
            {jobMatchResult?.recommendedJobs?.length > 0 && currentTab !== "jobs" && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {jobMatchResult.recommendedJobs.length}
              </span>
            )}
          </button>
```

- [ ] **Step 2: Add "View Jobs" button to course matching results**

In the course matching results section, after the course cards, add:

```tsx
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      handleSubmitJobMatching();
                      setCurrentTab("jobs");
                    }}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 px-6 flex items-center gap-2 transition-all shadow-lg shadow-emerald-200"
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>{lang === "fil" ? "Tingnan ang Mga Trabaho" : "View Matching Jobs"}</span>
                  </button>
                </div>
```

This goes after the course cards grid (`</div>`) but before the enrollment tips card.

- [ ] **Step 3: Add "View Courses" button to job results**

In each job card, after the required courses section, add a button to navigate to the course explorer:

```tsx
                          <button
                            onClick={() => {
                              if (job.sectorId) {
                                const sector = SECTORS_DATA.find((s: any) => s.id === job.sectorId);
                                if (sector) setSelectedSector(sector);
                              }
                              setCurrentTab("explorer");
                            }}
                            className="w-full rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 text-center flex items-center justify-center gap-1.5 transition-all"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Tingnan ang Sector</span>
                          </button>
```

---

## Task 4: Testing and Verification

**Files:**
- All modified files

- [ ] **Step 1: Restart server and test API**

```bash
# Restart server
npx tsx server.ts

# Test in another terminal
curl -X POST http://localhost:3000/api/job-recommendation \
  -H "Content-Type: application/json" \
  -d '{"age":20,"education":"Junior High School Graduate","region":"NCR","interests":"Computers","practicalSkills":"Basic computer use","careerGoal":"IT technician"}'
```

Expected: JSON with 3-5 job recommendations, each with `jobTitle`, `matchScore`, `averageSalary`, `demandLevel`, and `requiredCourses`.

- [ ] **Step 2: Test frontend flow**

1. Open app in browser
2. Fill profile in AI Matcher tab (select interests, type career goal)
3. Click "Find Jobs for Me!" in Job Market tab
4. Verify: loading spinner → job cards with salary, demand, required courses
5. Click "Detalye" on a course → should navigate to Explorer tab with sector selected
6. Click "Kausapin ang Counselor" → should navigate to Chat tab
7. Go back to AI Matcher, run course matching, click "View Matching Jobs" → should navigate to Job tab with results

- [ ] **Step 3: Verify error handling**

1. Stop server → click "Find Jobs" → should show error message gracefully
2. Restart server → clear profile (no interests, no goal) → button should be disabled with warning

- [ ] **Step 4: Final review**

Check console for errors. Verify all imports are correct. Make sure no TypeScript errors.

---

## Self-Review Checklist

- [ ] Spec coverage: All requirements from the design are addressed
- [ ] No placeholders: Every step has actual code or commands
- [ ] Type consistency: `recommendedJobs` array, `JobRole` enrichment, `requiredCourses` mapping
- [ ] Error handling: Fallback data, API error states, disabled states
- [ ] Integration: Tab navigation, cross-links between jobs/courses/chat
- [ ] UX: Loading states, disabled button states, helpful error messages

---

**Plan complete.** Ready for implementation.