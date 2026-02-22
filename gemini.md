# Gemini's Operational Guide for BlackStoneBook Client

This document outlines the architecture, conventions, and workflow for the BlackStoneBook Client project. I will adhere to these guidelines for all tasks.

---

## 1. Project Overview & Tech Stack

- **Project**: A Next.js web application for an online book reading platform.
- **Framework**: Next.js 16 (App Router), React 19.
- **UI & Styling**: Shadcn UI, Tailwind CSS 4 (CSS-first configuration).
- **Backend**: Supabase.
- **Primary Language**: Vietnamese.

---

## 2. Core Architecture & Principles

### 2.1 Styling & Theme System (Tailwind 4)

- **Source of Truth**: Khối `@theme` trong `app/globals.css`.
- **Responsive Policy**: **LUÔN LUÔN ưu tiên Mobile-First**. Mọi component phải được thiết kế cho màn hình nhỏ nhất trước, sau đó dùng các prefix `sm:`, `md:`, `lg:`, `xl:` để mở rộng.
- **Dark/Light Mode**: Mặc định là Dark Mode. Sử dụng class `.light` để ghi đè.

### 2.2 Component Structure & Naming

- **`components/ui/`**: Thành phần nguyên thủy Shadcn (tên tệp viết thường).
- **`components/features/`**: Thành phần đặc thù theo domain (PascalCase).
- **`components/layout/`**: Thành phần cấu trúc trang (PascalCase).

### 2.3 Responsive Patterns

Khi xây dựng hoặc sửa đổi UI, tôi phải tuân thủ các mẫu (patterns) sau:
- **Navigation**: Sử dụng `Sheet` cho menu điều hướng trên Mobile.
- **Lists & Grids**: Số lượng cột phải thay đổi theo màn hình (ví dụ: `grid-cols-2 md:grid-cols-4 lg:grid-cols-7`).
- **Cards**: Đảm bảo thẻ truyện không bị cắt trên Mobile. Sử dụng `flex-col` hoặc `flex-row` linh hoạt.
- **Tables**: Sử dụng cuộn ngang hoặc chuyển đổi sang dạng thẻ (Cards) trên Mobile để tránh tràn màn hình.

---

## 3. Workflow & Conventions

- **Verification**: Chạy `npm run lint` sau khi thay đổi.
- **Commit Messages**: Tuân thủ Conventional Commits (`COMMIT_CONVENTION.md`).
- **Responsive Testing**: Luôn kiểm tra hiển thị trên ít nhất 3 breakpoint: Mobile (mặc định), Tablet (`md:`), và Laptop (`lg:`).

---

## 4. My Mandate

1.  **Mobile-First Always**: Không bao giờ bỏ qua hiển thị trên thiết bị di động.
2.  **Tailwind 4 Native**: Không sử dụng `tailwind.config.ts`. Toàn bộ cấu hình nằm trong `@theme`.
3.  **Strict Component Policy**: Ưu tiên sử dụng Shadcn UI. 
4.  **Vietnamese First**: Tất cả văn bản hiển thị phải là tiếng Việt.
5.  **Naming Integrity**: Giữ tên tệp UI viết thường đồng nhất.
