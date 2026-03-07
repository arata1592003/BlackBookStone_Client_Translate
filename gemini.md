# Gemini's Operational Guide for BlackStoneBook Client

Tài liệu này quy định các quy tắc bắt buộc và quy trình kiểm tra mà tôi (AI Agent) phải thực hiện trước và trong khi sửa đổi mã nguồn. Mục tiêu là duy trì tính đóng gói, khả năng bảo trì và tổ chức hệ thống.

---

## 1. Nguyên tắc Kiến trúc Cốt lõi (Architectural Pillars)

### 1.1 Tính đóng gói của Module (Encapsulation)
- **KHÔNG** gọi trực tiếp `supabaseClient` hoặc thực hiện truy vấn Database trong các Component hoặc Server Actions.
- **LUÔN** tuân thủ luồng dữ liệu: `Database (Table) -> Repository (.repo) -> Mapper (.mapper) -> Service (.service) -> Server Action/UI`.
- Mọi logic tính toán, biến đổi dữ liệu phải nằm ở lớp **Service** hoặc **Mapper**.

### 1.2 Quy tắc truyền Client (Explicit Client Passing)
- Để đảm bảo Row Level Security (RLS) hoạt động đúng trên môi trường Server (SSR/Actions):
    - Các hàm trong **Repository** và **Service** phải nhận tham số `supabase: SupabaseClient` tùy chọn.
    - Tại **Server Actions**, bắt buộc khởi tạo `createServerSupabaseClient()` và truyền vào lớp dưới.
    - Nếu không được truyền (gọi từ Client Component), mặc định sử dụng `supabaseClient` (Browser Client).

### 1.3 Đồng bộ Schema (Schema Synchronization)
- Trước khi thay đổi bất kỳ logic dữ liệu nào, **BẮT BUỘC** phải đọc tệp `database/schema.sql`.
- Đảm bảo các trường dữ liệu (columns), tên bảng và kiểu dữ liệu (Types) luôn khớp 100% với schema thực tế.
- Xóa bỏ các trường dữ liệu thừa (legacy) ngay khi phát hiện chúng không còn tồn tại trong DB.

---

## 2. Quy trình Kiểm tra trước khi thực hiện (Pre-change Checklist)

Trước khi thực hiện lệnh `replace` hoặc `write_file`, tôi phải tự trả lời các câu hỏi sau:
1.  **Context Check**: Tôi đã đọc các tệp liên quan trong module đó chưa? (Kiểm tra xem hàm tương tự đã tồn tại chưa).
2.  **Naming Check**: Tên hàm/biến mới có tuân thủ `NAMING_CONVENTIONS.md` không? (camelCase cho hàm, PascalCase cho component).
3.  **UI Check**: Văn bản hiển thị có phải là tiếng Việt không? Có hỗ trợ Mobile-First không?
4.  **Security Check**: Bảng dữ liệu này đã có RLS chưa? Policy có cần cập nhật không?
5.  **Hydration Check**: Nếu sử dụng thư viện bên thứ ba (như progress bar, icons, charts), tôi đã bọc trong kiểm tra `mounted` chưa?

---

## 3. Quy ước kỹ thuật (Technical Conventions)

- **Styling**: Sử dụng Tailwind CSS 4 qua khối `@theme` trong `app/globals.css`. Không dùng tệp cấu hình `.ts`.
- **Icons**: Sử dụng duy nhất thư viện `lucide-react`.
- **SEO**: Luôn cập nhật Metadata cho các trang mới.
- **Realtime**: Ưu tiên sử dụng `postgres_changes` trên bảng `orders` cho các tính năng cần cập nhật trạng thái tức thì.
- **Background Jobs**: Sử dụng cơ chế Polling hoặc Realtime để theo dõi tiến độ từ bảng `book_jobs`.

---

## 4. Cam kết vận hành (Operational Commitment)

1.  **Tư duy hệ thống**: Không sửa lỗi cục bộ bằng cách phá vỡ cấu trúc chung.
2.  **Tài liệu**: Cập nhật `Architecture.md` nếu có thay đổi về luồng dữ liệu hoặc cấu trúc thư mục.
3.  **Chất lượng**: Luôn ưu tiên viết code sạch, dễ đọc và có kiểu dữ liệu (TypeScript) rõ ràng.
4.  **Bảo mật**: Tuyệt đối không để lộ thông tin nhạy cảm hoặc bỏ qua các bước kiểm tra quyền (Session/User).
