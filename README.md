# BlackStoneBook Client

BlackStoneBook Client là một ứng dụng web đọc truyện trực tuyến và quản lý dịch thuật, được xây dựng với các công nghệ hiện đại nhằm tối ưu hóa hiệu suất và trải nghiệm người dùng.

## Công nghệ sử dụng

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Shadcn UI (Radix UI)
- **Styling**: Tailwind CSS 4 (CSS-first configuration)
- **Language**: TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: React Query (TanStack Query)
- **Iconography**: Lucide React

## Đặc điểm nổi bật

- **Kiến trúc phân lớp**: Tách biệt rõ ràng giữa Presentation, Service, Mapper và Repository.
- **Hệ thống Theme mạnh mẽ**: Hỗ trợ Dark Mode (mặc định) và Light Mode dựa trên Tailwind 4 và biến CSS.
- **Tối ưu hóa SEO**: Tích hợp Metadata động cho từng đầu truyện và chương.
- **Hiệu suất cao**: Sử dụng Server Components cho render ban đầu và Server Actions cho các thao tác dữ liệu.
- **Giao diện tiếng Việt**: Toàn bộ nội dung và tuyến đường đều sử dụng tiếng Việt.

## Bắt đầu

### Cài đặt dependencies

```bash
npm install
```

### Chạy môi trường phát triển

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt của bạn để xem kết quả.

## Tài liệu tham khảo

- [Kiến trúc dự án](./Architecture.md)
- [Quy tắc đặt tên](./NAMING_CONVENTIONS.md)
- [Quy ước Commit](./COMMIT_CONVENTION.md)
- [Hướng dẫn vận hành Gemini](./gemini.md)

## Triển khai

Dễ dàng triển khai trên Vercel Platform. Tham khảo [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) để biết thêm chi tiết.
