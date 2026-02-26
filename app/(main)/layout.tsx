import { HomeHeader } from "@/components/layout/HomeHeader";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App";

export const metadata: Metadata = {
  title: `${APP_NAME} - Trang chủ`,
  description: `Đọc truyện online miễn phí với hàng ngàn đầu sách thuộc mọi thể loại. Cập nhật chương mới nhanh chóng và trải nghiệm đọc mượt mà trên ${APP_NAME}.`,
};

export default function RootMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <div className="bg-[var(--color-surface-user-account-bg)] flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
