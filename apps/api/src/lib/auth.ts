import { db } from '@rumbo/db';
import * as schema from '@rumbo/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sendEmail } from '../services/email';
import { getResetPasswordEmail, getVerifyEmailTemplate } from '../services/email-templates';

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
    sendResetPassword: async ({ user, url }) => {
      const { subject, html } = getResetPasswordEmail({ userName: user.name, resetUrl: url });
      await sendEmail({ to: user.email, subject, html });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { subject, html } = getVerifyEmailTemplate({ userName: user.name, verifyUrl: url });
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
  trustedOrigins: [process.env.APP_URL ?? 'http://localhost:5173'],
});

export type Auth = typeof auth;
