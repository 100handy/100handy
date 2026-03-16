# 100handy Architecture

## Overview

100handy is a pnpm + Turborepo monorepo with three primary applications, shared packages for UI and data/state logic, and a Supabase-backed backend layer.

## Monorepo Layout

```text
100handy/
├── apps/
│   ├── client-web/      # Next.js 15 customer-facing web app
│   ├── client-mobile/   # Expo Router mobile app for customers and professionals
│   └── admin-web/       # Vite + React admin dashboard
├── packages/
│   ├── shared/          # Shared Supabase, Zustand, and React Query logic
│   └── ui/              # Shared UI components and styling primitives
├── tooling/
│   ├── eslint/          # Shared ESLint configs
│   ├── tailwind/        # Shared Tailwind config
│   └── typescript/      # Shared TypeScript config presets
├── supabase/
│   ├── functions/       # Edge functions for payments, auth callbacks, push notifications, etc.
│   ├── migrations/      # Database schema and policy migrations
│   ├── scripts/         # Supporting SQL scripts
│   └── templates/       # Auth email templates
└── docs/                # Project documentation
```

## Applications

### client-web

The customer web app is built with Next.js 15 App Router and React 19.

Primary responsibilities:
- marketing and SEO landing pages
- customer sign-in and sign-up
- booking and account flows
- shared UI composition with app-specific components

Important runtime composition:
- root layout wraps the app in a shared React Query provider, auth provider, and pending-booking bootstrap
- homepage is assembled from marketing sections rather than a single data-heavy screen
- Next config transpiles the shared UI package and allows remote image hosts used by avatars and Supabase storage

### client-mobile

The mobile app is built with Expo Router and supports both customer and professional journeys.

Primary responsibilities:
- onboarding and auth entry flow
- customer booking flow
- professional job flow
- push notifications and deep links
- native Stripe integrations and device capabilities

Important runtime composition:
- root layout initializes auth, configures push notifications, loads fonts, starts Query and toast providers, and declares auth/client/professional route groups
- the index route acts as an orchestration layer that decides where a user should go based on auth status, role, onboarding state, verification state, and pending booking recovery

### admin-web

The admin app is a separate Vite + React application using React Router.

Primary responsibilities:
- admin authentication and access control
- operational dashboards
- task and user management
- finance, content, notifications, and support tools

Important runtime composition:
- app bootstraps with React Query and an admin auth provider
- route tree is organized by business area instead of sharing customer-site routing
- data access is direct to Supabase rather than routed through the shared package abstractions

## Shared Packages

### packages/shared (`@shared/supabase`)

This package is the shared application core for cross-platform data, state, and backend integration.

Contains:
- Supabase client setup for browser and native environments
- auth helpers
- Zustand stores for auth, booking, profile, location, support, and task state
- React Query client and hooks
- shared schemas and data utilities

Key architectural role:
- allows client-web and client-mobile to share business logic without sharing full app shells
- keeps domain behavior close to backend integration code

Notable pattern:
- auth role resolution does not rely only on client-side metadata; the shared auth store verifies the authoritative role from the `profiles` table

### packages/ui (`@100handy/ui`)

This package provides reusable UI primitives and shared styling utilities.

Contains:
- button, card, input, label, checkbox, and badge primitives
- shared CSS exports
- path-based exports for components, hooks, and utilities

## Backend Architecture

The backend is centered on Supabase.

Capabilities in use:
- Auth for user sessions and email flows
- Postgres for application data
- Storage for uploaded assets
- Edge Functions for backend workflows
- local development stack via Supabase CLI config

### Database

The migration set indicates a mature schema with support for:
- profiles and role-based access
- handy/professional onboarding
- bookings and booking lifecycle fields
- payments, payout, and payment error tracking
- reviews
- support messaging and conversations
- notifications and device push tokens
- categories, forms, skills, and work areas
- recurring bookings

### Edge Functions

Edge functions handle backend workflows that should not run directly in the client.

Examples present in the repo include:
- create/cancel/capture/refund payment flows
- Stripe customer and connect account setup
- auth callback handling
- AI support response generation
- push notification delivery
- account deletion

## Cross-Cutting Runtime Patterns

### State management

The repo uses a split between:
- **React Query** for server state and fetch lifecycles
- **Zustand** for client/session/workflow state

This is most visible in the shared package, where the query client is centralized and auth/pending-booking/profile state is stored in Zustand.

### Authentication

Authentication is Supabase-based across the repo, but each surface integrates differently:
- client-web uses a browser client tailored to Next.js
- client-mobile uses a native-aware Supabase client with AsyncStorage
- admin-web uses a typed direct Supabase client and checks for admin access

### Platform-aware client setup

The repository uses separate Supabase client implementations for browser and native environments so mobile can use persistent storage and platform-appropriate auth behavior.

## Request / Data Flow Summary

### Customer web and mobile

Typical flow:

```text
UI screen
→ shared React Query hook or app-specific data module
→ shared/browser/native Supabase client
→ Supabase database, auth, storage, or edge function
→ React Query cache / Zustand store
→ UI update
```

### Admin web

Typical flow:

```text
UI screen
→ admin React Query hook or API helper
→ admin-specific Supabase client
→ Supabase database
→ React Query cache
→ UI update
```

## Tooling and Build System

### Workspace and orchestration

- pnpm manages workspace dependencies
- Turborepo runs build, dev, lint, and type-check tasks
- shared environment variables for major tasks are declared in the turbo config

### Shared config

- shared TypeScript config enforces strict typing and modern module settings
- shared ESLint config includes TypeScript recommendations, Prettier compatibility, and Turborepo env checks

## Documentation Boundaries

Use this file for:
- monorepo-level architecture
- subsystem boundaries
- shared runtime patterns
- backend integration overview

Use `docs/agents/` for:
- subsystem-specific implementation notes
- app-by-app operational details
- specialized workflows or handoff documents
