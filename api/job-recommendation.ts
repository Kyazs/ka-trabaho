import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getClient,
  isDummyKey,
  getTesdaGroundingContext,
  extractJsonFromText,
  FALLBACK_JOB_RECOMMENDATION,
  mapAiJobsToExistingData,
  PHILIPPINES_REGIONS
} from './lib/api-utils.js';
import {
  applySecurityMiddleware,
  logAfterRequest,
  sanitizeInput,
  validateAge,
  validateEducation,
  JobRecommendationSchema,
  validateRequest,
  callAiWithRetry,
  sanitizeOutput
} from './lib/api-middleware.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  const endpoint = 'job-recommendation';
  
  // Apply security middleware (rate limiting, IP blocking, CORS, headers)
  const security = await applySecurityMiddleware(req, res, endpoint);
  if (!security.allowed) {
    if (security.statusCode === 200) {
      return res.status(200).end(); // OPTIONS preflight
    }
    return res.status(security.statusCode || 403).json(security.body);
  }
  
  const ip = security.ip;

  // Simple health check for GET requests
  if (req.method === 'GET') {
    await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 200, false, startTime);
    return res.json({ status: 'ok', endpoint: 'job-recommendation', env: isDummyKey ? 'dummy' : 'live' });
  }

  if (req.method !== 'POST') {
    await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 405, false, startTime);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body with Zod
    const validation = validateRequest(JobRecommendationSchema, req.body);
    if (!validation.success) {
      await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 400, false, startTime);
      return res.status(400).json({ error: validation.error });
    }

    const {
      age,
      education,
      region,
      province,
      interests,
      practicalSkills,
      careerGoal
    } = validation.data;

    if (isDummyKey) {
      await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 200, false, startTime);
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

    // Call AI with timeout and retry
    const response = await callAiWithRetry(() =>
      getClient().chat.completions.create({
        model: "accounts/fireworks/models/kimi-k2p7-code",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    );

    let rawContent = response.choices[0].message.content || "";
    
    // Sanitize AI output
    rawContent = sanitizeOutput(rawContent);
    
    let parsedData = extractJsonFromText(rawContent);

    if (!parsedData || !Array.isArray(parsedData.recommendedJobs)) {
      console.warn("AI returned malformed job data, using fallback.");
      await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 200, false, startTime);
      return res.json(FALLBACK_JOB_RECOMMENDATION);
    }

    const enrichedJobs = mapAiJobsToExistingData(parsedData.recommendedJobs, region);
    
    await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 200, false, startTime);
    res.json({
      matchedSummary: parsedData.matchedSummary || FALLBACK_JOB_RECOMMENDATION.matchedSummary,
      recommendedJobs: enrichedJobs,
      faqTip: parsedData.faqTip || FALLBACK_JOB_RECOMMENDATION.faqTip
    });
    
  } catch (error: any) {
    console.error("Job Recommendation Error:", error);
    
    // Handle timeout specifically
    if (error.message === 'AI API timeout') {
      await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 504, false, startTime);
      return res.status(504).json({ 
        error: "AI service timeout",
        message: "The AI service took too long to respond. Please try again in a few moments."
      });
    }
    
    await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 500, false, startTime);
    res.status(500).json({ error: "Failed to load job recommendations. Please try again." });
  }
}
