const ERROR_TRANSLATIONS: Record<string, string> = {
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

export function translateAuthError(message: string): string {
  const normalizedMessage = message.trim();

  for (const [english, spanish] of Object.entries(ERROR_TRANSLATIONS)) {
    if (normalizedMessage.toLowerCase().includes(english.toLowerCase())) {
      return spanish;
    }
  }

  return normalizedMessage;
}
