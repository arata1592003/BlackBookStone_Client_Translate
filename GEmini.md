# Gemini's Operational Guide for BlackStoneBook Client

This document outlines the architecture, conventions, and workflow for the BlackStoneBook Client project. I will adhere to these guidelines for all tasks.

---

## 1. Project Overview & Tech Stack

- **Project**: A Next.js web application for an online book reading platform.
- **Language**: TypeScript
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL Database + Auth)
- **Primary Language**: Vietnamese

| Layer     | Technology         |
|-----------|--------------------|
| Framework | Next.js 16         |
| Language  | TypeScript         |
| UI        | React 19           |
| Styling   | Tailwind CSS 4     |
| Backend   | Supabase           |
| Linting   | ESLint             |

---

## 2. Core Architecture & Principles

This project uses a strict layered architecture. I will always respect these boundaries.

```
┌─────────────────────────────────┐
│   Presentation (components/)    │  - React components, pages.
├─────────────────────────────────┤
│   Service (modules/*/service)   │  - Business logic, orchestration.
├─────────────────────────────────┤
│   Mapper (modules/*/mapper)     │  - Transforms DB data to UI models.
├─────────────────────────────────┤
│   Repository (modules/*/repo)   │  - Direct Supabase queries.
└─────────────────────────────────┘
```

- **Modules (`modules/`)**: Business logic is separated by domain (e.g., `book`, `user`). Any new logic must follow the existing 4-file pattern:
    - `{domain}.types.ts`: Defines `Entity` (DB), `Row` (query), and `Domain` (UI) models.
    - `{domain}.repo.ts`: For all database queries using Supabase client.
    - `{domain}.mapper.ts`: For transforming data between layers (e.g., `BookEntity` to `BookInfo`).
    - `{domain}.service.ts`: For orchestrating calls to the repository and mappers.

- **Components (`components/`)**:
    - `ui/`: Generic, reusable primitives (e.g., `Button`, `Card`). Must use `twMerge` and `forwardRef`.
    - `features/`: Domain-specific components that interact with module services.
    - `layout/`: Major page structure and navigation components.

- **Styling**:
    - **Utility-First**: Use Tailwind CSS classes directly.
    - **Responsiveness**: Mobile-first design.
    - **Theming**: Use CSS variables defined in `styles/variables.css` and `globals.css`.

- **State Management**: No central store. I will use component-local state (`useState`), Supabase for auth state, and Server Components for data fetching.

---

## 3. Workflow & Conventions

- **Installation**: `npm install`
- **Development**: `npm run dev`
- **Verification**: `npm run lint` (I will run this after making changes to ensure code quality).
- **Routing**: All routes are defined in the `app/` directory and use Vietnamese names (e.g., `/trang-chu`, `/dang-nhap`).
- **Naming**:
    - Components: `PascalCase` (`BookCard.tsx`)
    - Functions/Variables: `camelCase` (`getBookInfo`)
    - DB Columns: `snake_case` (`book_name`)
    - Props Interfaces: `PascalCaseProps` (`BookCardProps`)
- **Commit Messages**: I will follow the Conventional Commits specification outlined in `COMMIT_CONVENTION.md`.

    - **Format**: `<type>(<scope>): <subject>`
    - **Common Types**:
        - `feat`: A new feature.
        - `fix`: A bug fix.
        - `refactor`: Code change that neither fixes a bug nor adds a feature.
        - `style`: Changes that do not affect the meaning of the code (formatting).
        - `docs`: Documentation only changes.
        - `chore`: Other changes that don't modify source or test files.

---

## 4. My Mandate

1.  **Strictly Adhere to Architecture**: I will not bypass the service or repository layers. All business logic and data access must go through the appropriate module files.
2.  **Follow Conventions**: All new code will conform to the project's established naming, typing, and styling conventions.
3.  **Place Files Correctly**: New components, modules, and utilities will be created in the correct directories.
4.  **Verify My Work**: I will use `npm run lint` to check for issues before considering a task complete.
5.  **Commit Correctly**: All commits will be formatted according to the project's commit convention.
6.  **Vietnamese First**: All user-facing UI text and routes must be in Vietnamese.
