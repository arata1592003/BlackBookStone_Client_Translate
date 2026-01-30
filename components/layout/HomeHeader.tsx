"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { supabaseClient } from "@/lib/supabase/client";
import { getAllTags } from "@/modules/tag/tag.service";
import { Tag } from "@/modules/tag/tag.type";
import { getCurrentUser } from "@/modules/user/user.service";
import { User } from "@/modules/user/user.type";

import { HomeHeaderDesktopAuth } from "./HomeHeaderDesktopAuth"; // New import
import { HomeHeaderMobileAuth } from "./HomeHeaderMobileAuth"; // New import
import { HomeHeaderTagsDropdown } from "./HomeHeaderTagsDropdown"; // New import

export const HomeHeader = () => {
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const fetchedTags = await getAllTags();
        setTags(fetchedTags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }

      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
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
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        throw error;
      }
      setCurrentUser(null);
      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
      alert("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  const userMenuItems = [
    { id: "ban-lam-viec", label: "Bàn làm việc", href: "/tai-khoan/ban-lam-viec" },
    { id: "tu-truyen", label: "Tủ truyện", href: "/tai-khoan/tu-truyen" },
    { id: "nap-tien", label: "Nạp tiền", href: "/tai-khoan/nap-tien" },
    { id: "lich-su-giao-dich", label: "Lịch sử giao dịch", href: "/tai-khoan/lich-su-giao-dich" },
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
        <div className="flex items-center justify-between">
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
            currentUser={currentUser}
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
          currentUser={currentUser}
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
      {/* Quan trọng: nav này KHÔNG overflow */}
      <nav className="relative border-t border-b border-white/20">
        {/* Thanh menu có overflow riêng */}
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
          {/* Thể loại */}
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
