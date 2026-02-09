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
- **Primary Language**: Vietnamese. Các tuyến đường và văn bản hiển thị ra người dùng đều sử dụng tiếng Việt.

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

### 2.4 Data Fetching & Caching Strategy

Để tối ưu hóa việc tải dữ liệu và giảm thiểu các lệnh gọi API không cần thiết, dự án sử dụng chiến lược caching kết hợp giữa Next.js và React Query:

-   **Server Components (`app/*` không phải `'use client'`):**
    *   Sử dụng biến `export const revalidate = <seconds>;` trong các tệp `page.tsx` hoặc `layout.tsx`.
    *   Cơ chế này sẽ cache toàn bộ kết quả HTML được render của trang hoặc layout trong một khoảng thời gian nhất định (`seconds`).
    *   Áp dụng cho các trang công khai (public pages) có dữ liệu tương đối tĩnh, giúp tăng tốc độ tải trang ban đầu và giảm tải cho server.
    *   Ví dụ: Trang chi tiết truyện (`app/truyen/[slug]/page.tsx`) sử dụng `revalidate` để cache thông tin sách.

-   **Client Components (`'use client'`):**
    *   Sử dụng thư viện **React Query (TanStack Query)** để quản lý trạng thái từ server (server state) và caching.
    *   Các hook như `useQuery` được dùng để fetch dữ liệu. React Query sẽ tự động cache kết quả, thực hiện chiến lược "stale-while-revalidate" (trả về dữ liệu cũ trong khi làm mới dưới nền), và quản lý các trạng thái loading/error.
    *   Cấu hình `queryKey` theo cấu trúc `['tên_dữ_liệu', id_người_dùng_nếu_có]` để đảm bảo cache độc đáo cho từng loại dữ liệu và từng người dùng.
    *   `staleTime`: Thời gian dữ liệu được coi là "tươi" (fresh). Trong thời gian này, React Query sẽ trả về dữ liệu từ cache mà không cần kiểm tra lại server.
    *   `enabled`: Kiểm soát điều kiện để query được kích hoạt, thường dùng để chờ các dữ liệu phụ thuộc (ví dụ: `enabled: !!user` để chờ có thông tin user).
    *   Ví dụ: Các trang dashboard người dùng (`app/(user)/tai-khoan/*`) sử dụng `useQuery` để lấy dữ liệu profile, danh sách truyện, lịch sử giao dịch.

Chiến lược này giúp cân bằng giữa hiệu suất phía server và trải nghiệm người dùng phía client, đồng thời giảm đáng kể số lượng lệnh gọi API đến Supabase.

### 2.5 Tổng quan về lược đồ Supabase

Dự án sử dụng Supabase làm backend, với cấu trúc cơ sở dữ liệu PostgreSQL được định nghĩa trong `database/schema.sql`. Dưới đây là các bảng chính và mục đích của chúng:

-   **`users`**: Lưu trữ thông tin hồ sơ người dùng, liên kết với bảng `auth.users` của Supabase.
-   **`wallets`**: Quản lý số dư tiền ảo (gem) của người dùng.
-   **`wallet_transactions`**: Ghi lại lịch sử giao dịch nạp/tiêu gem của người dùng.
    -   **`wallet_transaction_topup_plans`**: Chi tiết giao dịch nạp tiền thông qua các gói nạp.
    -   **`wallet_transaction_chapters`**: Chi tiết giao dịch khi người dùng mua quyền truy cập chương truyện.
-   **`topup_plans`**: Định nghĩa các gói nạp tiền (giá, số gem nhận được).
-   **`books`**: Lưu trữ thông tin chi tiết về các truyện (tiêu đề, tác giả, mô tả, ảnh bìa, slug, nguồn).
    -   **`book_follows`**: Ghi lại việc người dùng theo dõi một truyện.
    -   **`book_comments`**: Bình luận của người dùng về truyện.
    -   **`book_tags`**: Liên kết truyện với các thể loại/thẻ.
-   **`chapters`**: Lưu trữ thông tin các chương truyện (tiêu đề, số chương, số lượt xem, trạng thái).
    -   **`chapter_content`**: Lưu trữ nội dung chi tiết của chương (raw và đã dịch).
    -   **`chapter_access`**: Ghi lại quyền truy cập của người dùng vào các chương trả phí.
-   **`tags`**: Danh sách các thể loại/thẻ của truyện.
-   **`sources`**: Thông tin về các nguồn truyện bên ngoài.
-   **`jobs`**: Hàng đợi các tác vụ nền (ví dụ: crawl dữ liệu, dịch).
-   **`settings`**: Cài đặt ứng dụng.

Các mối quan hệ giữa các bảng được thiết lập thông qua khóa ngoại (FOREIGN KEY), đảm bảo tính toàn vẹn dữ liệu.

### 2.6 Next.js Server Actions (app/actions/)

Thư mục `app/actions/` chứa các Next.js Server Actions, cung cấp một cách an toàn và hiệu quả để thực thi các tác vụ phía máy chủ trực tiếp từ các Client Components hoặc Server Components.

Các điểm chính:
-   **"use server"**: Đặt ở đầu tệp hoặc đầu hàm để đánh dấu là Server Action.
-   **Tương tác với Supabase**: Sử dụng `createServerSupabaseClient` để tương tác an toàn với Supabase (xác thực, thao tác dữ liệu).
-   **Logic nghiệp vụ**: Thường gọi các hàm từ thư mục `modules/*/service` để xử lý logic nghiệp vụ.
-   **Xử lý biểu mẫu**: Dùng để xử lý việc gửi dữ liệu từ `<form action="...">`.
-   **Điều hướng & Xác thực lại Cache**: Sử dụng `redirect` từ `next/navigation` để chuyển hướng và `revalidatePath` từ `next/cache` để vô hiệu hóa cache và đảm bảo UI hiển thị dữ liệu mới nhất sau khi thay đổi.
-   **Xử lý lỗi**: Cung cấp cơ chế xử lý lỗi và trả về phản hồi có cấu trúc (thành công/lỗi).

**Ví dụ:**
-   `app/actions/auth.ts`: Xử lý đăng nhập, đăng xuất người dùng.
-   `app/actions/book.ts`: Lấy metadata sách từ nguồn, tạo truyện mới.
-   `app/actions/user.ts`: Cập nhật thông tin hồ sơ người dùng.

Các Server Actions giúp đơn giản hóa việc quản lý dữ liệu và logic phía máy chủ, đồng thời cải thiện hiệu suất bằng cách giảm thiểu lượng JavaScript phía client.


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

- **Never Assume File Content**: Tôi sẽ KHÔNG BAO GIỜ giả định nội dung của bất kỳ tệp nào. Trước khi thực hiện bất kỳ sửa đổi nào, tôi SẼ LUÔN đọc nội dung đầy đủ của tệp đó bằng `read_file` để đảm bảo tính chính xác và tránh các thay đổi không mong muốn.
1.  **Strictly Adhere to Architecture**: I will not bypass the service or repository layers. All new features will respect the established Route Group structure (`(main)`, `(user)`, `(auth)`).
2.  **Follow Conventions**: All new code will conform to the project's established naming, typing, styling, and iconography (`lucide-react`) conventions.
3.  **Place Files Correctly**: New pages and layouts will be placed in the correct route group. New reusable components will be placed in the appropriate `components` subdirectory.
4.  **Utilize Existing Modules**: I will use the `wallet` and `plan` modules for any features involving user currency. I will use the `book` module for fetching both owned and followed books.
5.  **Verify My Work**: I will use `npm run lint` to check for issues before considering a task complete.
6.  **Commit Correctly**: All commits will be formatted according to `COMMIT_CONVENTION.md`.
7.  **Vietnamese First**: All user-facing UI text and routes must be in Vietnamese.
