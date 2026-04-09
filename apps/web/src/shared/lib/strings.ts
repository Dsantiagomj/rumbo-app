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
  transactions: 'Movimientos',
  budgets: 'Presupuestos',
  reports: 'Reportes',
  settings: 'Configuracion',
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
  addTransaction: 'Agregar movimiento',
  newTransaction: 'Nuevo movimiento',
  add: 'Agregar',
  backToApp: 'Volver a la app',
  signOut: 'Cerrar sesion',
  openMenu: 'Abrir menu',
  closeMenu: 'Cerrar menu',
  openAssistant: 'Abrir asistente',
  closeAssistant: 'Cerrar asistente',
  assistantLabel: 'Asistente IA',
  drawerDescription: 'Cuenta y configuracion',
  skipToContent: 'Ir al contenido principal',
  navMain: 'Navegacion principal',
  navSettings: 'Navegacion de configuracion',
  navSettingsMobile: 'Secciones de configuracion',
  navDrawer: 'Menu de cuenta',
  comingSoon: 'Proximamente',
  comingSoonAssistant:
    'Tu asistente financiero con IA te ayudara a analizar gastos, categorizar transacciones y gestionar presupuestos.',
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
    description: 'Administra tu contrasena, autenticacion y sesiones activas.',
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
  signOutLabel: 'Cerrar sesion',
  signOutDescription: 'Cierra tu sesion en este dispositivo.',
} as const;

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const DASHBOARD = {
  welcomeBack: (name: string) => `Bienvenido de vuelta, ${name}`,
  gettingStartedTitle: 'Primeros pasos',
  gettingStartedDescription:
    'Tu panel financiero se esta configurando. Empieza agregando tu primera transaccion.',
  cards: {
    balance: 'Balance',
    income: 'Ingresos',
    expenses: 'Gastos',
    savings: 'Ahorros',
  },
} as const;

// ─── Toast notifications ─────────────────────────────────────────────────────

export const TOAST = {
  signOutSuccess: 'Sesion cerrada correctamente',
  signOutError: 'Error al cerrar sesion',
  genericError: 'Algo salio mal',
  genericErrorDescription: 'Intenta de nuevo mas tarde.',
  savedSuccess: 'Guardado correctamente',
} as const;

// ─── Common / generic ────────────────────────────────────────────────────────

export const COMMON = {
  unexpectedError: 'Ocurrio un error inesperado',
  showPassword: 'Mostrar contrasena',
  hidePassword: 'Ocultar contrasena',
} as const;
