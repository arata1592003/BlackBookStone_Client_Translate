"use client";

import { Button } from "@/components/ui/Button";
import { User } from "@/modules/user/user.type";
import Link from "next/link";
import React, { RefObject } from "react";

interface HomeHeaderMobileAuthProps {
  currentUser: User | null;
  handleLoginClick: () => void;
  handleRegisterClick: () => void;
  handleLogout: () => Promise<void>;
  isUserDropdownOpen: boolean;
  setIsUserDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userDropdownRef: RefObject<HTMLDivElement>;
  userMenuItems: { id: string; label: string; href: string }[];
}

export const HomeHeaderMobileAuth: React.FC<HomeHeaderMobileAuthProps> = ({
  currentUser,
  handleLoginClick,
  handleRegisterClick,
  handleLogout,
  isUserDropdownOpen,
  setIsUserDropdownOpen,
  userDropdownRef,
  userMenuItems,
}) => {
  return (
    <div className="flex gap-2 lg:hidden">
      {currentUser ? (
        <div className="relative" ref={userDropdownRef}>
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1.5 rounded bg-white/20 text-sm font-medium"
            onClick={() => setIsUserDropdownOpen((prev) => !prev)}
          >
            {currentUser.fullName}
          </Button>
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <ul className="py-1 text-gray-700">
                {userMenuItems.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-none justify-start h-auto"
                  >
                    Đăng xuất
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1.5 rounded bg-white/20 text-sm"
            onClick={handleLoginClick}
          >
            Đăng nhập
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1.5 rounded bg-white/20 text-sm"
            onClick={handleRegisterClick}
          >
            Đăng ký
          </Button>
        </>
      )}
    </div>
  );
};
