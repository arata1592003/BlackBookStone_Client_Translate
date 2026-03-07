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
            Chúng tôi thu thập thông tin khi bạn đăng ký tài khoản trên website thông qua Google,
            đăng nhập vào tài khoản, hoặc thực hiện các hoạt động tương tác khác trên công cụ. 
            Thông tin thu thập bao gồm tên (Họ và tên), địa chỉ email và ảnh đại diện từ tài khoản Google của bạn.
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
            <li>Cá nhân hóa trải nghiệm của bạn trên công cụ dịch thuật.</li>
            <li>Quản lý và lưu trữ các thiết lập dịch thuật, quy tắc (rules) cá nhân của bạn.</li>
            <li>Cải thiện chất lượng dịch vụ và tính năng của công cụ.</li>
            <li>
              Gửi thông báo quan trọng về trạng thái tài khoản hoặc các cập nhật hệ thống.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            3. Dữ liệu dịch thuật
          </h2>
          <p>
            Nội dung thô (raw text) bạn tải lên và các bản dịch được tạo ra thông qua công cụ là tài sản cá nhân của bạn. 
            Chúng tôi cam kết không chia sẻ hoặc sử dụng các dữ liệu này cho mục đích thương mại mà không có sự đồng ý của bạn.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            4. Bảo mật dữ liệu
          </h2>
          <p>
            Chúng tôi thực hiện nhiều biện pháp bảo mật khác nhau để duy trì sự
            an toàn cho thông tin cá nhân của bạn. Dữ liệu của bạn được lưu trữ
            trên hệ thống hạ tầng an toàn của Supabase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            5. Cookies
          </h2>
          <p>
            Chúng tôi sử dụng cookies để duy trì phiên đăng nhập và ghi nhớ các tùy chỉnh giao diện (ví dụ: chế độ sáng/tối) để tối ưu hóa trải nghiệm sử dụng công cụ.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            6. Liên hệ
          </h2>
          <p>
            Nếu có bất kỳ câu hỏi nào liên quan đến chính sách bảo mật này, bạn
            có thể liên hệ với chúng tôi qua địa chỉ email hacthachtruyen@gmail.com.
          </p>
        </section>
      </div>
    </main>
  );
}
