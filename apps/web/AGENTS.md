# apps/web — Frontend Conventions

## Stack

- **React 19** with Vite
- **TanStack Router** — file-based routing in `src/app/routes/`
- **TanStack Query** — server state management
- **Zustand** — client state management
- **React Hook Form** + Zod — form handling and validation
- **Tailwind CSS v4** — CSS-first config (no tailwind.config.js)
- **Shadcn/ui** — component library (components in `src/shared/components/ui/`)

## Directory Structure

```
src/
├── app/
│   ├── providers.tsx     # QueryClient, auth, theme providers
│   ├── router.tsx        # TanStack Router setup
│   └── routes/           # File-based routes (pages)
│       ├── __root.tsx    # Root layout with providers
│       └── index.tsx     # Home page
├── features/             # Feature modules (Bulletproof React)
│   └── {domain}/
│       ├── components/   # Feature UI components
│       ├── api/
│       │   ├── queries.ts
│       │   └── mutations.ts
│       ├── hooks/
│       ├── types.ts
│       └── utils.ts
├── shared/
│   ├── components/ui/    # Shadcn/ui components
│   ├── hooks/            # Shared hooks
│   ├── lib/
│   │   └── api-client.ts # Configured API client
│   ├── utils/            # Shared utilities
│   └── types/            # Shared frontend types
├── main.tsx              # App entry point
└── globals.css           # Tailwind v4 imports + CSS variables
```

## Conventions

### Routes

Routes in `app/routes/` ARE pages — they compose features directly.
Do not put business logic in route components.

### State Management

- **Server state**: TanStack Query (`queryOptions()` / `mutationOptions()`)
- **Client state**: Zustand stores (only when truly needed for UI state)
- Never mix: don't put server data in Zustand

### Forms

- Use React Hook Form with Zod resolver
- Zod schemas come from `@rumbo/shared` or feature-local `types.ts`

### Styling

- Tailwind CSS v4 with CSS-first config
- Shadcn/ui components in `shared/components/ui/`
- Use CSS variables for theming (defined in `globals.css`)
- Dark mode via `.dark` class on `<html>`

### UI Copy

- All user-facing text is in Spanish. Code stays in English.
- Shell/global strings live in `shared/lib/strings.ts`; feature-specific strings in `features/{domain}/strings.ts`.
- Keys are English, values are Spanish. No runtime locale switching.
- New copy goes into the registry — never scatter inline Spanish strings in components.

### Toasts

- Standardized on **Sileo** via `shared/lib/toast.ts` with **top-center** placement.
- Always `import { toast } from '@/shared/lib/toast'` — never import Sileo directly.

### Accessibility

- New shell and surface components must include proper ARIA attributes: `aria-label`, `aria-current="page"` for active nav links, `role` on interactive regions, and focus management for dialogs/sheets.
- Dialogs and overlays need focus trap and Escape-key dismiss.
- Respect `prefers-reduced-motion` — use it to gate CSS transitions/animations.
- Include a skip-to-content link in the root layout.
- Use the string registry for all accessible labels (not hardcoded English strings).

### Mobile & PWA

- The viewport uses `viewport-fit=cover` — all shell chrome (headers, bottom bars, drawers) must account for safe-area insets via `env(safe-area-inset-*)`.
- Bottom bars use `paddingBottom: env(safe-area-inset-bottom, 0px)`; top-anchored chrome uses `paddingTop: env(safe-area-inset-top, 0px)`.
- Touch targets should be at least 44×44px. Add active/tap feedback (`active:scale-95` or similar) on primary actions.
- Temporary navigation workarounds (e.g. manual `history.back()` calls) must be marked `// HACK:` or `// TEMP:` with a reason and not normalized into permanent patterns.

### Path Alias

`@/` maps to `src/` — use it for all imports.
