# Quy Tắc Đặt Tên (Naming Conventions)

Tài liệu này cung cấp hướng dẫn về quy tắc đặt tên cho các thành phần trong dự án BlackStoneBook Client, nhằm đảm bảo tính nhất quán, dễ đọc và dễ bảo trì cho mã nguồn.

## Nguyên Tắc Chung

*   **Rõ ràng và Mô tả:** Tên phải thể hiện rõ ràng mục đích hoặc nội dung của nó.
*   **Nhất quán:** Tuân thủ các quy tắc đã thiết lập trên toàn bộ dự án.
*   **Tiếng Anh:** Ưu tiên sử dụng tiếng Anh cho tên biến, hàm, lớp (ngoại trừ các trường hợp đặc biệt như tên route hiển thị cho người dùng là tiếng Việt).
*   **Tránh viết tắt không rõ ràng:** Chỉ viết tắt khi chúng phổ biến và dễ hiểu.

## Quy Tắc Cụ Thể

### 1. Biến (Variables)

*   **Quy tắc:** `camelCase` (ký tự đầu tiên viết thường, các từ tiếp theo viết hoa chữ cái đầu).
*   **Ví dụ:** `userName`, `bookId`, `newestChapterList`, `isLoggedIn`.
*   **Đối với hằng số (constants):** `SCREAMING_SNAKE_CASE` (tất cả viết hoa, dùng gạch dưới để phân tách).
    *   **Ví dụ:** `MAX_ITEMS_PER_PAGE`, `API_ENDPOINT_URL`.

### 2. Hàm (Functions)

*   **Quy tắc:** `camelCase`, bắt đầu bằng một động từ thể hiện hành động.
*   **Ví dụ:** `getUserProfile`, `fetchBookInfo`, `handleLoginClick`, `renderBookList`.
*   **Hàm Service:** Nên có động từ rõ ràng (`get`, `fetch`, `create`, `update`, `delete`).
    *   **Ví dụ:** `getNewestBookList`, `updateUserProfile`.

### 3. Lớp / Component React (Classes / React Components)

*   **Quy tắc:** `PascalCase` (ký tự đầu tiên của mỗi từ viết hoa).
*   **Ví dụ:** `UserHeader`, `BookCard`, `LoginPage`, `UserProfileForm`.

### 4. Giao diện / Kiểu dữ liệu (Interfaces / Types)

*   **Quy tắc:** `PascalCase`, thường có hậu tố `-Type` hoặc không có hậu tố nếu tên đã rõ ràng.
*   **Ví dụ:** `UserEntity`, `UserProfile`, `AuthContextType`, `BookCardWithAuthor`.

### 5. Tệp và Thư mục (Files and Folders)

*   **Quy tắc:**
    *   **Component thông thường (features, layout):** `PascalCase.tsx` (ví dụ: `BookCard.tsx`, `LoginPage.tsx`).
    *   **Component UI nguyên thủy (Shadcn):** `lowercase.tsx` (ví dụ: `button.tsx`, `card.tsx`, `input.tsx`).
    *   **Module Logic (service, repo, mapper, type):** `kebab-case.ts` hoặc `dot.case.ts` theo style hiện tại của dự án (ví dụ: `book.service.ts`, `user.type.ts`).
    *   **Route Next.js (trong thư mục `app`):** `page.tsx`, `layout.tsx` theo quy ước của Next.js. Tên thư mục route nên là `kebab-case` hoặc tiếng Việt không dấu theo quy ước hiện tại của dự án (ví dụ: `tai-khoan`, `trang-chu`).

### 6. CSS Classes (Tailwind CSS)

*   **Quy tắc:** Sử dụng các utility class của Tailwind CSS. Nếu cần custom CSS, nên theo quy ước `kebab-case` cho tên class truyền thống.
*   **Ví dụ:** `bg-surface-section`, `text-text-primary`.

### 7. Commit Messages (Lời nhắn Commit)

*   **Quy tắc:** Sử dụng Conventional Commits.
    *   **Cấu trúc:** `type(scope): subject`
    *   **Type:** `feat` (feature), `fix` (bug fix), `chore` (routine task), `docs` (documentation), `style` (code style), `refactor` (code refactor), `test` (adding tests), `perf` (performance improvement).
    *   **Scope:** Phạm vi của thay đổi (ví dụ: `auth`, `user-profile`, `book`, `ui`).
    *   **Subject:** Mô tả ngắn gọn thay đổi.
    *   **Body (tùy chọn):** Giải thích chi tiết hơn về `why` (tại sao) và `what` (cái gì) của thay đổi.

---
