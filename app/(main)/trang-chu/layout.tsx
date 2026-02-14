import { HomeHeader } from "@/components/layout/HomeHeader";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hắc Thạch Thôn - Trang chủ",
  description: "Đọc truyện online miễn phí với hàng ngàn đầu sách thuộc mọi thể loại. Cập nhật chương mới nhanh chóng và trải nghiệm đọc mượt mà trên Hắc Thạch Thôn.",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HomeHeader />
      {children}
    </>
  );
}
