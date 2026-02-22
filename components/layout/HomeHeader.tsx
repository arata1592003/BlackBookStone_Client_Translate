"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { logout } from "@/app/actions/auth";
import { getAllTags } from "@/modules/tag/tag.service";
import { Tag } from "@/modules/tag/tag.type";

import { useAuth } from "../providers/AuthProvider";
import { HomeHeaderDesktopAuth } from "./HomeHeaderDesktopAuth";
import { HomeHeaderMobileAuth } from "./HomeHeaderMobileAuth";
import { HomeHeaderTagsDropdown } from "./HomeHeaderTagsDropdown";

import { Search } from "lucide-react"; // Add this import

export const HomeHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get searchParams
  const { userProfile, isProfileLoading, isAuthenticated } = useAuth();

  const [tags, setTags] = useState<Tag[]>([]);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || ""); // Initialize with URL query

  useEffect(() => {
    getAllTags()
      .then(setTags)
      .catch((error) => console.error("Failed to fetch tags:", error));
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== searchQuery) {
      setSearchQuery(q || "");
    }
  }, [searchParams]);

  const handleLoginClick = () => {
    router.push("/dang-nhap");
  };

  const handleRegisterClick = () => {
    router.push("/dang-ky");
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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
    <header className="bg-[url('/sidebar-user.png')] bg-cover bg-center text-foreground">
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
            isUserDropdownOpen={false}
            setIsUserDropdownOpen={() => {}}
            userDropdownRef={userDropdownRef}
            userMenuItems={userMenuItems}
          />
        </div>

        {/* Search */}
        <div className="w-full lg:max-w-[360px]">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <input
              type="search"
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-2 rounded text-foreground bg-background pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-foreground"
              aria-label="Tìm kiếm"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Desktop auth */}
        <HomeHeaderDesktopAuth
          isAuthenticated={isAuthenticated}
          userProfile={userProfile}
          isProfileLoading={isProfileLoading}
          handleLoginClick={handleLoginClick}
          handleRegisterClick={handleRegisterClick}
          handleLogout={handleLogout}
          isUserDropdownOpen={false}
          setIsUserDropdownOpen={() => {}}
          userDropdownRef={userDropdownRef}
          userMenuItems={userMenuItems}
        />
      </div>

      {/* ================= NAV ================= */}
      <nav className="relative border-t border-b border-border-default/50 overflow-visible">
        <div
          className="
            flex gap-6
            px-3 py-2
            sm:px-4
            lg:px-8
            xl:px-32
            text-sm sm:text-base
          "
        >
          <HomeHeaderTagsDropdown
            tags={tags}
            isTagsDropdownOpen={false}
            setIsTagsDropdownOpen={() => {}}
          />

          <span className="whitespace-nowrap cursor-pointer">Sắp xếp</span>
          <span className="whitespace-nowrap cursor-pointer">Trạng thái</span>
        </div>
      </nav>
    </header>
  );
};
