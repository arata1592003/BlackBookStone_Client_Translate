"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Menu } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserNavigationMenu } from "./UserNavigationMenu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const UserHeader = () => {
  const { userProfile } = useAuth();
  const { appName, iconSrc } = useTheme();

  return (
    <header className="flex flex-col items-start self-stretch w-full relative flex-[0_0_auto]">
      <div className="flex items-center justify-between p-4 md:p-5 relative self-stretch w-full flex-[0_0_auto] bg-[var(--color-surface-overlay)] border-b border-border-default/50 lg:border-none transition-colors duration-500">
        
        {/* Mobile Menu Trigger & Logo */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[270px] bg-transparent border-none">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu quản lý</SheetTitle>
                </SheetHeader>
                <UserNavigationMenu isMobile />
              </SheetContent>
            </Sheet>
          </div>

          <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
            <Image
              className="relative object-cover"
              alt="Logo icon"
              src={iconSrc}
              width={32}
              height={32}
            />
            <h1 className="relative hidden sm:flex items-center justify-center w-fit font-roboto font-medium text-foreground text-xl md:text-2xl tracking-[0.10px] leading-6 whitespace-nowrap">
              {appName}
            </h1>
          </div>
          <span className="relative hidden xs:flex items-center justify-center w-fit font-roboto font-medium text-text-faint text-xs tracking-[0.10px] leading-4 whitespace-nowrap">
            Beta 1.0
          </span>
        </div>

        {/* Action Buttons & Profile */}
        <div className="inline-flex items-center gap-2 md:gap-4 relative flex-[0_0_auto]">
          <ThemeToggle />
          <span className="relative hidden md:flex items-center justify-center w-fit font-roboto font-medium text-foreground text-lg md:text-xl tracking-[0.10px] leading-6 whitespace-nowrap">
            {userProfile?.full_name || "Người dùng"}
          </span>
          <Link
            href="/trang-chu"
            className="flex items-center justify-center p-2 rounded-full hover:bg-foreground/10 transition-colors"
            title="Quay lại trang chủ"
          >
            <Home className="text-foreground" size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
};
