// ---------------------------------------------------------------------------
// Shared UI string registry — Spanish-first, typed, no i18n framework.
//
// All user-facing copy for the app shell, navigation, and common actions
// lives here. Feature-specific strings live in their own feature module
// (e.g. features/auth/strings.ts).
//
// Rules:
//   - Keys are in English, values in Spanish.
//   - No runtime locale switching — this is a compile-time registry.
//   - Keep sections grouped by domain for easy scanning.
// ---------------------------------------------------------------------------

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV = {
  home: 'Inicio',
  transactions: 'Transacciones',
  budgets: 'Presupuestos',
  reports: 'Reportes',
  settings: 'Configuración',
  account: 'Cuenta',
  preferences: 'Preferencias',
  security: 'Seguridad',
  notifications: 'Notificaciones',
  dataPrivacy: 'Datos y privacidad',
} as const;

// ─── Shell / chrome ──────────────────────────────────────────────────────────

export const SHELL = {
  brandName: 'Rumbo',
  searchPlaceholder: 'Buscar...',
  searchMobilePlaceholder: 'Buscar en Rumbo',
  transactionSearchPlaceholder: 'Buscar por tipo, categoría, monto o nota',
  transactionSearchClearLabel: 'Limpiar búsqueda',
  addTransaction: 'Agregar transacción',
  newTransaction: 'Nueva transacción',
  add: 'Agregar',
  backToApp: 'Volver a la app',
  signOut: 'Cerrar sesión',
  openMenu: 'Abrir menú',
  closeMenu: 'Cerrar menú',
  openAssistant: 'Abrir asistente',
  closeAssistant: 'Cerrar asistente',
  assistantLabel: 'Asistente IA',
  drawerDescription: 'Cuenta y configuración',
  skipToContent: 'Ir al contenido principal',
  navMain: 'Navegación principal',
  navSettings: 'Navegación de configuración',
  navSettingsMobile: 'Secciones de configuración',
  navDrawer: 'Menú de cuenta',
  comingSoon: 'Próximamente',
  comingSoonAssistant:
    'Tu asistente financiero con IA te ayudará a analizar gastos, categorizar transacciones y gestionar presupuestos.',
} as const;

// ─── Settings pages ──────────────────────────────────────────────────────────

export const SETTINGS = {
  account: {
    title: 'Cuenta',
    description: 'Administra los detalles de tu cuenta y tu perfil.',
  },
  preferences: {
    title: 'Preferencias',
    description: 'Personaliza la apariencia, idioma y moneda de tu cuenta.',
  },
  security: {
    title: 'Seguridad',
    description: 'Administra tu contraseña, autenticación y sesiones activas.',
  },
  notifications: {
    title: 'Notificaciones',
    description: 'Configura tus alertas, recordatorios y notificaciones.',
  },
  dataPrivacy: {
    title: 'Datos y privacidad',
    description: 'Exporta, importa o elimina tus datos financieros.',
  },
  dangerZone: 'Zona de riesgo',
  signOutLabel: 'Cerrar sesión',
  signOutDescription: 'Cierra tu sesión en este dispositivo.',
} as const;

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const DASHBOARD = {
  welcomeBack: (name: string) => `Bienvenido de vuelta, ${name}`,
  gettingStartedTitle: 'Primeros pasos',
  gettingStartedDescription:
    'Tu panel financiero se está configurando. Empieza agregando tu primera transacción.',
  cards: {
    balance: 'Balance',
    income: 'Ingresos',
    expenses: 'Gastos',
    savings: 'Ahorros',
  },
} as const;

// ─── Toast notifications ─────────────────────────────────────────────────────

export const TOAST = {
  signOutSuccess: 'Sesión cerrada correctamente',
  signOutError: 'Error al cerrar sesión',
  genericError: 'Algo salió mal',
  genericErrorDescription: 'Intenta de nuevo más tarde.',
  savedSuccess: 'Guardado correctamente',
} as const;

// ─── Common / generic ────────────────────────────────────────────────────────

export const COMMON = {
  unexpectedError: 'Ocurrió un error inesperado',
  showPassword: 'Mostrar contraseña',
  hidePassword: 'Ocultar contraseña',
} as const;
