# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

100handy is a Turborepo monorepo for a multi-platform service marketplace application with web (Next.js), mobile (Expo), and admin (Vite) clients. The project uses pnpm workspaces, Supabase for backend, and shares code through workspace packages.

## Working Rules For Codex

- Inspect the existing route tree, Supabase schema, auth flow, hooks, and UI components before changing behavior.
- Extend the existing structure. Do not rewrite the admin, web, or mobile apps into a new architecture mid-task.
- Prefer adding to existing API hook modules under `apps/admin-web/src/lib/api/*` rather than creating parallel data layers.
- Prefer existing route groups and layouts in `apps/admin-web/src/App.tsx` and `apps/admin-web/src/layouts/*`.
- When adding admin features, wire all three layers together:
  1. database / migration
  2. API hooks / validation / permission checks
  3. UI pages and reusable admin components
- Every sensitive admin mutation should:
  - require an authenticated active admin
  - check permission scope
  - write an audit log when the repository has an audit path for that action
- Avoid committing or editing local-only credential files unless explicitly asked:
  - `apps/client-mobile/eas.json`
  - `AuthKey_UMY974H849.p8`
  - `apps/client-mobile/assets/images/welcome-splash-loading.png`
- For admin UI changes, keep the information architecture simple:
  - reuse the existing sidebar groups
  - prefer clear labels over internal naming
  - add loading, empty, and error states
  - keep table-heavy views responsive and scannable
- For CMS/content work, prefer adding schema fields to the existing registry/config-driven editors instead of hardcoding new one-off forms.

## Common Commands

### Development
```bash
# Start all applications in development
pnpm dev

# Start specific applications
pnpm dev --filter=client-web      # Next.js web app
pnpm dev --filter=client-mobile   # Expo mobile app
pnpm dev --filter=admin-web       # Vite admin dashboard

# Mobile platform-specific
pnpm dev --filter=client-mobile -- --ios
pnpm dev --filter=client-mobile -- --android
pnpm dev --filter=client-mobile -- --clear  # Clear Metro cache
```

### Building & Type Checking
```bash
# Build all packages and applications
pnpm build

# Build specific applications
pnpm build --filter=client-web
pnpm build --filter=admin-web

# Run TypeScript type checking
pnpm check-types
```

### Linting & Formatting
```bash
pnpm lint
pnpm format
```

### Supabase
```bash
# Start local Supabase instance
pnpm supabase:start

# Stop local Supabase
pnpm supabase:stop

# Reset database (WARNING: destroys all local data)
pnpm supabase:reset

# Edge functions
pnpm supabase:functions:serve
pnpm supabase:functions:deploy
```

### Adding UI Components
```bash
# Add shadcn components to web apps
cd apps/client-web
pnpm ui:add <component-name>

# Add Gluestack components to mobile
cd apps/client-mobile
pnpm ui:add <component-name>
```

### Managing Dependencies
```bash
# Add to specific workspace
pnpm add <package> --filter=client-web
pnpm add <package> --filter=client-mobile
pnpm add <package> --filter=@shared/supabase

# Add dev dependency
pnpm add -D <package> --filter=client-web
```

## Architecture

### Applications (`apps/`)

**client-mobile** (Expo 53 + React Native)
- Entry: `app/index.tsx`
- File-based routing via Expo Router
- Auth screens: `app/(auth)/*`
- Tab screens: `app/(tabs)/*` (home, profile, etc.)
- Professional screens: `app/(professional)/(tabs)/*` (earnings, bookings)
- API routes: `app/api/auth/[...auth]+api.ts` (web only, native uses Next.js backend)
- UI: Gluestack + NativeWind v4
- Auth client config: `lib/auth/auth-client.ts`

**client-web** (Next.js 15 + App Router)
- Entry: `app/page.tsx`
- Layout: `app/layout.tsx`
- Auth API route: `app/api/auth/[...all]/route.ts`
- Auth client: `lib/auth-client.ts`, `lib/auth.ts`
- Dashboard: `app/dashboard/page.tsx`
- UI: Tailwind CSS v4 + shadcn/ui
- Global styles: `app/globals.css`

**admin-web** (Vite + React Router)
- Admin dashboard for managing platform
- Standalone Vite app with Tailwind CSS v4
- Uses Supabase directly (not through shared package patterns)

### Shared Packages (`packages/`)

**@shared/supabase**
- Database queries and data fetching: `supabase/*.ts`
- React Query hooks: `query/hooks/use*.ts`
- Zustand stores: `store/*.ts`
- Platform-specific clients:
  - Web: `supabase/supabaseClient.ts`
  - Native: `supabase/supabaseClient.native.ts`
- Auth helpers: `supabase/auth.ts`
- Profile helpers: `supabase/profile.ts`

**@100handy/ui**
- Shared UI primitives (button, input, card, etc.)
- Components in `src/components/`
- Works across web (shadcn/ui style)

**packages/auth**
- Better Auth backend: `better-auth.ts`
- Client helpers: `better-auth-client.ts`

### Tooling (`tooling/`)
- `eslint/`: Shared ESLint configurations
- `tailwind/`: Shared Tailwind configurations
- `typescript/`: Shared TypeScript configurations

### Supabase (`supabase/`)
- Edge functions: `functions/*`
- Shared CORS: `functions/_shared/cors.ts`
- Local config: `config.toml`
- Migrations: `migrations/*`

## Data Flow Pattern

The project follows a layered architecture for integrating screens with Supabase:

1. **Database Layer** (`packages/shared/supabase/*.ts`)
   - CRUD functions with error handling
   - Type definitions for entities
   - Supabase queries with joins

2. **State Layer** (`packages/shared/store/*.ts`)
   - Zustand stores for global state
   - Loading/error states
   - Actions for data mutations

3. **Query Layer** (`packages/shared/query/hooks/use*.ts`)
   - React Query hooks for caching
   - Query keys for cache management
   - Invalidation utilities

4. **Utility Layer** (`apps/client-mobile/lib/*.ts`)
   - Data transformation for UI
   - Formatting functions
   - Mapping database fields to component props

5. **UI Layer** (`apps/*/app/**/*.tsx`)
   - Components consume query hooks
   - Handle loading/error/empty states
   - Pull-to-refresh functionality

## Key Conventions

### TypeScript
- Explicit types on exported functions, hooks, and components
- Prefer discriminated unions and `unknown` over `any`
- Use type guards instead of broad assertions

### React Components
- Function components with named exports
- Extract reusable UI to `packages/ui`
- Keep props minimal; derive data where possible

### State Management
- React Query (from `packages/shared/query`) for server state
- Zustand (from `packages/shared/store`) for global app state
- Local state for UI-only concerns

### Styling
- Web: Tailwind CSS v4 via `packages/ui/lib/globals.css`
- Mobile: NativeWind v4 + Gluestack components
- Prefer shared UI primitives from `packages/ui`

### Routing
- Mobile: Expo Router with file-based routing
  - Groups: `(auth)`, `(tabs)`, `(professional)`
  - Layouts: `_layout.tsx` files
- Web: Next.js App Router with folder conventions

### Authentication
- Mobile native: Points to deployed or local Next.js API backend
- Mobile web: Uses Expo API routes
- Web: Next.js API routes handle auth
- Auth state managed in `packages/shared/store/auth.ts`

## MCP Usage

### Figma MCP
When calling Figma MCP tools (e.g., `get_design_context`), **DO NOT write assets to disk**. Omit the `dirForAssetWrites` parameter or pass an empty string to avoid creating asset files in the repository.

## Environment Variables

Global env vars (in `turbo.json`):
- `NODE_ENV`
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`

App-specific:
- `apps/client-web/.env.local`
- `apps/client-mobile/.env`
- `supabase/.env`

## Database Schema

Always verify foreign key relationships before creating joins in Supabase queries. Check constraint names in Supabase dashboard. Use LEFT JOINs for optional relationships.

## Error Handling

- Database layer: Wrap Supabase calls in try-catch, rethrow errors
- UI layer: Handle loading, error, empty, and unauthenticated states
- Fail fast with guard clauses; avoid empty catch blocks

## Testing Local Mobile App

For native mobile development:
- Ensure device and computer are on same Wi-Fi network
- Mobile native must connect to real backend (deployed or local Next.js)
- Use `expo start -c` to clear Metro bundler cache if needed

## Common Entry Points

Mobile:
- Home: `apps/client-mobile/app/(tabs)/home.tsx`
- Profile: `apps/client-mobile/app/(tabs)/profile.tsx`
- Professional earnings: `apps/client-mobile/app/(professional)/(tabs)/earnings.tsx`

Web:
- Landing: `apps/client-web/app/page.tsx`
- Dashboard: `apps/client-web/app/dashboard/page.tsx`

Admin:
- Main: `apps/admin-web/src/App.tsx`
