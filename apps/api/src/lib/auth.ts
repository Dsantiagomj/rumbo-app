import { db } from '@rumbo/db';
import * as schema from '@rumbo/db/schema';
import type { User } from 'better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sendEmail } from '../services/email.js';
import { getResetPasswordEmail, getVerifyEmailTemplate } from '../services/email-templates.js';
import { env } from './env.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, token }: { user: User; token: string }) => {
      const resetUrl = `${env.APP_URL}/reset-password?token=${token}`;
      const { subject, html } = getResetPasswordEmail({ userName: user.name, resetUrl });
      await sendEmail({ to: user.email, subject, html });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }: { user: User; token: string }) => {
      const verifyUrl = `${env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${encodeURIComponent(env.APP_URL)}`;
      const { subject, html } = getVerifyEmailTemplate({ userName: user.name, verifyUrl });
      await sendEmail({ to: user.email, subject, html });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  trustedOrigins: [env.APP_URL],
});

export type Auth = typeof auth;
