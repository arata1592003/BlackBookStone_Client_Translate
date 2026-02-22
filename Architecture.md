# Architecture

## Overview

BlackStoneBook Client is a **Next.js 16** web application for an online book reading and translation platform. It uses **TypeScript**, **React 19**, **Shadcn UI**, **Tailwind CSS 4**, and **Supabase** (PostgreSQL + Auth). The application is designed with a Vietnamese-first approach for all user-facing routes and content.

---

## Tech Stack

| Layer        | Technology                        |
| ------------ | --------------------------------- |
| Framework    | Next.js 16 (App Router)          |
| Language     | TypeScript                        |
| UI Library   | Shadcn UI (Radix UI based)        |
| Styling      | Tailwind CSS 4 (CSS-first)        |
| Database     | Supabase (PostgreSQL)             |
| Auth         | Supabase Auth                     |
| Icons        | Lucide React                      |

---

## Folder Structure

```
├── app/                          # Next.js App Router (pages & layouts)
│   ├── actions/                  # Next.js Server Actions (data mutations)
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
│   └── globals.css               # Global styles & Tailwind 4 @theme config
│
├── components/
│   ├── features/                 # Domain-specific components (PascalCase)
│   │   ├── auth/                 # LoginPage, RegisterPage
│   │   ├── book/                 # BookCard, BookDetailSection, etc.
│   │   ├── chapter/              # ChapterContent, ChapterList, etc.
│   │   ├── home/                 # HomeOverviewSection
│   │   └── user/                 # UserBookCard, UserNavigationMenu, etc.
│   ├── layout/                   # Header, navigation wrappers (PascalCase)
│   └── ui/                       # Reusable Shadcn primitives (lowercase.tsx)
│
├── modules/                      # Business logic (layered architecture)
│   ├── book/                     # book.types / .mapper / .service / .repo
│   ├── chapter/                  # chapter.types / .mapper / .service / .repo
│   ├── tag/                      # tag.types / .mapper / .service / .repo
│   └── user/                     # user.type / .mapper / .service / .repo
│
├── lib/                          # Utils and External service clients
│   ├── supabase/                 # client.ts (browser), server.ts (SSR)
│   └── utils.ts                  # Shadcn 'cn' utility
│
├── utils/                        # Utility functions
│   └── date.ts                   # Vietnamese time-ago formatter
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
| `(main)`  | `/trang-chu`    | HomeHeader + Content Wrapper    |
| `(user)`  | `/tai-khoan/*`  | Sidebar + UserHeader            |
| —         | `/truyen/[slug]`| Book detail / chapter reader    |

All route names and slugs are in **Vietnamese**.

---

## Component Design

### Three tiers

1. **`components/ui/`** — Low-level primitives from **Shadcn UI**. Standardized **lowercase** filenames.
2. **`components/features/{domain}/`** — High-level domain components. **PascalCase** filenames.
3. **`components/layout/`** — Global layout structures. **PascalCase** filenames.

### Server vs Client components

-   **Server components** (default): Used for data fetching via Server Actions.
-   **Client components** (`'use client'`): Used for interactive UI (forms, dialogs, tabs).

---

## Styling & Theme System

### Tailwind CSS 4 (CSS-first)

The project uses Tailwind CSS 4 with configuration directly in `app/globals.css` via the `@theme` block.

- **Variables**: Core colors use the `--color-*` prefix.
- **Mapping**: Shadcn/UI variables (like `--background`, `--primary`) are mapped to the core colors.
- **Modes**: Dark mode is the default (in `:root`). Light mode overrides are defined in the `.light` class.

Example variables:
```css
--color-surface-base: #0b0b0b;
--color-primary: #4f46e5;
--color-text-primary: #eaeaea;
```

---

## SEO & Metadata Strategy

Leverages Next.js 16 Metadata API.
- **Global**: Defined in `app/layout.tsx`.
- **Dynamic**: Generated via `generateMetadata` in book and chapter pages.
- **ISR**: Pages use `export const revalidate = 300` for caching.

---

## State Management

- **Local State**: `useState` / `useReducer`
- **Server State**: **React Query (TanStack Query)** for fetching, caching, and synchronizing server data.
- **Auth State**: Handled via `AuthProvider` and Supabase sessions.

---

## Database Tables

| Table                | Purpose                   |
| -------------------- | ------------------------- |
| `books`              | Book metadata             |
| `chapters`           | Chapter metadata          |
| `chapter_content`    | Chapter body text         |
| `users`              | User profiles             |
| `tags`               | Genre categories          |
| `wallet_transactions`| User top-up/spend history |
| `topup_plans`        | Gem credit packages       |
| `jobs`               | Background crawl tasks    |
