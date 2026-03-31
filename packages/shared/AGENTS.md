# packages/shared — Source of Truth

## Purpose

This package is the **single source of truth** for data models shared between frontend and backend.

## Structure

```
src/
├── schemas/          # Zod schemas (define both types AND validation)
├── types/            # Derived TypeScript types (when needed beyond Zod inference)
└── constants/        # Shared constants (currencies, categories, etc.)
```

## Conventions

### Schema Pattern

```ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
```

### Rules

- Zod schemas define both validation and TypeScript types
- Export pattern: `export const xSchema = z.object({...}); export type X = z.infer<typeof xSchema>;`
- **Never** import from `apps/` or other packages (only Zod as dependency)
- Keep schemas flat — avoid deep nesting
- Use `.brand()` for nominal types when needed (e.g., monetary amounts)
