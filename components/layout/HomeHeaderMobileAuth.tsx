"use client";

import { Button } from "@/components/ui/button";
import { UserProfile } from "@/modules/user/user.type";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

interface HomeHeaderMobileAuthProps {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  isProfileLoading: boolean;
  handleLoginClick: () => void;
  handleRegisterClick: () => void;
  handleLogout: () => Promise<void>;
  isUserDropdownOpen: boolean;
  setIsUserDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userDropdownRef: any; 
  userMenuItems: { id: string; label: string; href: string; icon: React.ElementType }[];
}

export const HomeHeaderMobileAuth: React.FC<HomeHeaderMobileAuthProps> = ({
  isAuthenticated,
  userProfile,
  isProfileLoading,
  handleLoginClick,
  handleRegisterClick,
  handleLogout,
  userMenuItems,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderUserButtonContent = () => {
    if (isProfileLoading) {
      return <span className="w-20 h-5 bg-foreground/30 animate-pulse rounded-md" />;
    }
    if (userProfile) {
      return (
        <div className="flex items-center gap-2">
          <User size={14} className="text-primary" />
          <span>{userProfile.full_name || "Tài khoản"}</span>
        </div>
      );
    }
    return "Tài khoản";
  };

  // Tránh Hydration mismatch bằng cách không render Dropdown cho đến khi client-side sẵn sàng
  if (!mounted) {
    return <div className="flex gap-2 lg:hidden h-9" />; 
  }

  return (
    <div className="flex gap-2 lg:hidden">
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="px-3 py-1.5 rounded-lg bg-foreground/10 text-sm font-bold"
              disabled={isProfileLoading}
            >
              {renderUserButtonContent()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-surface-card border-border-default rounded-xl shadow-xl" align="end">
            {userMenuItems.map((item) => (
              <DropdownMenuItem key={item.id} asChild className="cursor-pointer rounded-lg focus:bg-primary/10 py-2.5">
                <Link href={item.href} className="w-full flex items-center gap-3">
                  <item.icon className="h-4 w-4 opacity-70" />
                  <span className="font-bold text-sm">{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-border-default/50" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer rounded-lg focus:bg-destructive/10 text-destructive focus:text-destructive py-2.5 font-bold text-sm"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1.5 rounded-lg bg-foreground/10 text-xs font-bold"
            onClick={handleLoginClick}
          >
            Đăng nhập
          </Button>
          <Button
            size="sm"
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-black shadow-md shadow-primary/10"
            onClick={handleRegisterClick}
          >
            Đăng ký
          </Button>
        </>
      )}
    </div>
  );
};
