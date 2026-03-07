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
import { LogOut, User, Wallet } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface HomeHeaderDesktopAuthProps {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  walletBalance: number;
  isProfileLoading: boolean;
  handleLoginClick: () => void;
  handleRegisterClick: () => void;
  handleLogout: () => Promise<void>;
  isUserDropdownOpen: boolean;
  setIsUserDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userDropdownRef: any; 
  userMenuItems: { id: string; label: string; href: string; icon: React.ElementType }[];
}

export const HomeHeaderDesktopAuth: React.FC<HomeHeaderDesktopAuthProps> = ({
  isAuthenticated,
  userProfile,
  walletBalance,
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
      return <span className="w-24 h-6 bg-foreground/30 animate-pulse rounded-md" />;
    }
    if (userProfile) {
      return (
        <div className="flex items-center gap-2">
          <User size={18} className="text-primary" />
          <span>{userProfile.full_name || "Tài khoản"}</span>
        </div>
      );
    }
    return "Tài khoản";
  };

  if (!mounted) {
    return <div className="hidden lg:flex gap-2 min-w-[180px] h-10" />;
  }

  return (
    <div className="hidden lg:flex gap-4 items-center">
      {isAuthenticated && (
        <Link 
          href="/tai-khoan/nap-tien"
          className="flex items-center gap-2 px-4 py-2 bg-success/10 hover:bg-success/20 text-success rounded-xl border border-success/20 transition-all group"
        >
          <Wallet size={16} className="group-hover:scale-110 transition-transform" />
          <span className="font-black text-sm">{formatNumber(walletBalance)} <span className="text-[10px] uppercase opacity-70">Credit</span></span>
        </Link>
      )}

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="px-5 py-2.5 rounded-xl bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold transition-all border border-white/5 shadow-sm"
              disabled={isProfileLoading}
            >
              {renderUserButtonContent()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-surface-card border-border-default p-2 rounded-2xl shadow-2xl" align="end">
            <div className="px-3 py-3 border-b border-border-default/50 mb-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Quản lý tài khoản</p>
            </div>
            {userMenuItems.map((item) => (
              <DropdownMenuItem key={item.id} asChild className="cursor-pointer rounded-xl focus:bg-primary/10 focus:text-primary transition-colors py-2.5 px-3">
                <Link href={item.href} className="w-full flex items-center gap-3">
                  <item.icon className="h-4 w-4 opacity-70" />
                  <span className="font-bold text-sm">{item.label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-border-default/50 my-1" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer rounded-xl focus:bg-destructive/10 text-destructive focus:text-destructive py-2.5 px-3 font-bold text-sm"
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
            className="px-6 h-11 rounded-xl bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold transition-all"
            onClick={handleLoginClick}
          >
            Đăng nhập
          </Button>
          <Button
            className="px-6 h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-lg shadow-primary/20 transition-all"
            onClick={handleRegisterClick}
          >
            Đăng ký
          </Button>
        </>
      )}
    </div>
  );
};
