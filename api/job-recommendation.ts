import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getClient,
  isDummyKey,
  getTesdaGroundingContext,
  extractJsonFromText,
  FALLBACK_JOB_RECOMMENDATION,
  mapAiJobsToExistingData,
  PHILIPPINES_REGIONS,
  setCorsHeaders
} from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple health check for GET requests
  if (req.method === 'GET') {
    return res.json({ status: 'ok', endpoint: 'job-recommendation', env: isDummyKey ? 'dummy' : 'live' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    if (isDummyKey) {
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

    const response = await getClient().chat.completions.create({
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
}