import { UserHeader } from "@/components/features/user/UserHeader";
import { UserNavigationMenu } from "@/components/features/user/UserNavigationMenu";
import React from "react";
import type { Metadata } from "next";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App";

export const metadata: Metadata = {
  title: `${APP_NAME} - Tài Khoản`,
  description: `Quản lý thông tin tài khoản, truyện đã đăng, lịch sử giao dịch và cài đặt của bạn trên ${APP_NAME}.`,
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full relative bg-[var(--color-surface-user-account-bg)]">
      <UserNavigationMenu />
      <div className="flex flex-col flex-1 ml-[270px]">
        {" "}
        <UserHeader />
        <main className="flex-1 flex flex-col"> {children}</main>
      </div>
    </div>
  );
}
