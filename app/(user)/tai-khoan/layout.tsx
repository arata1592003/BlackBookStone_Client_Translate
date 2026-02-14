import { UserHeader } from "@/components/features/user/UserHeader";
import { UserNavigationMenu } from "@/components/features/user/UserNavigationMenu";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hắc Thạch Thôn - Tài Khoản",
  description:
    "Quản lý thông tin tài khoản, truyện đã đăng, lịch sử giao dịch và cài đặt của bạn trên Hắc Thạch Thôn.",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full relative bg-black">
      <UserNavigationMenu />
      <div className="flex flex-col flex-1 ml-[270px]">
        {" "}
        <UserHeader />
        <main className="flex-1 flex flex-col"> {children}</main>
      </div>
    </div>
  );
}
