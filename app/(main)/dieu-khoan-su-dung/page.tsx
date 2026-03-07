import type { Metadata } from "next";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App";

export const metadata: Metadata = {
  title: `Điều khoản sử dụng | ${APP_NAME}`,
  description: `Các điều khoản và quy định khi sử dụng công cụ dịch thuật tại ${APP_NAME}.`,
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-6 lg:px-8 bg-surface-section text-text-primary min-h-screen">
      <h1 className="text-3xl font-bold mb-8 border-b border-border-default pb-4">
        Điều Khoản Sử Dụng
      </h1>

      <div className="prose prose-invert max-w-none space-y-6 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            1. Chấp nhận điều khoản
          </h2>
          <p>
            Bằng cách truy cập và sử dụng {APP_NAME}, bạn đồng ý tuân thủ các
            điều khoản và điều kiện được nêu dưới đây. Đây là một công cụ hỗ trợ dịch thuật AI, bạn chịu trách nhiệm hoàn toàn về cách thức sử dụng công cụ này.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            2. Phạm vi dịch vụ
          </h2>
          <p>
            {APP_NAME} cung cấp nền tảng công nghệ cho phép người dùng tự tải lên, quản lý và dịch thuật các nội dung văn bản. Chúng tôi không cung cấp hoặc lưu trữ sẵn các nội dung truyện có bản quyền cho công chúng.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            3. Quyền sở hữu và Trách nhiệm nội dung
          </h2>
          <p>
            Bạn giữ mọi quyền sở hữu đối với nội dung văn bản mà bạn tải lên công cụ. Tuy nhiên, bằng việc sử dụng dịch vụ, bạn cam kết rằng:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Bạn có quyền sử dụng nội dung đó cho mục đích cá nhân hoặc dịch thuật.</li>
            <li>Nội dung không vi phạm các quy định về thuần phong mỹ tục, pháp luật Việt Nam.</li>
            <li>Bạn tự chịu trách nhiệm về mọi vấn đề bản quyền phát sinh từ việc sử dụng các bản dịch được tạo ra bởi công cụ.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            4. Hành vi nghiêm cấm
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Sử dụng các công cụ tự động để tấn công, phá hoại hoặc khai thác lỗi hệ thống.
            </li>
            <li>
              Sử dụng công cụ để tạo ra hoặc lan truyền các nội dung độc hại, vi phạm pháp luật.
            </li>
            <li>Gian lận trong việc nạp và sử dụng Credit.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            5. Thay đổi và Chấm dứt
          </h2>
          <p>
            Chúng tôi có quyền thay đổi các tính năng, bảng giá hoặc chấm dứt cung cấp dịch vụ đối với các tài khoản vi phạm điều khoản mà không cần thông báo trước.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            6. Giới hạn trách nhiệm
          </h2>
          <p>
            {APP_NAME} cung cấp công cụ "như hiện có". Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc kết quả dịch thuật không như mong muốn hoặc các vấn đề liên quan đến mất mát dữ liệu do người dùng gây ra.
          </p>
        </section>
      </div>
    </main>
  );
}
