# Admin Web

Admin panel for TaskRabbit clone built with Vite, React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Testing

```bash
# Fast mocked admin route/workflow smoke tests
pnpm test:e2e

# Unit-level mutation safety tests
pnpm test:unit
```

For local Supabase-backed route smoke tests:

```bash
pnpm dlx supabase start
pnpm dlx supabase db reset
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f apps/admin-web/e2e/support/local-supabase-seed.sql
SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key> pnpm --dir apps/admin-web test:e2e:local
```

The local-backed suite requires Docker Desktop. It still mocks Supabase Auth for a fixed E2E admin, but all PostgREST/RPC reads go to the local Supabase API.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── layouts/        # Layout components
├── pages/          # Page components
├── lib/            # Utility functions
├── App.tsx         # Root component with routing
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Features

- Dark mode by default
- Responsive sidebar navigation
- Login page
- Dashboard with KPIs and activity table
- Clean, minimal code structure
