import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().trim().url().optional().or(z.literal('')),
  DEV: z.boolean(),
});

const parsedEnv = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  DEV: import.meta.env.DEV,
});

export const env = {
  apiUrl: parsedEnv.VITE_API_URL?.trim() || (parsedEnv.DEV ? 'http://localhost:3001' : ''),
} as const;
