'use client';

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAllTags } from "@/modules/tag/tag.service";
import { Tag } from "@/modules/tag/tag.type";
import { getCurrentUser } from "@/modules/user/user.service";
import { User } from "@/modules/user/user.type";

interface MenuItem {
  id: string;
  label: string;
  href: string;
}

export const UserNavigationMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [tags, setTags] = useState<Tag[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const fetchedTags = await getAllTags();
        setTags(fetchedTags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }

      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  const menuItems: MenuItem[] = [
    { id: "ban-lam-viec", label: "Bàn làm việc", href: "/tai-khoan/ban-lam-viec" },
    { id: "tu-truyen", label: "Tủ truyện", href: "/tai-khoan/tu-truyen" },
    { id: "nap-tien", label: "Nạp tiền", href: "/tai-khoan/nap-tien" },
    { id: "lich-su-giao-dich", label: "Lịch sử giao dịch", href: "/tai-khoan/lich-su-giao-dich" },
    { id: "cai-dat", label: "Cài đặt", href: "/tai-khoan/cai-dat" },
    { id: "dang-xuat", label: "Đăng xuất", href: "#" },
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.id === "dang-xuat") {
      console.log("Logout clicked from navigation menu");
    } else {
      router.push(item.href);
    }
    console.log(`Navigating to: ${item.href}`);
  };

  const handleMenuItemKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    item: MenuItem,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleMenuItemClick(item);
      console.log(`Navigating to (keyboard): ${item.href}`);
    }
  };

  return (
    <nav
      className="flex-col gap-10 w-[270px] px-0 py-5 bg-cover bg-center flex items-center"
      style={{ backgroundImage: "url(/sidebar-user.png)" }}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Hắc Thạch Thôn Logo"
          width={228}
          height={90}
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
            const isActive = pathname === item.href || (item.id === "ban-lam-viec" && pathname === "/user");

            return (
              <li
                key={item.id}
                className="items-start gap-1 self-stretch w-full flex-[0_0_auto] flex relative"
                role="none"
              >
                <Button
                  variant="ghost"
                  className={`items-center gap-1 px-3 py-2 flex-1 grow flex w-full justify-start rounded-none h-auto ${
                    isActive
                      ? "bg-surface-overlay-alpha border-r-[6px] [border-right-style:solid] border-accent-red"
                      : "bg-surface-overlay-alpha hover:bg-white/10"
                  }`}
                  onClick={() => handleMenuItemClick(item)}
                  onKeyDown={(e) => handleMenuItemKeyDown(e, item)}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={`${
                      isActive
                        ? "w-fit mt-[-6.00px] text-accent-red"
                        : "relative self-stretch mt-[-1.00px] text-white"
                    } font-inter font-normal text-2xl tracking-[0] leading-[normal]`}
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
