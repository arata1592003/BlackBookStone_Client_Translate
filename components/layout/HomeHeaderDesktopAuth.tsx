"use client";

import { Button } from "@/components/ui/button";
import { UserProfile } from "@/modules/user/user.type";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

interface HomeHeaderDesktopAuthProps {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  isProfileLoading: boolean;
  handleLoginClick: () => void;
  handleRegisterClick: () => void;
  handleLogout: () => Promise<void>;
  isUserDropdownOpen: boolean;
  setIsUserDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userDropdownRef: any; // Not used with Shadcn Dropdown
  userMenuItems: { id: string; label: string; href: string }[];
}

export const HomeHeaderDesktopAuth: React.FC<HomeHeaderDesktopAuthProps> = ({
  isAuthenticated,
  userProfile,
  isProfileLoading,
  handleLoginClick,
  handleRegisterClick,
  handleLogout,
  userMenuItems,
}) => {
  const renderUserButtonContent = () => {
    if (isProfileLoading) {
      return <span className="w-24 h-6 bg-foreground/30 animate-pulse rounded-md" />;
    }
    if (userProfile) {
      return `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim();
    }
    return "Tài khoản";
  };

  return (
    <div className="hidden lg:flex items-center gap-3">
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="px-4 py-2 rounded bg-foreground/20 text-base font-medium"
              disabled={isProfileLoading}
            >
              {renderUserButtonContent()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-surface-card border-border-default" align="end">
            {userMenuItems.map((item) => (
              <DropdownMenuItem key={item.id} asChild className="cursor-pointer focus:bg-surface-hover">
                <Link href={item.href} className="w-full flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-border-default" />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer focus:bg-destructive/10 text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button
            variant="ghost"
            className="px-4 py-2 rounded bg-foreground/20"
            onClick={handleLoginClick}
          >
            Đăng nhập
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 rounded bg-foreground/20"
            onClick={handleRegisterClick}
          >
            Đăng ký
          </Button>
        </>
      )}
    </div>
  );
};
