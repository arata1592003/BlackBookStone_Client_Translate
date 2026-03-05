"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { logout } from "@/app/actions/auth";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { HomeHeaderDesktopAuth } from "./HomeHeaderDesktopAuth";
import { HomeHeaderMobileAuth } from "./HomeHeaderMobileAuth";
import { ThemeToggle } from "../ui/theme-toggle";

export const HomeHeader = () => {
  const router = useRouter();
  const { userProfile, isProfileLoading, isAuthenticated } = useAuth();
  const { appName, logoSrc } = useTheme();

  const userDropdownRef = useRef<HTMLDivElement>(null);

  const userMenuItems = [
    { id: "ban-lam-viec", label: "Bàn làm việc", href: "/tai-khoan/ban-lam-viec" },
    { id: "tu-truyen", label: "Tủ truyện", href: "/tai-khoan/tu-truyen" },
    { id: "nap-tien", label: "Nạp tiền", href: "/tai-khoan/nap-tien" },
    { id: "lich-su-giao-dich", label: "Lịch sử giao dịch", href: "/tai-khoan/lich-su-giao-dich" },
    { id: "cai-dat", label: "Cài đặt", href: "/tai-khoan/cai-dat" },
  ];

  return (
    <header className="bg-[var(--image-header-bg)] bg-cover bg-center text-foreground shadow-md transition-all duration-500" style={{ backgroundImage: "var(--image-header-bg)" }}>
      {/* ================= TOP ================= */}
      <div className="flex items-center justify-between px-3 py-3 sm:px-4 lg:px-8 lg:py-4 xl:px-32">
        {/* Logo */}
        <Link href="/trang-chu">
          <Image
            src={logoSrc}
            alt={appName}
            width={160}
            height={50}
            className="h-auto w-auto max-w-[140px] sm:max-w-[160px] cursor-pointer"
            priority
          />
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* Mobile Auth */}
          <div className="lg:hidden">
            <HomeHeaderMobileAuth
              isAuthenticated={isAuthenticated}
              userProfile={userProfile}
              isProfileLoading={isProfileLoading}
              handleLoginClick={() => router.push("/dang-nhap")}
              handleRegisterClick={() => router.push("/dang-ky")}
              handleLogout={async () => { await logout(); }}
              isUserDropdownOpen={false}
              setIsUserDropdownOpen={() => {}}
              userDropdownRef={userDropdownRef}
              userMenuItems={userMenuItems}
            />
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:block">
            <HomeHeaderDesktopAuth
              isAuthenticated={isAuthenticated}
              userProfile={userProfile}
              isProfileLoading={isProfileLoading}
              handleLoginClick={() => router.push("/dang-nhap")}
              handleRegisterClick={() => router.push("/dang-ky")}
              handleLogout={async () => { await logout(); }}
              isUserDropdownOpen={false}
              setIsUserDropdownOpen={() => {}}
              userDropdownRef={userDropdownRef}
              userMenuItems={userMenuItems}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
