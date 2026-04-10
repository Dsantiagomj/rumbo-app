import { z } from 'zod';

/**
 * Environment variable schema for the API server.
 *
 * In production every required key must be present; the parse will throw and
 * prevent the server from starting with a misconfigured environment.
 *
 * In development (`NODE_ENV !== 'production'`) missing keys are tolerated by
 * falling back to sensible local defaults so the DX is friction-free.
 */

const isProduction = process.env.NODE_ENV === 'production';

/** Helper: required in production, optional with fallback in dev. */
function requiredInProd<T extends z.ZodTypeAny>(schema: T, devDefault: NoInfer<z.output<T>>) {
  // biome-ignore lint/suspicious/noExplicitAny: Zod generic boundary
  return isProduction ? schema : (schema.optional().default(devDefault as any) as unknown as T);
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // --- Server ---
  API_PORT: z.coerce.number().int().positive().default(3001),

  // --- Database ---
  DATABASE_URL: z.string().url(),

  // --- Auth ---
  BETTER_AUTH_SECRET: requiredInProd(z.string().min(1), 'dev-secret-do-not-use-in-prod'),
  BETTER_AUTH_URL: requiredInProd(z.string().url(), 'http://localhost:3001'),

  // --- URLs ---
  APP_URL: requiredInProd(z.string().min(1), 'http://localhost:5173'),
  API_URL: z.string().url().optional(),

  // --- Email ---
  RESEND_API_KEY: requiredInProd(z.string().min(1), 'dev-resend-key'),
  EMAIL_FROM: z.string().min(1).default('RumboApp <noreply@dsmj.dev>'),

  // --- AI (always optional) ---
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// ---------------------------------------------------------------------------
// Validate once at module load and expose a frozen singleton.
// Any consumer imports `env` instead of reading `process.env` directly.
// ---------------------------------------------------------------------------

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error('❌ Invalid environment variables:', errors);
    if (isProduction) {
      throw new Error('Invalid environment variables — refusing to start.');
    }
    // In dev, warn loudly but still let the server start with defaults
    console.warn('⚠️  Some env vars are missing — using dev defaults. Check .env.example.');
    // Re-parse with partial to get whatever we can
    return envSchema.parse({
      ...Object.fromEntries(Object.entries(process.env).filter(([, v]) => v !== undefined)),
    });
  }

  return result.data;
}

export const env: Env = Object.freeze(validateEnv());
