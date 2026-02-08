"use client";

import { UserBookCard } from "@/components/features/user/UserBookCard";
import { UserStats } from "@/components/features/user/UserStats";
import { getOwnedBooksForCurrentUser } from "@/modules/book/book.service";
import { Button } from "@/components/ui/Button";
import { BookPlus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react"; // Import useEffect
import { useAuth } from "@/components/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { CheckCircle2 } from "lucide-react"; // Import CheckCircle2

const loupe1Path = "/icons8-search-50.png";

export default function BanLamViecPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams(); // Khởi tạo useSearchParams

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Kiểm tra query param khi component mount
  useEffect(() => {
    if (searchParams.get('addBookSuccess')) {
      setShowSuccessMessage(true);
      // Xóa query param khỏi URL để thông báo không xuất hiện lại khi refresh
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('addBookSuccess');
      router.replace(`?${newSearchParams.toString()}`, { shallow: true });

      // Tự động ẩn thông báo sau vài giây
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000); // Hiển thị 5 giây

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  // Khối useQuery và filteredBooks đã bị mất
  const { data: books, isLoading } = useQuery({
    queryKey: ['ownedBooks', user?.id],
    queryFn: () => getOwnedBooksForCurrentUser(user),
    enabled: !!user,
  });

  const filteredBooks = useMemo(() => {
    if (!books) {
      return [];
    }
    return books.filter((book) =>
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [books, searchQuery]);

  const handleAddClick = () => {
    router.push('/tai-khoan/them-truyen'); // Chuyển hướng đến trang thêm truyện
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderBookList = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 w-full text-white">
          <p>Đang tải danh sách truyện...</p>
        </div>
      );
    }

    if (!filteredBooks || filteredBooks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 w-full text-white">
          <p>Không tìm thấy truyện nào.</p>
        </div>
      );
    }

    return filteredBooks.map((novel) => (
      <UserBookCard key={novel.id} novel={novel} />
    ));
  };

  return (
    <div className="flex flex-col items-start gap-2.5 relative flex-1 self-stretch w-full grow bg-surface-section">
      <UserStats />

      {showSuccessMessage && (
        <div className="bg-emerald-500/20 text-emerald-500 p-3 rounded-md text-sm flex items-center gap-2 w-full max-w-lg mx-auto md:mx-0 mt-4">
          <CheckCircle2 size={20} />
          <span>Thêm truyện thành công! Yêu cầu crawl đang được xử lý.</span>
        </div>
      )}

      <div className="flex flex-col items-start justify-center gap-2.5 relative flex-1 self-stretch w-full grow">
        <div className="items-center justify-end gap-[50px] px-[50px] py-2.5 w-full flex-[0_0_auto] flex relative self-stretch">
          <Button
            onClick={handleAddClick}
            className="bg-blue-500 border border-white px-2.5 py-[5px] rounded-md shadow-[0px_4px_4px_var(--color-shadow-white)] hover:opacity-90 transition-opacity"
            aria-label="Thêm mới"
          >
            <BookPlus size={20} className="text-white" />
            <span className="font-inter font-bold text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
              Thêm
            </span>
          </Button>

          <div className="inline-flex items-center gap-5 px-5 py-2.5 relative flex-[0_0_auto] bg-white rounded-md overflow-hidden">
            <label htmlFor="search-input" className="sr-only">
              Tìm kiếm
            </label>
            <input
              id="search-input"
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm..."
              className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto] w-fit mt-[-1.00px] font-roboto font-normal text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap bg-transparent border-none outline-none"
              aria-label="Tìm kiếm tiểu thuyết"
            />

            <div className="flex w-5 h-5 items-start gap-2.5 relative bg-white aspect-[1]">
              <Image
                className="relative flex-1 self-stretch grow object-cover"
                alt="Search icon"
                src={loupe1Path}
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>

        <section
          className="flex-col items-start gap-2.5 px-[30px] py-2.5 flex-1 w-full grow flex relative self-stretch"
          aria-label="Danh sách tiểu thuyết"
        >
          {renderBookList()}
        </section>
      </div>
    </div>
  );
}
