# BlackStoneBook Client - AI Translation Powerhouse

BlackStoneBook Client là một nền tảng Web Tool chuyên nghiệp dành cho dịch giả và tác giả, hỗ trợ dịch thuật và quản lý truyện online sử dụng trí tuệ nhân tạo (AI).

## Đặc điểm nổi bật

- **Dịch thuật AI Ngữ cảnh sâu**: Không chỉ dịch từ ngữ, AI hiểu văn phong, xưng hô và các quy tắc chuyên biệt của từng bộ truyện.
- **Background Job Processing**: Xử lý dịch thuật hàng nghìn chương ngầm dưới Backend, không lo timeout trình duyệt.
- **Thanh toán Realtime**: Tích hợp SePay tự động, cập nhật số dư ngay lập tức thông qua Supabase Realtime (Postgres Changes).
- **Quản lý Kho truyện thông minh**: Tự động tách chương từ file thô (.txt, .docx), hỗ trợ tải lên hàng loạt qua file ZIP.
- **Ví điện tử tập trung**: Dashboard quản lý tài chính, nạp tiền và lịch sử giao dịch chuyên nghiệp.
- **Xuất bản đa định dạng**: Đóng gói và tải về truyện dưới dạng DOCX, EPUB (Kindle ready) hoặc JSON.

## Công nghệ sử dụng

- **Framework**: Next.js 16 (App Router) & React 19
- **UI & Styling**: Shadcn UI & Tailwind CSS 4 (CSS-first)
- **Backend Service**: Supabase (Database, Auth, Realtime)
- **State Management**: TanStack Query (React Query)
- **File Processing**: Mammoth.js (DOCX), JSZip (ZIP)

## Bắt đầu

### Cài đặt dependencies

```bash
npm install
```

### Chạy môi trường phát triển

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để trải nghiệm công cụ.

## Tài liệu nội bộ

- [Chi tiết Kiến trúc](./Architecture.md): Sơ đồ luồng dữ liệu và cấu trúc thư mục.
- [Quy ước đặt tên](./NAMING_CONVENTIONS.md): Quy định cho lập trình viên.
- [Hướng dẫn vận hành AI](./gemini.md): Quy trình làm việc dành cho AI Agent.

## Triển khai

Hỗ trợ deploy mượt mà trên Vercel hoặc VPS thông qua tệp `proxy.ts` để đảm bảo tính ổn định của Middleware.
