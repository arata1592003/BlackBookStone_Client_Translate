import type { Metadata } from "next";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App";

export const metadata: Metadata = {
  title: `Miễn trừ trách nhiệm | ${APP_NAME}`,
  description: `Thông tin về việc miễn trừ trách nhiệm nội dung tại ${APP_NAME}.`,
};

export default function DisclaimerPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-6 lg:px-8 bg-surface-section text-text-primary min-h-screen">
      <h1 className="text-3xl font-bold mb-8 border-b border-border-default pb-4">
        Miễn Trừ Trách Nhiệm
      </h1>

      <div className="prose prose-invert max-w-none space-y-6 text-text-secondary">
        <p className="italic text-warning font-medium">
          Vui lòng đọc kỹ thông báo miễn trừ trách nhiệm này trước khi sử dụng
          dịch vụ của chúng tôi.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            1. Nguồn gốc nội dung
          </h2>
          <p>
            Tất cả các nội dung (bao gồm nhưng không giới hạn ở văn bản, hình
            ảnh, thông tin tác giả) trên website này được thu thập, lưu trữ và
            tổng hợp tự động từ các nguồn công khai trên internet. Chúng tôi
            không trực tiếp sở hữu hoặc kiểm soát các nội dung này.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            2. Vấn đề bản quyền (Copyright)
          </h2>
          <p>
            Chúng tôi tôn trọng quyền sở hữu trí tuệ của người khác. Nếu bạn tin
            rằng bất kỳ nội dung nào trên website của chúng tôi vi phạm bản
            quyền của bạn, vui lòng gửi thông báo cho chúng tôi kèm theo các tài
            liệu chứng minh. Chúng tôi sẽ xử lý và gỡ bỏ nội dung vi phạm trong
            vòng 48-72 giờ làm việc.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            3. Tính chính xác của thông tin
          </h2>
          <p>
            Mặc dù chúng tôi cố gắng cung cấp trải nghiệm tốt nhất, {APP_NAME}{" "}
            không đảm bảo về tính chính xác, hoàn thiện hoặc độ tin cậy của bất
            kỳ nội dung nào được đăng tải. Người dùng tự chịu trách nhiệm khi sử
            dụng thông tin trên website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            4. Liên kết bên thứ ba
          </h2>
          <p>
            Website có thể chứa các liên kết đến các trang web khác không do
            chúng tôi quản lý. Chúng tôi không chịu trách nhiệm về nội dung hoặc
            chính sách của các trang web bên thứ ba đó.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            5. Thay đổi thông báo
          </h2>
          <p>
            Chúng tôi có quyền sửa đổi nội dung miễn trừ trách nhiệm này vào bất
            cứ lúc nào. Việc bạn tiếp tục sử dụng website đồng nghĩa với việc
            chấp nhận các thay đổi này.
          </p>
        </section>
      </div>
    </main>
  );
}
