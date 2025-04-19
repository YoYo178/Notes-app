import { allowedOrigins } from './allowedOrigins';
import { CorsOptions } from 'cors';

export const CORS_CONFIG: CorsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS Policy'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};