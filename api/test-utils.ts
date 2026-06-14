import { VercelRequest, VercelResponse } from '@vercel/node';
import { isDummyKey, getTesdaGroundingContext } from './_utils';

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
      env: isDummyKey ? 'dummy' : 'live',
      contextLength: context.length,
      message: 'Utils import works'
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error', 
      message: (err as Error).message,
      stack: (err as Error).stack 
    });
  }
}