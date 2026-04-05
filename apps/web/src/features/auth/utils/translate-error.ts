import { AUTH_ERROR_TRANSLATIONS } from '@/features/auth/strings';

export function translateAuthError(message: string): string {
  const normalizedMessage = message.trim();

  for (const [english, spanish] of Object.entries(AUTH_ERROR_TRANSLATIONS)) {
    if (normalizedMessage.toLowerCase().includes(english.toLowerCase())) {
      return spanish;
    }
  }

  return normalizedMessage;
}
