"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAllTags } from "@/modules/tag/tag.service";
import { Tag } from "@/modules/tag/tag.type";
import { getCurrentUser } from "@/modules/user/user.service"; // New import
import { User } from "@/modules/user/user.type"; // New import

export const HomeHeader = () => {
  const [q, setQ] = useState("");
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // New state for current user

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch tags
      try {
        const fetchedTags = await getAllTags();
        setTags(fetchedTags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }

      // Fetch current user
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    fetchInitialData();
  }, []); // Run once on mount

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <header className="bg-black text-white">
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
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={50}
            className="h-auto w-auto max-w-[140px] sm:max-w-[160px]"
          />

          {/* Mobile auth */}
          <div className="flex gap-2 lg:hidden">
            {currentUser ? (
              <span className="text-sm font-medium">{currentUser.fullName}</span>
              // TODO: Add Logout button here
            ) : (
              <>
                <button
                  className="px-3 py-1.5 rounded bg-white/20 text-sm"
                  onClick={handleLoginClick}
                >
                  Đăng nhập
                </button>
                <button
                  className="px-3 py-1.5 rounded bg-white/20 text-sm"
                  onClick={handleRegisterClick}
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="w-full lg:max-w-[360px]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full px-4 py-2 rounded text-black bg-white"
          />
        </div>

        {/* Desktop auth */}
        <div className="hidden lg:flex gap-3">
          {currentUser ? (
            <span className="text-base font-medium">{currentUser.fullName}</span>
            // TODO: Add Logout button here
          ) : (
            <>
              <button
                className="px-4 py-2 rounded bg-white/20"
                onClick={handleLoginClick}
              >
                Đăng nhập
              </button>
              <button
                className="px-4 py-2 rounded bg-white/20"
                onClick={handleRegisterClick}
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
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
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <span
              className="whitespace-nowrap cursor-pointer"
              onClick={() => setIsDropdownOpen((v) => !v)} // hỗ trợ mobile
            >
              Thể loại
            </span>

            {isDropdownOpen && tags.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
                <ul className="py-1 text-gray-700 max-h-96 overflow-y-auto">
                  {tags.map((tag) => (
                    <li key={tag.id}>
                      <Link
                        href={`/the-loai/${tag.name}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {tag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <span className="whitespace-nowrap cursor-pointer">Sắp xếp</span>
          <span className="whitespace-nowrap cursor-pointer">Trạng thái</span>
        </div>
      </nav>
    </header>
  );
};
