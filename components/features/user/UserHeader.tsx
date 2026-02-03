"use client";

import Image from "next/image";
import Link from "next/link"; // Import Link
import { Home } from "lucide-react"; // Import Home icon
import { useAuth } from "@/components/providers/AuthProvider"; // Import useAuth

export const UserHeader = () => {
  const { userProfile } = useAuth(); // Sử dụng useAuth để lấy userProfile

  return (
    <header className="flex flex-col items-start self-stretch w-full relative flex-[0_0_auto]">
      <div className="flex items-center justify-between p-5 relative self-stretch w-full flex-[0_0_auto] bg-surface-overlay">
        {/* Logo và Beta 1.0 (Bên trái) */}
        <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
          <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
            <Image
              className="relative object-cover"
              alt="Logo icon"
              src="/icon-logo-540x540.png"
              width={32}
              height={32}
            />
            <h1 className="relative flex items-center justify-center w-fit font-roboto font-medium text-white text-2xl tracking-[0.10px] leading-6 whitespace-nowrap">
              Hắc Thạch Thôn
            </h1>
          </div>
          <span className="relative flex items-center justify-center w-fit font-roboto font-medium text-text-faint text-xs tracking-[0.10px] leading-4 whitespace-nowrap">
            Beta 1.0
          </span>
        </div>

        {/* Tên người dùng và nút Home (Bên phải) */}
        <div className="inline-flex items-center gap-4 relative flex-[0_0_auto]">
          <span className="relative flex items-center justify-center w-fit font-roboto font-medium text-white text-xl tracking-[0.10px] leading-6 whitespace-nowrap">
            {userProfile?.first_name || userProfile?.last_name || "Người dùng"}
          </span>
          <Link href="/trang-chu" className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors">
            <Home className="text-white" size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
};
