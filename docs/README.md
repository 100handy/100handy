# 100handy Documentation

This directory is the project’s documentation entrypoint for engineers working in the repository.

## Documentation Map

| Document | Purpose |
| --- | --- |
| [architecture.md](./architecture.md) | Current monorepo architecture, app boundaries, shared packages, backend integrations, and major runtime flows |
| [mobile-fixes-context.md](./mobile-fixes-context.md) | Context and rationale for the recent mobile fixes work |
| [agents/README.md](./agents/README.md) | Agent-oriented technical notes and subsystem guides |

## How to Use These Docs

- Start with [architecture.md](./architecture.md) if you are new to the repository.
- Use `docs/agents/` when you need deeper subsystem notes for web, mobile, admin, backend, or shared packages.
- Treat the codebase as the final source of truth when documentation and implementation differ.

## Documentation Structure

This docs area is intentionally lightweight:

- `docs/README.md` is the index.
- `docs/architecture.md` is the human-facing architecture overview.
- `docs/agents/` contains specialized implementation notes.
- focused context files may live directly under `docs/` when tied to a specific body of work.

## Maintenance Guidelines

When updating the system:

1. Update `docs/architecture.md` for cross-cutting architectural changes.
2. Update the relevant file in `docs/agents/` for subsystem-specific changes.
3. Prefer short, accurate documents over broad but stale overviews.
4. If behavior changes, verify the documentation against the actual app or package entry points.
