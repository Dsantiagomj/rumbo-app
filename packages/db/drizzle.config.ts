import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'drizzle-kit';

// Load DATABASE_URL from the monorepo root .env when not already set.
// Turborepo runs db:* scripts from packages/db/ which has no .env.
if (!process.env.DATABASE_URL) {
  const dir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
  const envPath = resolve(dir, '../../.env');
  try {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^DATABASE_URL=(.+)$/);
      if (match?.[1]) {
        process.env.DATABASE_URL = match[1].trim();
        break;
      }
    }
  } catch {
    // .env not found — fall through to empty string below
  }
}

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
