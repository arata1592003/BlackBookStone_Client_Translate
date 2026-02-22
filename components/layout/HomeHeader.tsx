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

import { 
  Search, 
  ListFilter, 
  LayoutGrid, 
  Zap, 
  Flame, 
  CheckCircle2 
} from "lucide-react";

export const HomeHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userProfile, isProfileLoading, isAuthenticated } = useAuth();

  const [tags, setTags] = useState<Tag[]>([]);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");

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
    e.preventDefault();
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
    <header className="bg-[url('/sidebar-user.png')] bg-cover bg-center text-foreground shadow-md">
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
              placeholder="Tìm kiếm truyện, tác giả..."
              className="w-full px-4 py-2 rounded-full text-foreground bg-background/80 focus:bg-background border border-border-default/50 pr-10 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-text-muted hover:text-primary transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search size={18} />
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
      <nav className="relative border-t border-border-default/20 bg-surface-base/30 backdrop-blur-md">
        <div
          className="
            flex items-center gap-6 md:gap-8
            px-4 py-3
            sm:px-6
            lg:px-8
            xl:px-32
            text-sm md:text-base
            overflow-x-auto no-scrollbar
          "
        >
          {/* Tags Dropdown Section */}
          <div className="flex items-center gap-2 shrink-0 border-r border-border-default/30 pr-6 mr-2">
            <HomeHeaderTagsDropdown
              tags={tags}
              isTagsDropdownOpen={false}
              setIsTagsDropdownOpen={() => {}}
            />
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/truyen-moi" className="flex items-center gap-1.5 whitespace-nowrap text-text-secondary hover:text-primary-accent transition-colors group">
              <Zap size={16} className="text-text-muted group-hover:text-primary-accent" />
              <span className="font-medium">Mới cập nhật</span>
            </Link>

            <Link href="/truyen-hot" className="flex items-center gap-1.5 whitespace-nowrap text-text-secondary hover:text-primary-accent transition-colors group">
              <Flame size={16} className="text-text-muted group-hover:text-primary-accent" />
              <span className="font-medium">Truyện Hot</span>
            </Link>

            <Link href="/truyen-full" className="flex items-center gap-1.5 whitespace-nowrap text-text-secondary hover:text-primary-accent transition-colors group">
              <CheckCircle2 size={16} className="text-text-muted group-hover:text-primary-accent" />
              <span className="font-medium">Hoàn thành</span>
            </Link>

            <div className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-text-secondary hover:text-primary-accent transition-colors group">
              <ListFilter size={16} className="text-text-muted group-hover:text-primary-accent" />
              <span className="font-medium">Sắp xếp</span>
            </div>

            <div className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-text-secondary hover:text-primary-accent transition-colors group">
              <LayoutGrid size={16} className="text-text-muted group-hover:text-primary-accent" />
              <span className="font-medium">Trạng thái</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
