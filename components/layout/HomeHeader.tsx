"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { logout } from "@/app/actions/auth"; // Dùng Server Action để logout
import { getAllTags } from "@/modules/tag/tag.service";
import { Tag } from "@/modules/tag/tag.type";

import { useAuth } from "../providers/AuthProvider";
import { HomeHeaderDesktopAuth } from "./HomeHeaderDesktopAuth";
import { HomeHeaderMobileAuth } from "./HomeHeaderMobileAuth";
import { HomeHeaderTagsDropdown } from "./HomeHeaderTagsDropdown";

export const HomeHeader = () => {
  const router = useRouter();
  // Lấy tất cả thông tin cần thiết từ AuthProvider
  const { user, userProfile, isProfileLoading, isAuthenticated } = useAuth();

  const [tags, setTags] = useState<Tag[]>([]);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Chỉ fetch dữ liệu không phụ thuộc vào user
  useEffect(() => {
    getAllTags().then(setTags).catch(error => console.error("Failed to fetch tags:", error));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownRef]);

  const handleLoginClick = () => {
    router.push("/dang-nhap");
  };

  const handleRegisterClick = () => {
    router.push("/dang-ky");
  };

  const handleLogout = async () => {
    await logout(); // Gọi server action
  };

  const userMenuItems = [
    {
      id: "ban-lam-viec",
      label: "Bàn làm việc",
      href: "/tai-khoan/ban-lam-viec",
    },
    { id: "tu-truyen", label: "Tủ truyện", href: "/tai-khoan/tu-truyen" },
    { id: "nap-tien", label: "Nạp tiền", href: "/tai-khoan/nap-tien" },
    {
      id: "lich-su-giao-dich",
      label: "Lịch sử giao dịch",
      href: "/tai-khoan/lich-su-giao-dich",
    },
    { id: "cai-dat", label: "Cài đặt", href: "/tai-khoan/cai-dat" },
  ];

  return (
    <header className="bg-[url('/sidebar-user.png')] bg-cover bg-center text-white">
      {/* ================= TOP ================= */}
      <div
        className="
          flex flex-col gap-3
          px-3 py-3
          sm:px-4
          lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-4
          xl:px-32
        "
      >
        {/* Logo */}
        <div className="flex items-center justify-between self-stretch">
          <Link href="/trang-chu">
            <Image
              src="/logo.png"
              alt="Logo"
              width={160}
              height={50}
              className="h-auto w-auto max-w-[140px] sm:max-w-[160px] cursor-pointer"
            />
          </Link>
          <HomeHeaderMobileAuth
            isAuthenticated={isAuthenticated}
            userProfile={userProfile}
            isProfileLoading={isProfileLoading}
            handleLoginClick={handleLoginClick}
            handleRegisterClick={handleRegisterClick}
            handleLogout={handleLogout}
            isUserDropdownOpen={isUserDropdownOpen}
            setIsUserDropdownOpen={setIsUserDropdownOpen}
            userDropdownRef={userDropdownRef}
            userMenuItems={userMenuItems}
          />
        </div>

        {/* Search */}
        <div className="w-full lg:max-w-[360px]">
          <input
            placeholder="Tìm kiếm..."
            className="w-full px-4 py-2 rounded text-black bg-white"
          />
        </div>

        {/* Desktop auth */}
        <HomeHeaderDesktopAuth
          isAuthenticated={isAuthenticated}
          userProfile={userProfile}
          isProfileLoading={isProfileLoading}
          handleLoginClick={handleLoginClick}
          handleRegisterClick={handleRegisterClick}
          handleLogout={handleLogout}
          isUserDropdownOpen={isUserDropdownOpen}
          setIsUserDropdownOpen={setIsUserDropdownOpen}
          userDropdownRef={userDropdownRef}
          userMenuItems={userMenuItems}
        />
      </div>

      {/* ================= NAV ================= */}
      <nav className="relative border-t border-b border-white/20">
        <div
          className="
            flex gap-6
            overflow-x-auto
            px-3 py-2
            sm:px-4
            lg:px-8
            xl:px-32
            text-sm sm:text-base
          "
        >
          <HomeHeaderTagsDropdown
            tags={tags}
            isTagsDropdownOpen={isTagsDropdownOpen}
            setIsTagsDropdownOpen={setIsTagsDropdownOpen}
          />

          <span className="whitespace-nowrap cursor-pointer">Sắp xếp</span>
          <span className="whitespace-nowrap cursor-pointer">Trạng thái</span>
        </div>
      </nav>
    </header>
  );
};
