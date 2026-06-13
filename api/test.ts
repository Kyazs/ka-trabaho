import { VercelRequest, VercelResponse } from '@vercel/node';
import { isDummyKey, getTesdaGroundingContext, SECTORS_DATA } from './_utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const context = getTesdaGroundingContext();
    res.json({ 
      status: 'ok', 
      message: 'Test API working',
      env: process.env.FIREWORKS_API_KEY ? 'key-set' : 'key-missing',
      isDummyKey: isDummyKey,
      sectorsCount: SECTORS_DATA.length,
      contextLength: context.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error', 
      message: (err as Error).message,
      stack: (err as Error).stack 
    });
  }
}