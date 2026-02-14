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

-   **Server components** (mặc định):
    *   Sử dụng trong các tệp `page.tsx` để fetch dữ liệu không tương tác ban đầu, bao gồm cả việc gọi Server Actions để lấy dữ liệu từ Supabase.
    *   Có thể truyền dữ liệu đã fetch dưới dạng `props` cho các Client Components.
-   **Client components** (`'use client'`):
    *   Sử dụng cho UI tương tác — biểu mẫu, dropdown, quản lý state cục bộ, điều hướng.
    *   Có thể gọi các Server Actions để thực hiện fetch dữ liệu bổ sung hoặc các thao tác ghi dữ liệu từ phía client, đặc biệt cho các trường hợp lấy dữ liệu theo yêu cầu (on-demand fetching). Ví dụ, một Client Component có thể gọi một Server Action để lấy nội dung chi tiết của một chương khi người dùng nhấp vào nút "Đọc".

---

## SEO & Metadata Strategy

The project leverages Next.js 16 (App Router)'s built-in Metadata API to manage Search Engine Optimization (SEO) and browser display information.

-   **Global Metadata (`app/layout.tsx`):**
    *   Sets default title and description for the entire application.
    *   `lang="vi"` is set on the `<html>` tag for optimal SEO and language support.

-   **Page-Specific/Layout-Specific Metadata (Server Components):**
    *   **Book Detail Pages (`app/truyen/[slug]/page.tsx`)**: Utilizes `generateMetadata` (Server Component) to create dynamic titles, descriptions, and Open Graph metadata based on individual book details (title, description, cover image).
    *   **Chapter Reading Pages (`app/truyen/[slug]/chuong/[chapterNumber]/page.tsx`)**: Similarly, uses `generateMetadata` to generate dynamic metadata with titles including book name, chapter number, and chapter title.
    *   **Homepage Layout (`app/(main)/trang-chu/layout.tsx`)**: Uses `export const metadata` (Server Component) to provide a specific title and description for the homepage, overriding the global metadata.
    *   **User Area Layout (`app/(user)/tai-khoan/layout.tsx`)**: Uses `export const metadata` (Server Component) to provide a general title and description for the entire user account area (e.g., "Hắc Thạch Thôn - Tài Khoản").

-   **Metadata for Client Components (`page.tsx`):**
    *   `page.tsx` files that are Client Components (e.g., `/tai-khoan/ban-lam-viec`, `/tai-khoan/cai-dat` within the user section) **cannot** `export metadata` directly as per Next.js rules.
    *   These pages automatically inherit metadata from their nearest Server Component parent `layout.tsx`. Thus, sub-pages in the user area will display metadata defined in `app/(user)/tai-khoan/layout.tsx`.

-   **Revalidation Mechanism (ISR):**
    *   Pages with dynamic data that doesn't change too frequently (e.g., book details `app/truyen/[slug]/page.tsx`) use `export const revalidate = <seconds>;` to implement Incremental Static Regeneration (ISR). This mechanism updates page content and metadata after a specified interval (e.g., 300 seconds = 5 minutes) without requiring a redeploy, balancing performance and data freshness.

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
