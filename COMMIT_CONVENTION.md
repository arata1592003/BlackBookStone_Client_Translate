### Quy tắc Commit của Dự án

Chúng tôi tuân theo quy ước **Conventional Commits**. Điều này giúp cho việc tạo ra một lịch sử commit rõ ràng và dễ hiểu, đồng thời cho phép tự động hóa việc tạo changelog và quản lý phiên bản.

#### Cấu trúc chung của một Commit Message

Mỗi commit message bao gồm một **header**, một **body** (tùy chọn), và một **footer** (tùy chọn).

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### 1. Header

Header là phần bắt buộc và có định dạng `<type>(<scope>): <subject>`.

*   **`type`**: Mô tả loại thay đổi bạn đã thực hiện. Các `type` được phép bao gồm:
    *   `feat`: Một tính năng mới (a new feature).
    *   `fix`: Một bản sửa lỗi (a bug fix).
    *   `docs`: Chỉ thay đổi tài liệu (documentation only changes).
    *   `style`: Thay đổi không ảnh hưởng đến ý nghĩa của code (dấu chấm phẩy, định dạng, v.v.).
    *   `refactor`: Một thay đổi code không sửa lỗi cũng không thêm tính năng mới.
    *   `perf`: Một thay đổi code giúp cải thiện hiệu suất (a code change that improves performance).
    *   `test`: Thêm hoặc sửa các test.
    *   `build`: Thay đổi ảnh hưởng đến hệ thống build hoặc các phụ thuộc bên ngoài (ví dụ: `package.json`, `webpack.config.js`).
    *   `ci`: Thay đổi các file và script cấu hình CI (ví dụ: `Travis`, `Circle`, `BrowserStack`).
    *   `chore`: Các thay đổi khác không sửa đổi file mã nguồn hoặc test (ví dụ: cập nhật `.gitignore`).
    *   `revert`: Hoàn tác một commit trước đó.

*   **`scope` (tùy chọn)**: Cung cấp ngữ cảnh cho commit. Đây có thể là tên của một module, component, hoặc route. Ví dụ: `(auth)`, `(user-dashboard)`, `(book-service)`.

*   **`subject`**: Một mô tả ngắn gọn về thay đổi.
    *   Viết bằng thì hiện tại (ví dụ: "add" thay vì "added", "change" thay vì "changed").
    *   Không viết hoa chữ cái đầu.
    *   Không có dấu chấm ở cuối.
    *   Giới hạn trong khoảng 50 ký tự.

#### 2. Body (Tùy chọn)

*   Sử dụng body để giải thích **tại sao** bạn thực hiện thay đổi, thay vì chỉ giải thích **cái gì**.
*   Phân cách với header bằng một dòng trống.
*   Mỗi dòng nên được giới hạn trong khoảng 72 ký tự.

#### 3. Footer (Tùy chọn)

*   Dùng để tham chiếu đến các issue trên các hệ thống tracking (ví dụ: `Closes #123`, `Fixes #456`).
*   Đối với các thay đổi lớn (breaking changes), footer phải bắt đầu bằng `BREAKING CHANGE: ` theo sau là mô tả về thay đổi đó.

---

### Ví dụ

**Commit cho một tính năng mới:**

```
feat(auth): add google sign-in button

Implement the UI and logic for the Google sign-in functionality
on the login page. This uses the Supabase Auth provider.

Closes #78
```

**Commit sửa lỗi:**

```
fix(book-list): prevent crash when chapter list is empty

The component was trying to access the first element of an empty
array, leading to a runtime error. Added a check to ensure the
array is not empty before proceeding.

Fixes #101
```

**Commit refactor không có breaking change:**

```
refactor(user-service): abstract user fetching logic into a separate function

The logic for fetching user data was duplicated in two places.
This change consolidates it into a single, reusable function
`fetchUserById` to improve maintainability.
```

**Commit có BREAKING CHANGE:**

```
feat(api): change user id from integer to uuid

BREAKING CHANGE: The `id` field on the `User` object is now a string
(UUID) instead of an integer. Any part of the application that
relies on the user ID being an integer will need to be updated.
```