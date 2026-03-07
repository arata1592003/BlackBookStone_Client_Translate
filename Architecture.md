# Architecture

## Overview

BlackStoneBook Client is a **Next.js 16** web application designed as a professional **AI Translation & Book Management Tool**. It uses **TypeScript**, **React 19**, **Shadcn UI**, **Tailwind CSS 4**, and **Supabase** (PostgreSQL + Auth + Realtime). The system features a sophisticated background job processing for large-scale translations and a realtime automated payment integration.

---

## Tech Stack

| Layer        | Technology                        |
| ------------ | --------------------------------- |
| Framework    | Next.js 16 (App Router)          |
| Language     | TypeScript                        |
| UI Library   | Shadcn UI (Radix UI based)        |
| Styling      | Tailwind CSS 4 (CSS-first)        |
| Database     | Supabase (PostgreSQL + Realtime)  |
| Auth         | Supabase Auth (Google OAuth)      |
| Icons        | Lucide React                      |

---

## Responsive Design Strategy

Dự án tuân thủ nghiêm ngặt nguyên tắc **Mobile-First**.

### 1. Bố cục (Layout)
- **User Dashboard**: Sidebar cố định trên Desktop (`lg:`), ẩn vào `Sheet` (Drawer) trên Mobile.
- **Header**: Hiển thị số dư Credit Realtime và thông tin tài khoản đồng bộ trên mọi thiết bị.

### 2. Thành phần (Components)
- **Payment Dialog**: Bố cục ngang (Horizontal) trên màn hình lớn để tối ưu không gian QR Code và thông tin chuyển khoản.
- **Translation Manager**: Giao diện Grid hiển thị danh sách chương kèm trạng thái Job (Pending, Running, Done, Error).

---

## Folder Structure

```
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions (Auth, Book, Payment, Rule, Translate)
│   ├── (auth)/                   # Authentication pages
│   ├── (main)/                   # Public pages (Landing page, Policies)
│   ├── (user)/                   # User Dashboard (Workdesk, Wallet, Profile)
│   ├── auth/callback/            # OAuth callback route
│   └── globals.css               # Tailwind 4 @theme config
│
├── components/
│   ├── features/                 # Domain-specific components
│   ├── layout/                   # Global layout wrappers
│   └── ui/                       # Shadcn primitives
│
├── modules/                      # Business logic (Repo -> Mapper -> Service)
├── lib/                          # Supabase clients & Utils
├── proxy.ts                      # Core Auth Guard & Routing logic
└── middleware.ts                 # Next.js Middleware connector
```

---

## Core Systems

### 1. AI Translation Workflow
- **Background Jobs**: Sử dụng API `/jobs` để xử lý dịch thuật ngầm. Client thực hiện Polling trạng thái.
- **Rule System**: Cho phép người dùng tùy chỉnh mảnh ghép Prompt (Rules) và tổ hợp quy tắc (Rule Sets).

### 2. Payment & Wallet
- **Automated Payment**: Tích hợp SePay Webhook.
- **Supabase Realtime**: Lắng nghe `postgres_changes` trên bảng `orders` để cập nhật số dư ngay khi thanh toán thành công.
- **Centralized Wallet**: Dashboard quản lý số dư, nạp tiền và lịch sử giao dịch tại một nơi duy nhất.

---

## Database Schema (Key Tables)

| Table                 | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `profiles`            | User basic info (mapped from Auth)        |
| `books`               | Minimal book metadata                     |
| `chapters`            | Flat structure for raw & translated text  |
| `wallets`             | User credit balance                       |
| `credit_packages`     | Available top-up plans                    |
| `credit_transactions` | Detailed ledger of all financial activity |
| `orders`              | Payment order tracking                    |
| `book_jobs`           | High-level translation task tracking      |
| `translation_rules`   | Custom AI prompts snippets                |
