# Architecture

## Overview

BlackStoneBook Client is a **Next.js 16** web application for an online book reading and translation platform. It uses **TypeScript**, **React 19**, **Shadcn UI**, **Tailwind CSS 4**, and **Supabase** (PostgreSQL + Auth). The application is designed with a Vietnamese-first approach and a strict **Mobile-First Responsive** strategy.

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

## Responsive Design Strategy

Dự án tuân thủ nghiêm ngặt nguyên tắc **Mobile-First**. Toàn bộ các trang và thành phần phải hiển thị hoàn hảo trên điện thoại trước khi mở rộng ra các màn hình lớn hơn.

### 1. Bố cục (Layout)
- **User Dashboard**: Sử dụng `Sheet` (Drawer) trên Mobile để chứa menu điều hướng và `UserNavigationMenu` cố định (fixed sidebar) trên màn hình Laptop (`lg:` trở lên).
- **Navigation**: Thanh danh mục phụ (`HomeHeader.tsx`) sử dụng cuộn ngang (`overflow-x-auto`) trên Mobile để tiết kiệm diện tích.

### 2. Thành phần (Components)
- **Grids**: Số lượng cột phải thay đổi linh hoạt (ví dụ: 2 cột trên Mobile, 7 cột trên Laptop).
- **Thẻ truyện (Cards)**: 
    - `SearchBookCard`: Chuyển đổi giữa dạng dọc/ngang linh hoạt để không bị cắt thông tin.
    - `UserBookCard`: Tích hợp các nút hành động vào hàng ngang dưới cùng trên Mobile.
- **Typography**: Cỡ chữ được tinh chỉnh tự động (`text-sm` trên mobile, `text-base` trên laptop).

### 3. Hiệu ứng & UX
- Sử dụng **Glassmorphism** (backdrop-blur) cho các thanh điều hướng.
- Sử dụng **Skeleton** đồng bộ cho trạng thái loading trên mọi kích thước màn hình.

---

## Folder Structure

```
├── app/                          # Next.js App Router (pages & layouts)
│   ├── actions/                  # Next.js Server Actions (data mutations)
│   ├── (auth)/                   # Auth route group (no header)
│   ├── (main)/                   # Public route group (with HomeHeader)
│   ├── (user)/                   # User dashboard route group (sidebar layout)
│   ├── truyen/                   # Book & chapter pages
│   └── globals.css               # Global styles & Tailwind 4 @theme config
│
├── components/
│   ├── features/                 # Domain-specific components (PascalCase)
│   ├── layout/                   # Header, navigation wrappers (PascalCase)
│   └── ui/                       # Reusable Shadcn primitives (lowercase.tsx)
│
├── modules/                      # Business logic (layered architecture)
├── lib/                          # Utils and External service clients
└── public/                       # Static assets
```

---

## Layered Architecture

Mỗi module tuân theo cấu trúc 4 tệp: `{mod}.types.ts`, `{mod}.repo.ts`, `{mod}.mapper.ts`, `{mod}.service.ts`.

---

## State Management

- **Local State**: `useState` / `useReducer`.
- **Server State**: **React Query (TanStack Query)** cho fetching và caching.
- **Auth State**: `AuthProvider` xử lý Supabase session.

---

## Database Tables

| Table                | Purpose                   |
| -------------------- | ------------------------- |
| `books`              | Book metadata             |
| `chapters`           | Chapter metadata          |
| `users`              | User profiles             |
| `wallet_transactions`| User top-up/spend history |
| `jobs`               | Background crawl tasks    |
