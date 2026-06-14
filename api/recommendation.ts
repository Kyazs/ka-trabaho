import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getClient,
  isDummyKey,
  getTesdaGroundingContext,
  extractJsonFromText,
  FALLBACK_RECOMMENDATION
} from './_utils';
import {
  applySecurityMiddleware,
  logAfterRequest,
  sanitizeInput,
  validateAge,
  validateEducation,
  getClientIp,
  RecommendationSchema,
  validateRequest,
  callAiWithRetry,
  sanitizeOutput
} from './_middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  const endpoint = 'recommendation';
  
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
    return res.json({ status: 'ok', endpoint: 'recommendation', env: isDummyKey ? 'dummy' : 'live' });
  }

  if (req.method !== 'POST') {
    await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 405, false, startTime);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body with Zod
    const validation = validateRequest(RecommendationSchema, req.body);
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

    // Call AI with timeout and retry
    const response = await callAiWithRetry(() =>
      getClient().chat.completions.create({
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
      })
    );

    let rawContent = response.choices[0].message.content || "";
    
    // Sanitize AI output
    rawContent = sanitizeOutput(rawContent);
    
    let parsedData = extractJsonFromText(rawContent);

    if (!parsedData || !Array.isArray(parsedData.recommendedCourses) || parsedData.recommendedCourses.length === 0) {
      console.warn("AI returned malformed recommendation data, using fallback.");
      await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 200, false, startTime);
      return res.json(FALLBACK_RECOMMENDATION);
    }

    await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 200, false, startTime);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Recommendation Error:", error);
    
    // Handle timeout specifically
    if (error.message === 'AI API timeout') {
      await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 504, false, startTime);
      return res.status(504).json({ 
        error: "AI service timeout",
        message: "The AI service took too long to respond. Please try again in a few moments."
      });
    }
    
    await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 500, false, startTime);
    res.status(500).json({ error: "Failed to load matching recommendation. Please try again." });
  }
}
