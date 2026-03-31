const ERROR_TRANSLATIONS: Record<string, string> = {
  'Invalid email or password': 'Email o contrasena incorrectos',
  'Invalid email': 'Email invalido',
  'Invalid password': 'Contrasena incorrecta',
  'User not found': 'Usuario no encontrado',
  'Email already in use': 'Este email ya esta registrado',
  'User already exists': 'Este usuario ya existe',
  'Too many requests': 'Demasiados intentos, espera un momento',
  'Password too short': 'La contrasena es muy corta',
  'Password too long': 'La contrasena es muy larga',
  'Invalid token': 'El enlace ha expirado o no es valido',
  'Token expired': 'El enlace ha expirado',
  'Email not verified': 'Verifica tu email antes de iniciar sesion',
  'Session expired': 'Tu sesion ha expirado',
  Unauthorized: 'No autorizado',
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
