"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  UserCircle, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { logout } from "@/app/actions/auth";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
}

interface UserNavigationMenuProps {
  isMobile?: boolean;
}

export const UserNavigationMenu = ({
  isMobile = false,
}: UserNavigationMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const menuItems: MenuItem[] = [
    {
      id: "ban-lam-viec",
      label: "Bàn làm việc",
      href: "/tai-khoan/ban-lam-viec",
      icon: LayoutDashboard
    },
    { 
      id: "nap-tien", 
      label: "Nạp tiền", 
      href: "/tai-khoan/nap-tien",
      icon: Wallet
    },
    {
      id: "lich-su-giao-dich",
      label: "Lịch sử giao dịch",
      href: "/tai-khoan/lich-su-giao-dich",
      icon: History
    },
    {
      id: "thong-tin",
      label: "Thông tin cá nhân",
      href: "/tai-khoan/thong-tin",
      icon: UserCircle
    },
    { 
      id: "cai-dat", 
      label: "Cài đặt", 
      href: "/tai-khoan/cai-dat",
      icon: Settings
    },
  ];

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      await logout();
    }
  };

  const logoSrc = theme === "dark" ? "/logo.png" : "/logo-light.png";

  return (
    <nav
      className={cn(
        "h-full w-[280px] bg-surface-card z-40 flex flex-col transition-all duration-500",
        !isMobile && "fixed top-0 left-0 border-r border-border-default shadow-sm",
        isMobile && "relative w-full border-none shadow-none",
      )}
      aria-label="User navigation"
    >
      {/* Logo Section */}
      <div className="p-8 flex items-center justify-center border-b border-border-default/50 bg-surface-raised/30">
        <Link href="/trang-chu">
          <Image
            src={logoSrc}
            alt="Logo"
            width={180}
            height={60}
            style={{ objectFit: "contain" }}
            priority
            className="hover:scale-105 transition-transform"
          />
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <p className="px-4 mb-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Menu chính</p>
        <ul className="space-y-1" role="menu">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.id} role="none">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-12 px-4 rounded-xl font-bold transition-all group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-text-secondary hover:bg-primary/10 hover:text-primary",
                  )}
                  onClick={() => router.push(item.href)}
                  role="menuitem"
                >
                  <item.icon size={20} className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-text-muted group-hover:text-primary")} />
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout Section */}
      <div className="p-4 mt-auto border-t border-border-default/50 bg-surface-raised/20">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 px-4 rounded-xl font-bold text-destructive hover:bg-destructive/10 hover:text-destructive group transition-all"
          onClick={handleLogout}
        >
          <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
          <span>Đăng xuất</span>
        </Button>
      </div>
    </nav>
  );
};

import Link from "next/link";
