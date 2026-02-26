import React from "react";
import type { Metadata } from "next";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App";

export const metadata: Metadata = {
  title: `Điều khoản sử dụng | ${APP_NAME}`,
  description: `Các điều khoản và quy định khi sử dụng dịch vụ tại ${APP_NAME}.`,
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-6 lg:px-8 bg-surface-section text-text-primary min-h-screen">
      <h1 className="text-3xl font-bold mb-8 border-b border-border-default pb-4">Điều Khoản Sử Dụng</h1>
      
      <div className="prose prose-invert max-w-none space-y-6 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">1. Chấp nhận điều khoản</h2>
          <p>Bằng cách truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">2. Quyền sở hữu nội dung</h2>
          <p>Nội dung trên website (truyện, hình ảnh) được tổng hợp từ nhiều nguồn khác nhau trên internet. Chúng tôi cung cấp nền tảng để người dùng đọc truyện thuận tiện hơn và không chịu trách nhiệm về bản quyền của các nội dung này.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">3. Hành vi người dùng</h2>
          <p>Bạn đồng ý không sử dụng website cho bất kỳ mục đích trái pháp luật nào. Nghiêm cấm các hành vi:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sử dụng các công cụ tự động (bot, crawl) để lấy dữ liệu trái phép với số lượng lớn.</li>
            <li>Đăng tải nội dung đồi trụy, phản động hoặc vi phạm pháp luật Việt Nam.</li>
            <li>Spam quảng cáo hoặc gây rối cộng đồng người đọc.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">4. Thay đổi dịch vụ</h2>
          <p>Chúng tôi có quyền thay đổi, tạm ngừng hoặc chấm dứt bất kỳ phần nào của dịch vụ vào bất kỳ lúc nào mà không cần thông báo trước.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">5. Giới hạn trách nhiệm</h2>
          <p>Trong mọi trường hợp, {APP_NAME} sẽ không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp hoặc gián tiếp nào phát sinh từ việc bạn sử dụng website.</p>
        </section>
      </div>
    </main>
  );
}
