# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (flat config, Next.js rules)
```

No test framework is configured.

## Architecture

Next.js 16 App Router project (TypeScript, React 19, Tailwind CSS 4, Supabase). Vietnamese-language book reading and translation platform.

### Layered module system (`modules/`)

Each domain module (`book`, `chapter`, `tag`, `user`) has four files:

- `{mod}.types.ts` — Three type levels: **Entity** (full DB row), **Row** (query result with joins), **Domain** (business model for UI)
- `{mod}.repo.ts` — Supabase queries only, returns raw rows
- `{mod}.mapper.ts` — Transforms rows → domain models
- `{mod}.service.ts` — Orchestrates repo + mapper, called by components

Data flows: **Component → Service → Repo → Supabase**, with Mapper transforming at the service layer.

### Supabase clients (`lib/supabase/`)

- `client.ts` — Browser-side client (anon key)
- `server.ts` — Server-side client (service role key)

### Route groups (`app/`)

| Group    | Layout                    | Routes                              |
| -------- | ------------------------- | ----------------------------------- |
| `(auth)` | Minimal, no header        | `/dang-nhap`, `/dang-ky`            |
| `(main)` | HomeHeader + tags dropdown| `/trang-chu`                        |
| `(user)` | Sidebar + UserHeader      | `/tai-khoan/*` (6 sub-pages)        |
| —        | Per-page                  | `/truyen/[slug]/chuong/[chapterNumber]` |

Route slugs are in **Vietnamese**.

### Component organization (`components/`)

- `ui/` — Reusable primitives (`Button`, `Card`, `Input`, `Label`, `Pagination`). Use `forwardRef` and `twMerge` for className merging.
- `features/{domain}/` — Domain components with local state (`useState`/`useEffect`), call module services directly.
- `layout/` — Page-level wrappers (HomeHeader, responsive mobile/desktop auth variants).

### Styling

Tailwind CSS 4 with `@import "tailwindcss"` syntax. Theme colors defined as CSS custom properties in `globals.css` (dark theme: `--bg-main: #0b0b0b`, `--bg-primary: #7c3aed`). Use `twMerge()` from `tailwind-merge` in reusable components.

## Conventions

- **Commits**: Conventional Commits — `<type>(<scope>): <subject>` (see `COMMIT_CONVENTION.md`)
- **Naming**: PascalCase components, camelCase functions, snake_case DB columns, `{Name}Props` for prop interfaces
- **Server components** are default; add `'use client'` only when hooks or interactivity are needed
- **No centralized state** — local `useState`/`useEffect` + Supabase Auth sessions
- **Path alias**: `@/*` maps to project root
