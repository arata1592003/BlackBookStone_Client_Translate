"use client";

import Image from "next/image";
import { useState } from "react";

export const HomeHeader = () => {
  const [q, setQ] = useState("");

  return (
    <header className="bg-black text-white">
      {/* Top */}
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
            <button className="px-3 py-1.5 rounded bg-white/20 text-sm">
              Đăng nhập
            </button>
            <button className="px-3 py-1.5 rounded bg-white/20 text-sm">
              Đăng ký
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="w-full lg:max-w-[360px]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm..."
            className="
              w-full
              px-4 py-2
              rounded
              text-black
              bg-white
            "
          />
        </div>

        {/* Desktop auth */}
        <div className="hidden lg:flex gap-3">
          <button className="px-4 py-2 rounded bg-white/20">
            Đăng nhập
          </button>
          <button className="px-4 py-2 rounded bg-white/20">
            Đăng ký
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav
        className="
          flex gap-6
          overflow-x-auto
          px-3 py-2
          sm:px-4
          lg:px-8
          xl:px-32
          border-t border-b border-white/20
          text-sm sm:text-base
        "
      >
        <span className="whitespace-nowrap">Thể loại</span>
        <span className="whitespace-nowrap">Sắp xếp</span>
        <span className="whitespace-nowrap">Trạng thái</span>
      </nav>
    </header>
  );
};
