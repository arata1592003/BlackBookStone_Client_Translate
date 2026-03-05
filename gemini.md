# Gemini's Operational Guide for BlackStoneBook Client

Tài liệu này quy định kiến trúc, quy ước và quy trình làm việc cho dự án BlackStoneBook Client. Tôi sẽ tuân thủ các hướng dẫn này trong mọi tác vụ.

---

## 1. Project Overview & Tech Stack

- **Project**: Nền tảng hỗ trợ dịch thuật và quản lý truyện online.
- **Framework**: Next.js 16 (App Router), React 19.
- **UI & Styling**: Shadcn UI, Tailwind CSS 4 (CSS-first configuration).
- **Backend**: Supabase (Auth, Database, Storage).
- **Primary Language**: Tiếng Việt.

---

## 2. Core Architecture & Principles

### 2.1 Database & Data Model (Schema Tối Giản)
Dự án sử dụng schema database tối giản, tập trung vào tính năng cốt lõi:
- **`profiles`**: Thay thế cho bảng users. Cột chính: `id`, `full_name`, `avatar_url`. Không dùng `first_name`/`last_name`.
- **`books`**: Chỉ chứa thông tin cơ bản: `id`, `user_id` (chủ sở hữu), `name`, `expire_at`. Các thông tin metadata khác (tác giả, mô tả, ảnh bìa) hiện đã bị lược bỏ.
- **`chapters`**: Chứa nội dung truyện. Cột chính: `book_id`, `chapter_number`, `chapter_title_translated`, `content_translated`.
- **`credit_packages`**: (Trước là topup_plans) Quản lý các gói nạp credit.
- **`credit_transactions`**: (Trước là wallet_transactions) Lịch sử biến động credit.

### 2.2 Repository & Service Pattern (Explicit Client Passing)
Để hỗ trợ cả **Client Components** và **Server Components/Actions**, mọi Repository và Service phải tuân thủ:
- **Repository**: Các hàm lấy dữ liệu phải nhận tham số `supabase: SupabaseClient` tùy chọn. Nếu không truyền, mặc định dùng `supabaseClient` (Browser Client).
- **Server Actions**: Luôn khởi tạo `createServerSupabaseClient` và truyền vào Service/Repo để đảm bảo xác thực qua Cookie và RLS hoạt động đúng.
- **Data Mapping**: Luôn có lớp Mapper để chuyển đổi từ định dạng Database (snake_case) sang định dạng Frontend (camelCase) và xử lý các giá trị mặc định.

### 2.3 Styling & Theme System (Tailwind 4)
- **Source of Truth**: Khối `@theme` trong `app/globals.css`. Không dùng `tailwind.config.ts`.
- **Responsive**: **Mobile-First Always**. Ưu tiên hiển thị trên di động, sau đó dùng `sm:`, `md:`, `lg:` cho màn hình lớn.
- **Dark Mode**: Là chế độ mặc định.

---

## 3. Workflow & Conventions

### 3.1 Naming Conventions
- **Components**: PascalCase (ví dụ: `UserBookCard.tsx`).
- **UI primitives**: viết thường (ví dụ: `button.tsx`).
- **Modules**: Cấu trúc gồm `[domain].repo.ts`, `[domain].service.ts`, `[domain].mapper.ts`, `[domain].types.ts`.

### 3.2 Security (RLS)
- Mọi bảng mới phải được kích hoạt **Row Level Security (RLS)**.
- Phải tạo Policy cho role `authenticated` dựa trên `auth.uid()`.
- Cấp quyền `GRANT SELECT, INSERT... ON TABLE ... TO authenticated`.

---

## 4. My Mandate (Nhiệm vụ của tôi)

1.  **Sync with Schema**: Luôn kiểm tra `database/schema.sql` trước khi thay đổi logic dữ liệu.
2.  **Explicit Client**: Luôn truyền Supabase Client từ Server Actions xuống lớp dưới.
3.  **Vietnamese First**: Tất cả văn bản hiển thị phải là tiếng Việt.
4.  **No Hydration Errors**: Đảm bảo các Client Component dùng thư viện bên ngoài (như progress bar) được bọc trong kiểm tra `mounted`.
5.  **Clean Code**: Xóa bỏ các trường dữ liệu thừa (legacy) ngay khi phát hiện chúng không còn trong schema.
