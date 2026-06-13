import express from "express";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import { SECTORS_DATA, PHILIPPINES_REGIONS } from "./src/data/tesdaData.js"; // Note: Use extension or configure path resolver

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 3000;

// Enable JSON bodies
app.use(express.json());

// Initialize Fireworks Client safely
// Ensure process.env.FIREWORKS_API_KEY is defined
const apiKey = process.env.FIREWORKS_API_KEY || "dummy_key_for_build";
const client = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.fireworks.ai/inference/v1",
});

// Helper: Provide local context summarizing the TESDA courses we offer to the AI
const getTesdaGroundingContext = () => {
  let context = "Here are the currently available high-demand industrial sectors and accredited TESDA courses you must prioritize mapping to:\n";
  SECTORS_DATA.forEach(sector => {
    context += `- Sector: ${sector.name} (${sector.id})\n`;
    context += `  Description: ${sector.description}\n`;
    context += `  Jobs available:\n`;
    sector.jobs.forEach(job => {
      context += `    * ${job.title} (Salary: ${job.averageSalary}, Demand: ${job.demandLevel})\n`;
    });
    context += `  Accredited TESDA Courses:\n`;
    sector.courses.forEach(course => {
      context += `    * [Code: ${course.code}] ${course.name} (${course.level}, Duration: ${course.duration})\n`;
      context += `      Entry Requirements: ${course.entryReq}\n`;
      context += `      Skills Taught: ${course.skillsAcquired.join(", ")}\n`;
    });
  });
  return context;
};

const FALLBACK_RECOMMENDATION = {
  matchedSummary: "Mabuhay! Si Ka-TrabaHO ay naghanda ng pangkalahatang rekomendasyon base sa iyong profile. Para sa mas detalyadong counseling, maaari mong kausapin ang AI counselor sa 'Chat kay Ka-TrabaHO' tab.",
  targetSectors: ["ict", "tourism"],
  recommendedCourses: [
    {
      courseCode: "ICT-CSS2",
      courseName: "Computer Systems Servicing NC II",
      matchScore: 90,
      reasonForYouth: "Dahil hilig mo ang teknolohiya at computer games, bagay sa iyo ang pagse-setup at pag-repair ng computer networks!",
      immediateJobTitle: "Computer Repair & Network Technician"
    },
    {
      courseCode: "TOU-BAR2",
      courseName: "Barista NC II",
      matchScore: 85,
      reasonForYouth: "Gusto mong makasalamuha ang tao at gumawa ng mga kape. Mabilis makakuha ng trabaho sa mga café ngayon.",
      immediateJobTitle: "Specialty Café Barista"
    }
  ],
  faqTip: "Pumunta sa pinakamalapit na TESDA Regional/Provincial Office upang mag-apply ng libreng scholarship at ₱160 daily allowance!"
};

// Robust JSON extraction: try to find JSON object in text by matching braces
const extractJsonFromText = (text: string): any | null => {
  // First try: direct JSON parse
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch { /* ignore */ }

  // Second try: strip markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1]);
      if (parsed && typeof parsed === "object") return parsed;
    } catch { /* ignore */ }
  }

  // Third try: find the first { and last } and try to parse
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") return parsed;
    } catch { /* ignore */ }
  }

  return null;
};

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

// Endpoint 1: Match Profile to TESDA Courses
app.post("/api/recommendation", async (req, res) => {
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
      return res.json(FALLBACK_RECOMMENDATION);
    }

    const groundContext = getTesdaGroundingContext();

    const systemPrompt = `STRICT JSON OUTPUT REQUIRED. You must return ONLY a valid JSON object. No markdown, no code blocks, no extra text, no explanations outside the JSON.

You are a Filipino vocational counselor specialist mapping out-of-school youth (aged 15-24) to available free TESDA courses in their province.
Your tone should be highly encouraging, warm, conversational, and use friendly Taglish (Tagalog-English mix) appropriate for young adults.
Utilize the following list of active local TESDA sectors, job demands, and courses to make precise matches. Try to align with the provided course codes where possible.
If there are no exact course matches inside our sector list, you can suggest another well-known real TESDA course code (e.g. Shielded Metal Arc Welding, Automotive, etc.) but explain why.

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

${groundContext}`;

    const userPrompt = `Please generate a personalized matching analysis for this student and return ONLY a JSON object matching the schema above:
- Age: ${age}
- Education Level completed: ${education}
- General Region: ${region}
- Specific Province: ${province || "Any Province"}
- Interests: ${interests || "None specified"}
- Practical Skills: ${practicalSkills || "None specified"}
- Personal Career Goal or Ambition: ${careerGoal || "None specified"}

Recommend 2 to 3 specific TESDA courses with matchScore between 70 and 99. Provide target sector IDs (like 'ict', 'tourism', 'construction'). Return ONLY valid JSON, no other text.`;

    const response = await client.chat.completions.create({
      model: "accounts/fireworks/models/kimi-k2p7-code",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    let rawContent = response.choices[0].message.content || "";
    console.log("[AI Raw Response]:", rawContent.substring(0, 500) + "...");
    
    // Try to extract JSON from the AI response using multiple strategies
    let parsedData = extractJsonFromText(rawContent);

    if (!parsedData || !Array.isArray(parsedData.recommendedCourses) || parsedData.recommendedCourses.length === 0) {
      console.warn("AI returned malformed recommendation data, using fallback. Raw response:", rawContent.substring(0, 200));
      return res.json(FALLBACK_RECOMMENDATION);
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error("Recommendation Error:", error);
    res.status(500).json({ error: "Failed to load matching recommendation. Please try again." });
  }
});

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

// Endpoint 2: Ka-TrabaHO Intelligent Chatbot Counseling
app.post("/api/chat", async (req, res) => {
  try {
    const { history, message, userProfile } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message sent from student." });
    }

    if (apiKey === "dummy_key_for_build") {
      return res.json({
        text: "Mabuhay! Ako si Ka-TrabaHO, ang iyong TESDA AI counselor companion. Humihingi ako ng pasensya dahil hindi pa fully activated ang Fireworks API key. Pero maaari pa rin nating tignan ang mga kurso sa pamamagitan ng filter sa ibaba!"
      });
    }

    const groundContext = getTesdaGroundingContext();
    const studentContext = userProfile
      ? `You are chatting with a student who is ${userProfile.age} years old from ${userProfile.province || userProfile.region}. Active educational status: Finished ${userProfile.education}. Interests: ${userProfile.interests || "none specified"}.`
      : "The student has not completed their assessment profile yet. Politely invite them to finish the quick matching steps above to get highly customized answers!";

    const systemInstruction = `You are "Ka-TrabaHO", an official TESDA Career & Enrolment AI Counselor specifically designed for out-of-school Filipino youth aged 15-24.
Your goal is to guide them, answer questions about vocational programs, explain requirements (birth certificate, high school credentials, ALS certificate), explain financial grants (free tuition, daily allowance), and help them feel excited about learning a new trade.
- Speak in a heart-to-heart, friendly, warm, and highly supportive Taglish (English and Tagalog) conversational style. Use words like "Kapatid", "Ka-TrabaHO", "bilib ako sa 'yo", "galing!", "Kaya mo 'yan!".
- Avoid robotic or cold corporate speak. Treat them with respect and empathy. Many out-of-school youth face immense financial or personal pressure — offer reassurance that TESDA is an open-door pathway to better wages.
- Incorporate this ground truth course menu when answering queries:
${groundContext}
- Always prioritize safety, and motivate them to visit local TESDA assessment/training schools.
- User status: ${studentContext}`;

    // Structure chat history for OpenAI-compatible Fireworks API
    const messages: any[] = [
      {
        role: "system",
        content: systemInstruction
      }
    ];

    if (history) {
      messages.push(...history.map((item: any) => ({
        role: item.role,
        content: item.text
      })));
    }

    messages.push({
      role: "user",
      content: message
    });

    const response = await client.chat.completions.create({
      model: "accounts/fireworks/models/kimi-k2p7-code",
      messages: messages,
      temperature: 0.7,
    });

    res.json({ text: response.choices[0].message.content });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Oops! May konting glitch sa aking connection. Please wait standard minutes and reply again." });
  }
});

// Serve assets / Vite middleware
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(Number(process.env.PORT || 3000), () => {
  console.log(`Skills-to-Jobs server listening on port ${process.env.PORT || 3000}`);
});
