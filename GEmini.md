# Gemini's Operational Guide for BlackStoneBook Client

This document outlines the architecture, conventions, and workflow for the BlackStoneBook Client project. I will adhere to these guidelines for all tasks.

---

## 1. Project Overview & Tech Stack

- **Project**: A Next.js web application for an online book reading platform.
- **Language**: TypeScript
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL Database + Auth)
- **Iconography**: Lucide React
- **Primary Language**: Vietnamese

| Layer        | Technology         |
|--------------|--------------------|
| Framework    | Next.js 16         |
| Language     | TypeScript         |
| UI           | React 19           |
| Styling      | Tailwind CSS 4     |
| Iconography  | Lucide React       |
| Backend      | Supabase           |
| Linting      | ESLint             |

---

## 2. Core Architecture & Principles

This project uses a strict layered architecture and a well-defined routing strategy. I will always respect these boundaries.

### 2.1 Data & Business Logic

```
┌─────────────────────────────────┐
│   Presentation (app/, components/) │  - React components, pages, layouts.
├─────────────────────────────────┤
│   Service (modules/*/service)   │  - Business logic, orchestration.
├─────────────────────────────────┤
│   Mapper (modules/*/mapper)     │  - Transforms DB data to UI models.
├─────────────────────────────────┤
│   Repository (modules/*/repo)   │  - Direct Supabase queries.
└─────────────────────────────────┘
```

- **Modules (`modules/`)**: Business logic is separated by domain. Any new logic must follow the established pattern:
    - **`book`**: Manages book data, including fetching details and handling user's followed books.
    - **`chapter`**: Manages chapter data.
    - **`user`**: Manages user profiles and stats.
    - **`tag`**: Manages book genres/tags.
    - **`wallet`**: Manages user wallet balance and transaction history.
    - **`plan`**: Manages top-up plans for the wallet system.

### 2.2 Routing Architecture (App Router)

The project utilizes **Route Groups** to manage distinct application layouts and sections.

- **`app/(main)`**: For main public-facing pages that share a common layout, including the `HomeHeader`.
    - Contains: `/trang-chu`
- **`app/(user)`**: For the user dashboard area. This group has its own distinct layout, featuring a `UserNavigationMenu` and `UserHeader`, and does **not** include the public `HomeHeader`.
    - Contains nested routes like `/tai-khoan/ban-lam-viec`, `/tai-khoan/tu-truyen`, etc.
- **`app/(auth)`**: For authentication pages (login, register). This group uses a minimal layout with no headers or navigation.
    - Contains: `/dang-nhap`, `/dang-ky`
- **`app/truyen`**: A public route for displaying book and chapter details.

### 2.3 Component Structure

- **`components/ui/`**: Generic, reusable primitives (e.g., `Button`, `Card`, `ActionButton`).
- **`components/features/`**: Domain-specific components that are used across different pages (e.g., `user/UserStats`).
- **`components/layout/`**: Major page structure and navigation components (e.g., `HomeHeader`, `UserNavigationMenu`).

---

## 3. Workflow & Conventions

- **Installation**: `npm install`
- **Development**: `npm run dev`
- **Verification**: `npm run lint` (I will run this after making changes to ensure code quality).
- **Routing**: All routes are defined in the `app/` directory and use Vietnamese names. The structure is based on Route Groups as described in the architecture section.
- **Styling**:
    - **Utility-First**: Use Tailwind CSS classes directly.
    - **Theming**: Use CSS variables defined in `globals.css` for consistent colors, surfaces, and borders (e.g., `bg-surface-card`, `text-text-primary`).
- **Iconography & Images**:
    - **Icons**: Always use `lucide-react` for all icons to maintain consistency.
    - **Images**: Always use the `next/image` component for image rendering to ensure performance optimization (lazy loading, responsive sizes).
- **Commit Messages**: All commits must follow the Conventional Commits specification outlined in `COMMIT_CONVENTION.md`.

---

## 4. My Mandate

1.  **Strictly Adhere to Architecture**: I will not bypass the service or repository layers. All new features will respect the established Route Group structure (`(main)`, `(user)`, `(auth)`).
2.  **Follow Conventions**: All new code will conform to the project's established naming, typing, styling, and iconography (`lucide-react`) conventions.
3.  **Place Files Correctly**: New pages and layouts will be placed in the correct route group. New reusable components will be placed in the appropriate `components` subdirectory.
4.  **Utilize Existing Modules**: I will use the `wallet` and `plan` modules for any features involving user currency. I will use the `book` module for fetching both owned and followed books.
5.  **Verify My Work**: I will use `npm run lint` to check for issues before considering a task complete.
6.  **Commit Correctly**: All commits will be formatted according to `COMMIT_CONVENTION.md`.
7.  **Vietnamese First**: All user-facing UI text and routes must be in Vietnamese.
