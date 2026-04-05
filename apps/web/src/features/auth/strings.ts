// ---------------------------------------------------------------------------
// Auth feature string registry — Spanish-first, typed, no i18n framework.
//
// All user-facing copy for the authentication flow lives here:
// form headings, labels, buttons, descriptions, and error translations.
//
// Rules:
//   - Keys are in English, values in Spanish.
//   - No runtime locale switching — this is a compile-time registry.
// ---------------------------------------------------------------------------

// ─── Login ───────────────────────────────────────────────────────────────────

export const LOGIN = {
  heading: 'Bienvenido de vuelta',
  noAccount: 'Aun no tienes cuenta?',
  createAccount: 'Crear una',
  emailLabel: 'Tu email',
  emailPlaceholder: 'tu@email.com',
  passwordLabel: 'Tu contrasena',
  forgotPassword: 'La olvidaste?',
  passwordPlaceholder: '********',
  submitLoading: 'Entrando...',
  submit: 'Entrar',
  fallbackError: 'Error al iniciar sesion',
} as const;

// ─── Signup ──────────────────────────────────────────────────────────────────

export const SIGNUP = {
  heading: 'Vamos a conocernos',
  hasAccount: 'Ya tienes cuenta?',
  goToLogin: 'Entra aqui',
  nameLabel: 'Como te llamas?',
  namePlaceholder: 'Tu nombre o como prefieres ser llamado',
  emailLabel: 'Tu email',
  emailPlaceholder: 'tu@email.com',
  passwordLabel: 'Elige una contrasena',
  passwordPlaceholder: 'Minimo 8 caracteres',
  confirmPasswordLabel: 'Repite la contrasena',
  confirmPasswordPlaceholder: 'La misma de arriba',
  submitLoading: 'Creando tu cuenta...',
  submit: 'Empezar',
  fallbackError: 'Error al crear la cuenta',
} as const;

// ─── Forgot password ─────────────────────────────────────────────────────────

export const FORGOT_PASSWORD = {
  heading: 'No te preocupes',
  description: 'Te enviamos un enlace para que crees una nueva contrasena.',
  emailLabel: 'Tu email',
  emailPlaceholder: 'tu@email.com',
  submitLoading: 'Enviando...',
  submit: 'Enviarme el enlace',
  successHeading: 'Listo, revisa tu correo',
  successDescription:
    'Si hay una cuenta con ese email, te enviamos un enlace para crear una nueva contrasena.',
} as const;

// ─── Reset password ──────────────────────────────────────────────────────────

export const RESET_PASSWORD = {
  heading: 'Elige tu nueva contrasena',
  passwordLabel: 'Tu nueva contrasena',
  passwordPlaceholder: 'Minimo 8 caracteres',
  confirmLabel: 'Repitela aqui',
  confirmPlaceholder: 'La misma de arriba',
  submitLoading: 'Guardando...',
  submit: 'Guardar nueva contrasena',
  fallbackError: 'Error al restablecer la contrasena',
  invalidTokenHeading: 'Este enlace ya no funciona',
  invalidTokenDescription:
    'Puede que haya expirado o ya lo hayas usado. Pide un nuevo enlace y te lo enviamos al correo.',
  requestNewLink: 'Pedir otro enlace',
  successHeading: 'Listo, contrasena actualizada',
  successDescription: 'Ya puedes entrar con tu nueva contrasena.',
  successAction: 'Entrar',
} as const;

// ─── Verify email ────────────────────────────────────────────────────────────

export const VERIFY_EMAIL = {
  heading: 'Ya casi!',
  description: 'Te enviamos un enlace para confirmar tu email. Dale clic y listo.',
  spamHint: 'Si no lo ves, revisa en spam.',
  backToLogin: 'Volver a entrar',
} as const;

// ─── Shared auth strings ─────────────────────────────────────────────────────

export const AUTH_COMMON = {
  backToLogin: 'Volver a entrar',
  serverErrorPrefix: 'Error:',
} as const;

// ─── Error translations (EN → ES) ───────────────────────────────────────────
//
// Maps backend/BetterAuth English error messages to friendly Spanish copy.
// Used by `translateAuthError()` to normalize API errors for the UI.

export const AUTH_ERROR_TRANSLATIONS: Record<string, string> = {
  'Invalid email or password': 'Hmm, ese email o contrasena no coinciden',
  'Invalid email': 'Ese email no se ve bien, revisalo',
  'Invalid password': 'La contrasena no es correcta',
  'User not found': 'No encontramos una cuenta con ese email',
  'Email already in use': 'Ese email ya tiene una cuenta, intenta iniciar sesion',
  'User already exists': 'Ya existe una cuenta con esos datos',
  'Too many requests': 'Muchos intentos seguidos, espera un momento',
  'Password too short': 'La contrasena es muy corta',
  'Password too long': 'La contrasena es muy larga',
  'Invalid token': 'Este enlace ya no funciona, pide uno nuevo',
  'Token expired': 'Este enlace ya expiro, pide uno nuevo',
  'Email not verified': 'Primero revisa tu correo y confirma tu email',
  'Session expired': 'Tu sesion expiro, vuelve a entrar',
  Unauthorized: 'Necesitas iniciar sesion para continuar',
};
