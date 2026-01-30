'use client';

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"; // Removed useSearchParams
import { useEffect, useState } from "react";

import { getAllTags } from "@/modules/tag/tag.service";
import { Tag } from "@/modules/tag/tag.type";
import { getCurrentUser } from "@/modules/user/user.service";
import { User } from "@/modules/user/user.type";

interface MenuItem { // Moved MenuItem interface here to match new structure
  id: string;
  label: string;
  href: string; // Added href
}

export const UserNavigationMenu = () => {
  const router = useRouter();
  const pathname = usePathname(); // Hook to get current path

  const [tags, setTags] = useState<Tag[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
    { id: "dang-xuat", label: "Đăng xuất", href: "#" }, // '#' for logout action
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.id === "dang-xuat") {
      // Handle logout logic if needed, or pass it as a prop
      console.log("Logout clicked from navigation menu");
      // router.push("/"); // Example redirect after logout
    } else {
      router.push(item.href); // Navigate to new path
    }
    console.log(`Navigating to: ${item.href}`);
  };

  const handleMenuItemKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    item: MenuItem,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleMenuItemClick(item); // Use existing click handler
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
            const isActive = pathname === item.href || (item.id === "ban-lam-viec" && pathname === "/user"); // Handle default /user path

            return (
              <li
                key={item.id}
                className="items-start gap-1 self-stretch w-full flex-[0_0_auto] flex relative"
                role="none"
              >
                <button
                  className={`items-center gap-1 px-3 py-2 flex-1 grow flex relative w-full text-left: ${
                    isActive
                      ? "bg-[#0d0d0d1a] border-r-[6px] [border-right-style:solid] border-[#e63946]"
                      : "bg-[#0d0d0d1a] hover:bg-white/10"
                  }`}
                  onClick={() => handleMenuItemClick(item)}
                  onKeyDown={(e) => handleMenuItemKeyDown(e, item)}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={`${
                      isActive
                        ? "w-fit mt-[-6.00px] text-[#e63946]"
                        : "relative self-stretch mt-[-1.00px] text-white"
                    } [font-family:'Inter-Regular',Helvetica] font-normal text-2xl tracking-[0] leading-[normal]`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
