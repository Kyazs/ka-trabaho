import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getClient,
  isDummyKey,
  getTesdaGroundingContext
} from './lib/api-utils.js';
import {
  applySecurityMiddleware,
  logAfterRequest,
  sanitizeInput,
  ChatSchema,
  validateRequest,
  callAiWithRetry,
  sanitizeOutput,
  MAX_HISTORY_LENGTH
} from './lib/api-middleware.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  const endpoint = 'chat';
  
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
    return res.json({ status: 'ok', endpoint: 'chat' });
  }

  if (req.method !== 'POST') {
    await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 405, false, startTime);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body with Zod
    const validation = validateRequest(ChatSchema, req.body);
    if (!validation.success) {
      await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 400, false, startTime);
      return res.status(400).json({ error: validation.error });
    }

    const { message, history, userProfile } = validation.data;

    if (isDummyKey) {
      await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 200, false, startTime);
      return res.json({
        text: "Mabuhay! Ako si Ka-TrabaHO, ang iyong TESDA AI counselor companion. Humihingi ako ng pasensya dahil hindi pa fully activated ang Fireworks API key. Pero maaari pa rin nating tignan ang mga kurso sa pamamagitan ng filter sa ibaba!"
      });
    }

    const groundContext = getTesdaGroundingContext();
    
    // Sanitize user profile data if present
    let studentContext = "The student has not completed their assessment profile yet. Politely invite them to finish the quick matching steps above to get highly customized answers!";
    
    if (userProfile) {
      const sanitizedInterests = sanitizeInput(userProfile.interests, 500);
      studentContext = `You are chatting with a student who is ${userProfile.age} years old from ${userProfile.province || userProfile.region}. Active educational status: Finished ${userProfile.education}. Interests: ${sanitizedInterests || "none specified"}.`;
      const topCourses = (userProfile as any).topMatchedCourses as string[] | undefined;
      if (topCourses && topCourses.length > 0) {
        studentContext += ` Their top matched TESDA courses are: ${topCourses.join(', ')}. Reference these naturally in conversation.`;
      }
    }

    const systemInstruction = `You are "Ka-TrabaHO", an official TESDA Career & Enrolment AI Counselor specifically designed for out-of-school Filipino youth aged 15-24.
Your goal is to guide them, answer questions about vocational programs, explain requirements (birth certificate, high school credentials, ALS certificate), explain financial grants (free tuition, daily allowance), and help them feel excited about learning a new trade.
- Speak in a heart-to-heart, friendly, warm, and highly supportive Taglish (English and Tagalog) conversational style. Use words like "Kapatid", "Ka-TrabaHO", "bilib ako sa 'yo", "galing!", "Kaya mo 'yan!".
- Avoid robotic or cold corporate speak. Treat them with respect and empathy. Many out-of-school youth face immense financial or personal pressure — offer reassurance that TESDA is an open-door pathway to better wages.
- Incorporate this ground truth course menu when answering queries:
${groundContext}
- Always prioritize safety, and motivate them to visit local TESDA assessment/training schools.
- User status: ${studentContext}`;

    const messages: any[] = [
      {
        role: "system",
        content: systemInstruction
      }
    ];

    if (history) {
      // Sanitize history messages and limit to MAX_HISTORY_LENGTH
      const sanitizedHistory = history
        .slice(-MAX_HISTORY_LENGTH)
        .map((item: any) => ({
          role: item.role,
          content: sanitizeInput(item.text, 2000)
        }))
        .filter((item: any) => item.content); // Remove empty messages
      
      messages.push(...sanitizedHistory);
    }

    messages.push({
      role: "user",
      content: message
    });

    // Call AI with timeout and retry
    const response = await callAiWithRetry(() =>
      getClient().chat.completions.create({
        model: "accounts/fireworks/models/kimi-k2p7-code",
        messages: messages,
        temperature: 0.7,
      })
    );

    let aiText = response.choices[0].message.content || "";
    
    // Sanitize AI output
    aiText = sanitizeOutput(aiText);

    await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 200, false, startTime);
    res.json({ text: aiText });
  } catch (error: any) {
    console.error("Chat Error:", error);
    
    // Handle timeout specifically
    if (error.message === 'AI API timeout') {
      await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 504, false, startTime);
      return res.status(504).json({ 
        error: "AI service timeout",
        message: "Oops! The AI service took too long to respond. Please wait a moment and try again.",
        retry_after: "3 seconds"
      });
    }
    
    await logAfterRequest(ip, endpoint, req.headers['user-agent'] as string, 500, false, startTime);
    res.status(500).json({ error: "Oops! May konting glitch sa aking connection. Please wait standard minutes and reply again." });
  }
}
