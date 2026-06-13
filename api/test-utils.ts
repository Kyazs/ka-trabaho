import { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, isDummyKey } from './_utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    setCorsHeaders(res);
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    res.json({ 
      status: 'ok', 
      message: 'Test with _utils import',
      isDummyKey: isDummyKey,
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