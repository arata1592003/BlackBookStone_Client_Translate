"use client";

import { UserBookCard } from "@/components/features/user/UserBookCard";
import { UserStats } from "@/components/features/user/UserStats";
import { getOwnedBooksForCurrentUser } from "@/modules/book/book.service";
import { Button } from "@/components/ui/button";
import { BookPlus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getVisiblePages } from "@/lib/utils";

const loupe1Path = "/icons8-search-50.png";

export default function BanLamViecPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get("addBookSuccess")) {
      setShowSuccessMessage(true);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("addBookSuccess");
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });

      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const { data: books, isLoading } = useQuery({
    queryKey: ["ownedBooks", user?.id],
    queryFn: () => getOwnedBooksForCurrentUser(user),
    enabled: !!user,
  });

  const filteredBooks = useMemo(() => {
    if (!books) {
      return [];
    }
    const filtered = books.filter((book) =>
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    return filtered.slice(indexOfFirstBook, indexOfLastBook);
  }, [books, searchQuery, currentPage, booksPerPage]);

  const totalFilteredBooksCount = useMemo(() => {
    if (!books) return 0;
    return books.filter((book) =>
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    ).length;
  }, [books, searchQuery]);

  const totalPages = Math.ceil(totalFilteredBooksCount / booksPerPage);

  const handleAddClick = () => {
    router.push("/tai-khoan/them-truyen");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderBookList = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 w-full text-foreground"></div>
      );
    }

    if (!filteredBooks || filteredBooks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 w-full text-foreground"></div>
      );
    }

    return filteredBooks.map((novel) => (
      <UserBookCard key={novel.id} novel={novel} />
    ));
  };

  return (
    <div className="flex flex-col items-start gap-4 md:gap-6 relative flex-1 self-stretch w-full grow bg-surface-section overflow-x-hidden">
      <UserStats />

      {showSuccessMessage && (
        <div className="mx-4 md:mx-8 bg-success/20 text-success p-3 rounded-md text-sm flex items-center gap-2 max-w-lg mt-2">
          <CheckCircle2 size={20} className="shrink-0" />
          <span>Thêm truyện thành công! Yêu cầu crawl đang được xử lý.</span>
        </div>
      )}

      <div className="flex flex-col items-start justify-center gap-4 md:gap-6 relative flex-1 self-stretch w-full grow px-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
          <Button
            onClick={handleAddClick}
            className="bg-primary border border-foreground px-4 py-2 rounded-md shadow-[0px_4px_4px_var(--color-shadow-white)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 h-11 sm:h-10"
            aria-label="Thêm mới"
          >
            <BookPlus size={20} className="text-foreground" />
            <span className="font-inter font-bold text-foreground text-lg md:text-xl tracking-[0] leading-[normal] whitespace-nowrap">
              Thêm truyện
            </span>
          </Button>

          <div className="inline-flex items-center gap-3 md:gap-5 px-4 md:px-5 py-2 relative flex-1 sm:flex-none sm:min-w-[300px] bg-surface-card rounded-md border border-border-default overflow-hidden h-11 sm:h-10">
            <label htmlFor="search-input" className="sr-only">
              Tìm kiếm
            </label>
            <input
              id="search-input"
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm truyện của bạn..."
              className="flex-1 font-roboto font-normal text-foreground text-base md:text-lg tracking-[0] leading-[normal] bg-transparent border-none outline-none min-w-0"
              aria-label="Tìm kiếm tiểu thuyết"
            />
            <div className="flex w-5 h-5 items-center justify-center shrink-0">
              <Image
                className="relative object-cover"
                alt="Search icon"
                src={loupe1Path}
                width={18}
                height={18}
              />
            </div>
          </div>
        </div>

        <section
          className="flex flex-col gap-4 w-full grow relative self-stretch"
          aria-label="Danh sách tiểu thuyết"
        >
          {renderBookList()}
        </section>

        <nav
          className="flex items-center justify-center gap-2.5 p-2.5 relative self-stretch w-full flex-[0_0_auto]"
          aria-label="Pagination"
        >
          <Button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-surface-raised hover:bg-surface-raised/70 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang trước
          </Button>

          {getVisiblePages(currentPage, totalPages).map((pageNum, index) =>
            pageNum === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-text-secondary opacity-60"
              >
                ...
              </span>
            ) : (
              <Button
                key={index}
                onClick={() =>
                  typeof pageNum === "number" && setCurrentPage(pageNum)
                }
                disabled={typeof pageNum === "string"}
                className={`px-3 py-1 rounded-md ${
                  pageNum === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-raised hover:bg-surface-raised/70 text-text-primary"
                }`}
              >
                {pageNum}
              </Button>
            ),
          )}

          <Button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-surface-raised hover:bg-surface-raised/70 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trang kế tiếp
          </Button>
        </nav>
      </div>
    </div>
  );
}
