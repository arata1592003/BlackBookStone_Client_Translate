# Architecture

## Overview

BlackStoneBook Client is a **Next.js 16** web application for online book reading and translation management. It uses **TypeScript**, **React 19**, **Tailwind CSS 4**, and **Supabase** (PostgreSQL + Auth). The UI is Vietnamese-first.

---

## Tech Stack

| Layer        | Technology                        |
| ------------ | --------------------------------- |
| Framework    | Next.js 16 (App Router)          |
| Language     | TypeScript                        |
| UI           | React 19                          |
| Styling      | Tailwind CSS 4 + `tailwind-merge` |
| Database     | Supabase (PostgreSQL)             |
| Auth         | Supabase Auth                     |
| Icons        | Lucide React                      |

---

## Folder Structure

```
├── app/                          # Next.js App Router (pages & layouts)
│   ├── (auth)/                   # Auth route group (no header)
│   │   ├── dang-ky/              # Register page
│   │   ├── dang-nhap/            # Login page
│   │   └── layout.tsx
│   ├── (main)/                   # Public route group (with HomeHeader)
│   │   └── trang-chu/            # Home page
│   ├── (user)/                   # User dashboard route group (sidebar layout)
│   │   └── tai-khoan/
│   │       ├── ban-lam-viec/     # Workspace (owned books)
│   │       ├── tu-truyen/        # Book cabinet (followed books)
│   │       ├── nap-tien/         # Top-up credits
│   │       ├── cai-dat/          # Settings
│   │       └── lich-su-giao-dich/# Transaction history
│   ├── truyen/                   # Book & chapter pages
│   │   └── [slug]/
│   │       └── chuong/[chapterNumber]/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Root redirect → /trang-chu
│   └── globals.css               # Global styles & CSS variables
│
├── components/
│   ├── features/                 # Domain-specific components
│   │   ├── auth/                 # LoginPage, RegisterPage
│   │   ├── book/                 # BookCard, BookDetailSection, etc.
│   │   ├── chapter/              # ChapterContent, ChapterList, etc.
│   │   ├── home/                 # HomeOverviewSection
│   │   └── user/                 # UserBookCard, UserNavigationMenu, etc.
│   ├── layout/                   # Header, navigation wrappers
│   └── ui/                       # Reusable primitives (Button, Card, Input, etc.)
│
├── modules/                      # Business logic (layered architecture)
│   ├── book/                     # book.types / .mapper / .service / .repo
│   ├── chapter/                  # chapter.types / .mapper / .service / .repo
│   ├── tag/                      # tag.types / .mapper / .service / .repo
│   └── user/                     # user.type / .mapper / .service / .repo
│
├── lib/                          # External service clients
│   └── supabase/                 # client.ts (browser), server.ts (SSR)
│
├── utils/                        # Utility functions
│   └── date.ts                   # Vietnamese time-ago formatter
│
├── styles/
│   └── variables.css             # CSS custom properties
│
└── public/                       # Static assets
```

---

## Layered Architecture

```
┌─────────────────────────────────┐
│   Presentation (components/)    │  React components, pages
├─────────────────────────────────┤
│   Service (modules/*/service)   │  Business logic, orchestration
├─────────────────────────────────┤
│   Mapper (modules/*/mapper)     │  Row → Domain model transforms
├─────────────────────────────────┤
│   Repository (modules/*/repo)   │  Supabase queries
├─────────────────────────────────┤
│   Supabase (lib/supabase)       │  DB + Auth client
└─────────────────────────────────┘
```

Each module follows a consistent 4-file pattern:

| File              | Responsibility                          |
| ----------------- | --------------------------------------- |
| `{mod}.types.ts`  | Entity, Row, and Domain type definitions |
| `{mod}.repo.ts`   | Direct Supabase queries                 |
| `{mod}.mapper.ts` | Transform DB rows → domain models       |
| `{mod}.service.ts`| Orchestrate repo + mapper, business rules|

---

## Routing

Next.js App Router with **route groups** for layout separation:

| Group     | Path prefix     | Layout                          |
| --------- | --------------- | ------------------------------- |
| `(auth)`  | `/dang-nhap`, `/dang-ky` | Minimal (no header)    |
| `(main)`  | `/trang-chu`    | HomeHeader + tags dropdown      |
| `(user)`  | `/tai-khoan/*`  | Sidebar + UserHeader            |
| —         | `/truyen/[slug]`| Book detail / chapter reader    |

Dynamic segments: `[slug]` for books, `[chapterNumber]` for chapters.

All route names are in **Vietnamese**.

---

## Component Design

### Three tiers

1. **`components/ui/`** — Generic, reusable primitives (`Button`, `Card`, `Input`, `Label`, `Pagination`). Use `forwardRef` and accept `className` merged via `twMerge`.

2. **`components/features/{domain}/`** — Domain components that call module services and manage local state with `useState`/`useEffect`.

3. **`components/layout/`** — Page-level wrappers (`HomeHeader`, responsive auth variants, tag dropdown).

### Server vs Client components

- **Server components** (default): used in `page.tsx` files for async data fetching.
- **Client components** (`'use client'`): used for interactive UI — forms, dropdowns, navigation state.

---

## State Management

No centralized store. State is managed through:

- **`useState` / `useEffect`** for local component state
- **Supabase Auth sessions** for authentication
- **Server components** for initial data loading
- **Props drilling** for parent→child data flow

---

## Styling

- **Tailwind CSS 4** with `@import "tailwindcss"` syntax
- **`twMerge()`** for conflict-free class merging in reusable components
- **CSS custom properties** for theme colors (dark theme by default):

```css
--bg-main: #0b0b0b;
--bg-box: #141414;
--text-main: #eaeaea;
--accent-red: #b30000;
--bg-primary: #7c3aed;
```

- **Mobile-first** responsive design with `sm:`, `md:`, `lg:`, `xl:` breakpoints
- Separate mobile/desktop component variants where needed (e.g., `HomeHeaderDesktopAuth` / `HomeHeaderMobileAuth`)

---

## Authentication

Uses **Supabase Auth** with email/password:

```
signInWithPassword() → getSession() → fetch user from DB → mapToUser()
```

- Browser client: `lib/supabase/client.ts`
- Server client: `lib/supabase/server.ts`
- Current user resolved in `user.service.ts → getCurrentUser()`

---

## Type System

Three levels of types per module:

| Level          | Example                    | Purpose                    |
| -------------- | -------------------------- | -------------------------- |
| **Entity**     | `BookEntity`               | Full database table shape  |
| **Row**        | `BookCardWithAuthorRow`    | Query result (with joins)  |
| **Domain**     | `BookInfo`, `User`         | Business model for UI      |

Path alias: `@/*` maps to project root.

---

## Naming Conventions

| What              | Convention       | Example                        |
| ----------------- | ---------------- | ------------------------------ |
| Components        | PascalCase       | `BookCard.tsx`                 |
| Module files      | `{name}.{role}`  | `book.service.ts`              |
| Functions         | camelCase        | `getBookInfo()`                |
| DB columns        | snake_case       | `book_name_translated`         |
| Props interfaces  | `{Name}Props`    | `BookCardProps`                |
| Booleans          | `is`/`has` prefix| `isAdmin`, `isLoading`         |
| Routes            | Vietnamese slug  | `/trang-chu`, `/tai-khoan`     |

---

## Commit Convention

Conventional Commits format (see `COMMIT_CONVENTION.md`):

```
<type>(<scope>): <subject>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

Subject: present tense, lowercase, no period, ≤50 chars.

---

## Database Tables

| Table                | Purpose                   |
| -------------------- | ------------------------- |
| `books`              | Book metadata             |
| `chapters`           | Chapter metadata          |
| `chapter_content`    | Chapter body text         |
| `users`              | User profiles             |
| `tags`               | Genre categories          |
| `book_tags`          | Book ↔ Tag relations      |
| `book_follows`       | User ↔ Book follows       |
| `book_chapter_stats` | Chapter statistics        |
| `jobs`               | Background job tracking   |
| `wallet_transactions`| User transactions         |
