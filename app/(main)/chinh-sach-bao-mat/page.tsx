import type { Metadata } from "next";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App";

export const metadata: Metadata = {
  title: `Chính sách bảo mật | ${APP_NAME}`,
  description: `Chính sách bảo mật thông tin người dùng tại ${APP_NAME}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-6 lg:px-8 bg-surface-section text-text-primary min-h-screen">
      <h1 className="text-3xl font-bold mb-8 border-b border-border-default pb-4">
        Chính Sách Bảo Mật
      </h1>

      <div className="prose prose-invert max-w-none space-y-6 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            1. Thu thập thông tin
          </h2>
          <p>
            Chúng tôi thu thập thông tin khi bạn đăng ký tài khoản trên website,
            đăng nhập vào tài khoản, hoặc thực hiện các hoạt động tương tác
            khác. Thông tin thu thập bao gồm tên, địa chỉ email và số điện thoại
            (nếu có).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            2. Sử dụng thông tin
          </h2>
          <p>
            Bất kỳ thông tin nào chúng tôi thu thập từ bạn có thể được sử dụng
            để:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cá nhân hóa trải nghiệm của bạn.</li>
            <li>Cung cấp nội dung truyện phù hợp.</li>
            <li>Cải thiện dịch vụ khách hàng.</li>
            <li>
              Gửi email định kỳ về cập nhật chương mới hoặc thông báo quan
              trọng.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            3. Bảo mật dữ liệu
          </h2>
          <p>
            Chúng tôi thực hiện nhiều biện pháp bảo mật khác nhau để duy trì sự
            an toàn cho thông tin cá nhân của bạn. Dữ liệu của bạn được lưu trữ
            trên hệ thống máy chủ an toàn của Supabase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            4. Cookies
          </h2>
          <p>
            Chúng tôi sử dụng cookies để ghi nhớ phiên đăng nhập và các cài đặt
            giao diện của bạn (ví dụ: chế độ sáng/tối, cỡ chữ khi đọc truyện).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            5. Liên hệ
          </h2>
          <p>
            Nếu có bất kỳ câu hỏi nào liên quan đến chính sách bảo mật này, bạn
            có thể liên hệ với chúng tôi qua thông tin ở chân trang.
          </p>
        </section>
      </div>
    </main>
  );
}
