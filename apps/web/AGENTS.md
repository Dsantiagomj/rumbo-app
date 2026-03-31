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

### Path Alias

`@/` maps to `src/` — use it for all imports.
