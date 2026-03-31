# apps/api — Backend Conventions

## Stack

- **Hono** web framework
- **@hono/node-server** for local development
- **Vercel** for production deployment
- **Better Auth** for authentication
- **Resend** for transactional email
- **Vercel AI SDK** for AI/chat/streaming routes
- **Zod** for request/env validation

## Directory Structure

```
src/
├── index.ts          # Hono app entry + server bootstrap
├── routes/           # Route handlers (1 file per resource)
│   └── health.ts     # GET /health
├── middleware/
│   └── cors.ts       # CORS middleware
├── services/         # Business logic (NOT in route handlers)
└── lib/
    ├── env.ts        # Environment validation with Zod
    └── db.ts         # Drizzle client re-export
```

## Conventions

### Route Pattern

- 1 file per resource in `routes/`
- Keep route handlers thin — delegate to services
- Validate inputs with Zod schemas from `@rumbo/shared`

### Services

- Business logic goes in `services/`, not route handlers
- Services receive validated data, return typed results
- Services handle DB queries via `@rumbo/db`

### Validation

- Zod schemas from `@rumbo/shared` for request body validation
- `lib/env.ts` validates all environment variables at startup

### Auth

- Better Auth middleware for protected routes
- Auth configuration in a dedicated auth setup file

### AI

- Vercel AI SDK (`ai` package) for chat and streaming routes
- Use `streamText` / `generateText` from the SDK

### Database

- Access via `@rumbo/db` package
- Drizzle ORM queries in services, not route handlers
