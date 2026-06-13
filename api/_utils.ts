import { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { SECTORS_DATA, PHILIPPINES_REGIONS } from '../src/data/tesdaData';

// Load environment variables
dotenv.config();

// Initialize Fireworks Client
const apiKey = process.env.FIREWORKS_API_KEY || "dummy_key_for_build";
export const client = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.fireworks.ai/inference/v1",
});

export const isDummyKey = apiKey === "dummy_key_for_build";

// Helper: Provide local context summarizing the TESDA courses
export const getTesdaGroundingContext = () => {
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

// Robust JSON extraction
export const extractJsonFromText = (text: string): any | null => {
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch { /* ignore */ }

  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1]);
      if (parsed && typeof parsed === "object") return parsed;
    } catch { /* ignore */ }
  }

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

// Fallback recommendations
export const FALLBACK_RECOMMENDATION = {
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

export const FALLBACK_JOB_RECOMMENDATION = {
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

// Map AI job recommendations to existing JobRole data
export const mapAiJobsToExistingData = (aiJobs: any[], regionCode: string) => {
  if (!Array.isArray(aiJobs)) return [];
  
  return aiJobs.map((aiJob: any) => {
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

// CORS handler for Vercel
export const setCorsHeaders = (res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};