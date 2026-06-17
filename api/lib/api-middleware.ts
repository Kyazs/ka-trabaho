import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { z } from 'zod';
import xss from 'xss';

dotenv.config();

const memoryRateLimits = new Map<string, { count: number; date: string }>();

const getMemoryRateLimitKey = (ip: string, endpoint: string): string =>
  `${ip}:${endpoint}:${new Date().toISOString().split('T')[0]}`;

const checkMemoryRateLimit = (ip: string, endpoint: string): { allowed: boolean; remaining: number; resetDate: string; count: number } => {
  const today = new Date().toISOString().split('T')[0];
  const resetDate = new Date();
  resetDate.setHours(24, 0, 0, 0);
  const key = getMemoryRateLimitKey(ip, endpoint);
  const entry = memoryRateLimits.get(key);

  if (!entry || entry.date !== today) {
    memoryRateLimits.set(key, { count: 0, date: today });
    return { allowed: true, remaining: 5, resetDate: resetDate.toISOString(), count: 0 };
  }

  const remaining = Math.max(0, 5 - entry.count);
  return { allowed: entry.count < 5, remaining, resetDate: resetDate.toISOString(), count: entry.count };
};

const incrementMemoryRateLimit = (ip: string, endpoint: string): void => {
  const today = new Date().toISOString().split('T')[0];
  const key = getMemoryRateLimitKey(ip, endpoint);
  const entry = memoryRateLimits.get(key);

  if (!entry || entry.date !== today) {
    memoryRateLimits.set(key, { count: 1, date: today });
  } else {
    entry.count += 1;
  }
};

// Supabase client (lazy init)
let _supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!_supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (url && key) {
      _supabase = createClient(url, key);
    }
  }
  return _supabase;
};

export const isSupabaseConfigured = (): boolean => {
  return !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_KEY;
};

// Constants
export const MAX_BODY_SIZE = 50 * 1024; // 50KB
export const MAX_HISTORY_LENGTH = 20;
export const AI_TIMEOUT_MS = 15000; // 15 seconds
export const AI_RETRY_DELAY_MS = 3000; // 3 seconds

// Zod Schemas
export const ProfileSchema = z.object({
  age: z.number().int().min(15).max(24),
  education: z.enum([
    'Elementary Graduate',
    'Elementary Undergrad',
    'Junior High School Graduate',
    'Junior High Undergrad',
    'Senior High School Graduate',
    'ALS Graduate',
    'College Level Undergrad',
    'College Graduate'
  ]),
  region: z.string().min(1).max(10),
  province: z.string().max(100).optional(),
  interests: z.string().max(500).optional(),
  practicalSkills: z.string().max(500).optional(),
  careerGoal: z.string().max(500).optional(),
});

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string().min(1).max(2000),
});

export const ScoredCandidateSchema = z.object({
  code: z.string().max(20),
  localScore: z.number().int().min(0).max(99),
  reasonKeys: z.array(z.string().max(30)).max(5),
});

export const ChatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(ChatMessageSchema).max(MAX_HISTORY_LENGTH).optional(),
  userProfile: ProfileSchema.extend({
    topMatchedCourses: z.array(z.string().max(20)).max(3).optional(),
  }).optional(),
});

export const JobRecommendationSchema = ProfileSchema.extend({
  candidates: z.array(ScoredCandidateSchema).max(5).optional(),
});
export const RecommendationSchema = ProfileSchema.extend({
  candidates: z.array(ScoredCandidateSchema).max(6).optional(),
});

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  process.env.APP_URL,
  'http://localhost:3000',
  'https://localhost:3000',
].filter(Boolean) as string[];

// Security headers
export const setSecurityHeaders = (res: VercelResponse, remaining: number, resetDate: string) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('X-RateLimit-Limit', '5');
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, remaining)));
  res.setHeader('X-RateLimit-Reset', resetDate);
};

// CORS handler with origin restriction
export const setCorsHeaders = (req: VercelRequest, res: VercelResponse) => {
  const origin = req.headers.origin || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);
  
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', process.env.APP_URL || 'https://localhost:3000');
  } else {
    res.setHeader('Access-Control-Allow-Origin', process.env.APP_URL || 'https://localhost:3000');
  }
  
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
};

// Extract real client IP from Vercel headers
export const getClientIp = (req: VercelRequest): string => {
  return req.socket?.remoteAddress || 'unknown';
};

// Check if IP is localhost (dev exemption)
export const isLocalhost = (ip: string): boolean => {
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
};

// Body size checker
export const checkBodySize = (req: VercelRequest): boolean => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > MAX_BODY_SIZE) {
    return false;
  }
  return true;
};

// Content-Type checker
export const checkContentType = (req: VercelRequest): boolean => {
  if (req.method !== 'POST') return true;
  const contentType = req.headers['content-type'] || '';
  return contentType.includes('application/json');
};

// Check if IP is blocked
export const checkBlocked = async (ip: string, endpoint: string): Promise<{ blocked: boolean; reason?: string; until?: string }> => {
  const supabase = getSupabase();
  if (!supabase) return { blocked: false };
  
  try {
    const { data, error } = await supabase
      .from('blocked_ips')
      .select('reason, blocked_until')
      .eq('ip_address', ip)
      .eq('endpoint', endpoint)
      .single();
    
    if (error || !data) return { blocked: false };
    
    // Check if temporary block has expired
    if (data.blocked_until && new Date(data.blocked_until) < new Date()) {
      // Unblock expired entries
      await supabase.from('blocked_ips').delete().eq('ip_address', ip).eq('endpoint', endpoint);
      return { blocked: false };
    }
    
    return {
      blocked: true,
      reason: data.reason,
      until: data.blocked_until || undefined
    };
  } catch (err) {
    console.error('[checkBlocked] Error:', err);
    return { blocked: false }; // Fail open to avoid blocking legitimate users on DB errors
  }
};

// Rate limit checker
export const checkRateLimit = async (ip: string, endpoint: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetDate: string;
  count: number;
}> => {
  const supabase = getSupabase();
  if (!supabase) {
    return checkMemoryRateLimit(ip, endpoint);
  }
  
  const today = new Date().toISOString().split('T')[0];
  const resetDate = new Date();
  resetDate.setHours(24, 0, 0, 0);
  
  try {
    // Check current count
    const { data: existing, error: fetchError } = await supabase
      .from('rate_limits')
      .select('request_count')
      .eq('ip_address', ip)
      .eq('endpoint', endpoint)
      .eq('request_date', today)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('[checkRateLimit] Fetch error:', fetchError);
      return checkMemoryRateLimit(ip, endpoint);
    }
    
    const count = existing?.request_count || 0;
    const remaining = Math.max(0, 5 - count);
    
    return {
      allowed: count < 5,
      remaining,
      resetDate: resetDate.toISOString(),
      count
    };
  } catch (err) {
    console.error('[checkRateLimit] Error:', err);
    return checkMemoryRateLimit(ip, endpoint);
  }
};

// Increment rate limit counter
export const incrementRateLimit = async (ip: string, endpoint: string): Promise<void> => {
  const supabase = getSupabase();
  if (!supabase) {
    incrementMemoryRateLimit(ip, endpoint);
    return;
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('request_count')
      .eq('ip_address', ip)
      .eq('endpoint', endpoint)
      .eq('request_date', today)
      .single();
    
    if (existing) {
      await supabase
        .from('rate_limits')
        .update({
          request_count: existing.request_count + 1,
          last_request_at: new Date().toISOString()
        })
        .eq('ip_address', ip)
        .eq('endpoint', endpoint)
        .eq('request_date', today);
    } else {
      await supabase
        .from('rate_limits')
        .insert({
          ip_address: ip,
          endpoint,
          request_date: today,
          request_count: 1,
          last_request_at: new Date().toISOString()
        });
    }
  } catch (err) {
    console.error('[incrementRateLimit] Error:', err);
  }
};

// Block an IP
export const blockIp = async (ip: string, endpoint: string, count: number, permanent: boolean = false): Promise<void> => {
  const supabase = getSupabase();
  if (!supabase) return;
  
  const blockedUntil = permanent ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  
  try {
    await supabase
      .from('blocked_ips')
      .upsert({
        ip_address: ip,
        endpoint,
        reason: permanent ? 'Repeated abuse - permanent block' : 'Rate limit exceeded (5 requests/day)',
        request_count_at_block: count,
        blocked_at: new Date().toISOString(),
        blocked_until: blockedUntil
      }, { onConflict: 'ip_address' });
  } catch (err) {
    console.error('[blockIp] Error:', err);
  }
};

// Log request
export const logRequest = async (
  ip: string,
  endpoint: string,
  userAgent: string | undefined,
  statusCode: number,
  wasBlocked: boolean,
  responseTimeMs: number
): Promise<void> => {
  const supabase = getSupabase();
  if (!supabase) return;
  
  try {
    await supabase.from('request_logs').insert({
      ip_address: ip,
      endpoint,
      user_agent: userAgent?.substring(0, 500) || null,
      status_code: statusCode,
      was_blocked: wasBlocked,
      response_time_ms: responseTimeMs
    });
  } catch (err) {
    console.error('[logRequest] Error:', err);
  }
};

// Input sanitization
export const sanitizeInput = (input: string | undefined, maxLength: number = 500): string => {
  if (!input) return '';
  
  // Strip HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Trim and limit length
  sanitized = sanitized.trim().substring(0, maxLength);
  
  // Block common prompt injection patterns
  const injectionPatterns = [
    /ignore\s+(previous|above|the\s+above)/i,
    /system\s+prompt/i,
    /you\s+are\s+now/i,
    /DAN\b/i,
    /jailbreak/i,
    /ignore\s+all\s+previous/i,
  ];
  
  for (const pattern of injectionPatterns) {
    if (pattern.test(sanitized)) {
      throw new Error('Invalid input: Potential prompt injection detected.');
    }
  }
  
  return sanitized;
};

// Output sanitization (strip ALL HTML, detect prompt leakage, truncate)
export const sanitizeOutput = (output: string | null | undefined): string => {
  if (!output) return '';
  
  let sanitized = output;
  
  // Remove code blocks (prevent code injection in rendered output)
  sanitized = sanitized.replace(/```[\s\S]*?```/g, '');
  
  // Detect and redact system prompt leakage
  const systemPromptLeakagePatterns = [
    /STRICT JSON OUTPUT REQUIRED/i,
    /You are a Filipino vocational counselor/i,
    /You are a Filipino career counselor/i,
    /You are "Ka-TrabaHO"/i,
    /system prompt/i,
    /ignore all previous instructions/i,
  ];
  
  for (const pattern of systemPromptLeakagePatterns) {
    if (pattern.test(sanitized)) {
      console.warn('[sanitizeOutput] System prompt leakage detected, redacting.');
      sanitized = '[Response redacted for security reasons]';
      break;
    }
  }
  
  // Truncate to max 4000 characters
  if (sanitized.length > 4000) {
    sanitized = sanitized.substring(0, 4000) + '... [truncated]';
  }
  
  return sanitized;
};

// Validate education enum
export const VALID_EDUCATION_LEVELS = [
  'Elementary Graduate',
  'Elementary Undergrad',
  'Junior High School Graduate',
  'Junior High Undergrad',
  'Senior High School Graduate',
  'ALS Graduate',
  'College Level Undergrad',
  'College Graduate'
];

export const validateEducation = (education: string): boolean => {
  return VALID_EDUCATION_LEVELS.includes(education);
};

// Validate age
export const validateAge = (age: number): boolean => {
  return typeof age === 'number' && age >= 15 && age <= 24;
};

// AI API call with timeout and retry
export const callAiWithTimeout = async <T>(
  apiCall: () => Promise<T>,
  timeoutMs: number = AI_TIMEOUT_MS
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('AI API timeout'));
    }, timeoutMs);
    
    apiCall()
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

// AI API call with timeout and auto-retry
export const callAiWithRetry = async <T>(
  apiCall: () => Promise<T>,
  timeoutMs: number = AI_TIMEOUT_MS,
  retryDelayMs: number = AI_RETRY_DELAY_MS
): Promise<T> => {
  try {
    return await callAiWithTimeout(apiCall, timeoutMs);
  } catch (error) {
    console.warn(`[callAiWithRetry] First attempt failed, retrying after ${retryDelayMs}ms...`);
    await new Promise(resolve => setTimeout(resolve, retryDelayMs));
    return await callAiWithTimeout(apiCall, timeoutMs);
  }
};

// Main security middleware
export const applySecurityMiddleware = async (
  req: VercelRequest,
  res: VercelResponse,
  endpoint: string
): Promise<{ allowed: boolean; ip: string; statusCode?: number; body?: any }> => {
  const startTime = Date.now();
  
  // Handle CORS preflight
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') {
    return { allowed: false, ip: '', statusCode: 200 };
  }
  
  // Check Content-Type for POST requests
  if (!checkContentType(req)) {
    return {
      allowed: false,
      ip: '',
      statusCode: 415,
      body: {
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json for POST requests.'
      }
    };
  }
  
  // Check body size
  if (!checkBodySize(req)) {
    return {
      allowed: false,
      ip: '',
      statusCode: 413,
      body: {
        error: 'Payload Too Large',
        message: 'Request body too large. Maximum size is 50KB.'
      }
    };
  }
  
  const ip = getClientIp(req);
  
  // Localhost exemption for development
  if (isLocalhost(ip)) {
    setSecurityHeaders(res, 5, new Date().toISOString());
    return { allowed: true, ip };
  }
  
  // Check if IP is blocked
  const blockCheck = await checkBlocked(ip, endpoint);
  if (blockCheck.blocked) {
    const statusCode = 403;
    const body = {
      error: 'Access blocked',
      message: 'Your IP address has been blocked due to repeated abuse of the API. If you believe this is an error, contact the site administrator.',
      blocked_at: new Date().toISOString(),
      blocked_until: blockCheck.until || null
    };
    
    setSecurityHeaders(res, 0, new Date().toISOString());
    await logRequest(ip, endpoint, req.headers['user-agent'] as string, statusCode, true, Date.now() - startTime);
    
    return { allowed: false, ip, statusCode, body };
  }
  
  // Check rate limit
  const rateLimit = await checkRateLimit(ip, endpoint);
  
  if (!rateLimit.allowed) {
    // Block IP for 24 hours
    await blockIp(ip, endpoint, rateLimit.count, false);
    
    const statusCode = 429;
    const body = {
      error: 'Rate limit exceeded',
      message: 'You have reached your daily limit of 5 requests for this feature. To ensure fair access for all users, please try again tomorrow. If you need assistance, contact the site administrator.',
      retry_after: '24 hours',
      requests_used: rateLimit.count,
      requests_limit: 5
    };
    
    setSecurityHeaders(res, 0, rateLimit.resetDate);
    await logRequest(ip, endpoint, req.headers['user-agent'] as string, statusCode, true, Date.now() - startTime);
    
    return { allowed: false, ip, statusCode, body };
  }
  
  // Increment rate limit
  await incrementRateLimit(ip, endpoint);
  
  // Set security headers with remaining count
  setSecurityHeaders(res, rateLimit.remaining - 1, rateLimit.resetDate);
  
  return { allowed: true, ip };
};

// Post-request logging
export const logAfterRequest = async (
  ip: string,
  endpoint: string,
  userAgent: string | undefined,
  statusCode: number,
  wasBlocked: boolean,
  startTime: number
): Promise<void> => {
  await logRequest(ip, endpoint, userAgent, statusCode, wasBlocked, Date.now() - startTime);
};

// Zod validation helper
export type ValidationResult<T> = 
  | { success: true; data: T; error?: undefined }
  | { success: false; data?: undefined; error: string };

export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> => {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { success: false, error: `Validation error: ${messages}` };
    }
    return { success: false, error: 'Invalid request data' };
  }
};

// Off-topic pattern guard — catches clearly unrelated questions before AI call
const OFF_TOPIC_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /sino\s+(ang\s+)?presidente|sino\s+(ang\s+)?senador|sino\s+(ang\s+)?mayor|sino\s+(ang\s+)?governor/i, label: 'politics' },
  { pattern: /eleksyon|election|campaign|vote\s+for|political\s+party|kandidato/i, label: 'politics' },
  { pattern: /showbiz|celebrity| artista|kapuso|kapamilya|teleserye|loveteam|chismis|chika/i, label: 'gossip' },
  { pattern: /crypto|bitcoin|ethereum|trading\s+bot|stock\s+market|betting|pustahan|sabong/i, label: 'crypto/gambling' },
  { pattern: /python|javascript|java\b|c\+\+|html|css|react|node\.js|debug\s+code|compile\s+error|syntax\s+error|git\s+push|npm\s+install/i, label: 'programming' },
  { pattern: /essay|thesis|research\s+paper|homework|assignment|school\s+project|ip|ip-proj/i, label: 'homework' },
  { pattern: /porn|sex\s+chat|nudes|onlyfans|hook\s+up|meet\s+up\s+for\s+sex/i, label: 'explicit' },
];

const OFF_TOPIC_REDIRECT = "Kapatid, sa career at livelihood journey mo ako eksperto! May tanong ka ba tungkol sa TESDA courses, trabaho, o skills training? Sabihin mo lang, nandito ako para sa iyo!";

export const checkOffTopic = (message: string): { isOffTopic: boolean; redirectResponse: string } => {
  const normalizedMessage = message.toLowerCase().trim();

  if (normalizedMessage.length < 10) {
    return { isOffTopic: false, redirectResponse: '' };
  }

  for (const { pattern } of OFF_TOPIC_PATTERNS) {
    if (pattern.test(normalizedMessage)) {
      return { isOffTopic: true, redirectResponse: OFF_TOPIC_REDIRECT };
    }
  }

  return { isOffTopic: false, redirectResponse: '' };
};
