"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  href: string;
}

interface UserNavigationMenuProps {
  isMobile?: boolean;
}

export const UserNavigationMenu = ({ isMobile = false }: UserNavigationMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
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
    {
      id: "thong-tin",
      label: "Thông tin cá nhân",
      href: "/tai-khoan/thong-tin",
    },
    { id: "cai-dat", label: "Cài đặt", href: "/tai-khoan/cai-dat" },
    { id: "dang-xuat", label: "Đăng xuất", href: "#" },
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.id === "dang-xuat") {
      console.log("Logout clicked");
    } else {
      router.push(item.href);
    }
  };

  return (
    <nav
      className={cn(
        "h-full w-[270px] px-0 py-5 bg-cover bg-center z-40 flex flex-col gap-10 items-center transition-all",
        !isMobile && "fixed top-0 left-0 border-r border-border-default/30",
        isMobile && "relative w-full"
      )}
      style={{ backgroundImage: "url(/sidebar-user.png)" }}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={80}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      <div className="gap-2.5 pl-2.5 pr-0 py-0 w-full flex flex-col relative self-stretch">
        <ul
          className="flex-col items-start gap-2 flex-1 grow flex relative"
          role="menu"
        >
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.id === "ban-lam-viec" && pathname === "/user");

            return (
              <li
                key={item.id}
                className="items-start gap-1 self-stretch w-full flex-[0_0_auto] flex relative"
                role="none"
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "items-center gap-1 px-3 py-2 flex-1 grow flex w-full justify-start rounded-none h-auto transition-all",
                    isActive
                      ? "bg-surface-overlay-alpha border-r-[6px] border-accent-red"
                      : "bg-surface-overlay-alpha hover:bg-foreground/10"
                  )}
                  onClick={() => handleMenuItemClick(item)}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "font-inter font-normal text-xl tracking-[0] leading-[normal] truncate",
                      isActive ? "text-accent-red" : "text-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
