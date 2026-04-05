# RumboApp — Personal Finance PWA

## Project Overview

RumboApp is a personal finance Progressive Web App for tracking income, expenses, budgets, and financial goals. Built as a Turborepo monorepo with pnpm workspaces.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TanStack Router, TanStack Query, Zustand |
| Styling | Tailwind CSS v4, Shadcn/ui |
| Forms | React Hook Form + Zod |
| Backend | Hono (Node.js + Vercel adapter) |
| Database | Neon PostgreSQL + Drizzle ORM |
| Auth | Better Auth |
| Email | Resend |
| AI | Vercel AI SDK |
| PWA | vite-plugin-pwa |
| Tooling | Turborepo, pnpm, Biome, TypeScript strict |

## Monorepo Structure

```
rumboApp/
├── apps/
│   ├── web/          # React SPA (Vite + TanStack Router)
│   └── api/          # Hono API (Node.js dev, Vercel prod)
├── packages/
│   ├── shared/       # Zod schemas, types, constants (source of truth)
│   └── db/           # Drizzle ORM schema, migrations, db client
└── tooling/
    ├── eslint/       # Shared ESLint config with import boundaries
    └── typescript/   # Shared tsconfig base
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm dev:web` | Start web + API |
| `pnpm dev:api` | Start API only |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Run Biome linter with auto-fix |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm test` | Run all tests |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run Drizzle migrations |
| `pnpm db:studio` | Open Drizzle Studio |

## Architecture: Bulletproof React (Adapted)

### Import Boundaries (ENFORCED by ESLint)

```
app/routes/ → CAN import from features/ and shared/
features/   → CANNOT import from other features/
shared/     → CANNOT import from features/ or app/
```

### Feature Structure

```
features/{domain}/
├── components/       # Feature-specific UI components
├── api/
│   ├── queries.ts    # TanStack Query queryOptions
│   └── mutations.ts  # TanStack Query mutationOptions
├── hooks/            # Feature-specific hooks
├── types.ts          # Feature-specific types
└── utils.ts          # Feature-specific utilities
```

## Rules

### DO

- Use Zod schemas from `@rumbo/shared` as the source of truth for data models
- Use direct imports (no barrel files except package entry points)
- Keep files under 300 lines (exception: vendored/generated files — see below)
- Use descriptive file names (kebab-case)
- Put business logic in services, not route handlers
- Use TypeScript strict mode everywhere
- Write all code in English (variables, functions, comments, docs)
- Write all user-facing UI copy in Spanish (see "UI Copy & Strings" below)
- Access environment variables through the validated env layer (`lib/env.ts`), not raw `process.env`

### DON'T

- Import across features (`features/X` cannot import from `features/Y`)
- Create barrel files (`index.ts` re-exports) inside features
- Put business logic in route handlers — use services
- Use `any` / `unknown` without justification
- Use `npm` — always `pnpm`
- Scatter raw `process.env` reads outside `lib/env.ts` — add new vars to the Zod schema instead
- Normalize temporary workarounds — mark them with `// HACK:` or `// TEMP:` and a reason

### Vendored & Generated Files

Files matching `*.gen.ts` or checked-in vendored code (e.g. Shadcn/ui primitives) may exceed the 300-line limit and are excluded from Biome via `biome.json`. When adding new exceptions, update both the `files.includes` ignore list in `biome.json` and note them here.

## Code Style

| Concern | Convention |
|---------|-----------|
| File names | `kebab-case.ts` |
| Components | `PascalCase` |
| Functions | `camelCase` |
| Types/Interfaces | `PascalCase` |
| Constants | `SCREAMING_SNAKE_CASE` |
| CSS | Tailwind v4 utility classes |

## UI Copy & Strings

- **Language**: All user-facing copy is in Spanish. No full i18n framework — the project uses a lightweight typed string registry instead.
- **Registry location**: `shared/lib/strings.ts` for shell/global copy; `features/{domain}/strings.ts` for feature-specific copy.
- **Convention**: Keys are English, values are Spanish. No runtime locale switching.
- **New copy**: Always add strings to the appropriate registry file. Do not scatter inline Spanish strings in components.
- **Toasts**: Standardized on **Sileo** (`shared/lib/toast.ts`) with **top-center** placement. Import `toast` from `@/shared/lib/toast`, never import Sileo directly.

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` — Auth secret key
- `APP_URL` — Frontend URL (default: http://localhost:5173)
- `API_URL` / `VITE_API_URL` — API URL (default: http://localhost:3001)
- `RESEND_API_KEY` — Email service API key
- `OPENAI_API_KEY` — AI provider key
