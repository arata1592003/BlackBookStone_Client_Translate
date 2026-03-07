import type { Metadata } from "next";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App";

export const metadata: Metadata = {
  title: `Miễn trừ trách nhiệm | ${APP_NAME}`,
  description: `Thông tin về việc miễn trừ trách nhiệm sử dụng công cụ dịch thuật tại ${APP_NAME}.`,
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
          công cụ của chúng tôi.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            1. Bản chất dịch vụ
          </h2>
          <p>
            {APP_NAME} là một nền tảng công nghệ cung cấp công cụ dịch thuật dựa trên trí tuệ nhân tạo (AI). 
            Chúng tôi <strong>không phải</strong> là nhà xuất bản nội dung và <strong>không</strong> cung cấp bất kỳ nội dung truyện, sách hay văn bản có bản quyền nào trong kho dữ liệu công khai của mình.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            2. Trách nhiệm của người dùng
          </h2>
          <p>
            Người dùng tự chịu trách nhiệm hoàn toàn đối với các nội dung văn bản mà mình tải lên hệ thống. 
            Việc sử dụng công cụ để dịch thuật các tác phẩm có bản quyền mà không được phép của chủ sở hữu là hành vi vi phạm điều khoản của chúng tôi. 
            Người dùng phải tự đảm bảo mình có quyền hợp pháp đối với nội dung đó trước khi thực hiện các thao tác trên công cụ.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            3. Độ chính xác của bản dịch
          </h2>
          <p>
            Kết quả dịch thuật được tạo ra tự động bởi trí tuệ nhân tạo. Mặc dù chúng tôi luôn nỗ lực tối ưu hóa thuật toán, 
            {APP_NAME} không đảm bảo tính chính xác tuyệt đối, sự trôi chảy hay phù hợp về mặt văn hóa của bản dịch. 
            Bản dịch chỉ mang tính chất tham khảo cho mục đích cá nhân.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            4. Vấn đề bản quyền
          </h2>
          <p>
            Chúng tôi tôn trọng quyền sở hữu trí tuệ. Nếu có bất kỳ vấn đề nào liên quan đến việc sử dụng công cụ trái phép 
            hoặc xâm phạm bản quyền thông qua nền tảng của chúng tôi, vui lòng liên hệ ngay qua email hacthachtruyen@gmail.com để được hỗ trợ xử lý.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            5. Thiệt hại và Mất mát
          </h2>
          <p>
            Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất tài chính, dữ liệu hoặc các thiệt hại gián tiếp nào phát sinh 
            từ việc sử dụng hoặc không thể sử dụng công cụ của chúng tôi.
          </p>
        </section>
      </div>
    </main>
  );
}
