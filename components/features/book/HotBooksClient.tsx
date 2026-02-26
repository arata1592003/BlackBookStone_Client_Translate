"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BookCardWithAuthor } from "@/modules/book/book.types";
import { PagePagination } from "@/components/ui/page-pagination";
import { BookCard } from "./BookCard";
import { Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotBooksClientProps {
  initialBooks: BookCardWithAuthor[];
  initialTotalBooks: number;
  booksPerPage: number;
  currentPage: number;
}

export default function HotBooksClient({
  initialBooks,
  initialTotalBooks,
  booksPerPage,
  currentPage,
}: HotBooksClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(initialTotalBooks / booksPerPage);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-border-default pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Flame size={32} className="text-primary-accent" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary uppercase tracking-tight leading-none mb-1">
              Bảng Xếp Hạng
            </h2>
            <p className="text-sm text-text-muted font-medium">Truyện được quan tâm nhiều nhất</p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-text-muted uppercase font-bold tracking-widest">Cập nhật lúc</span>
          <span className="text-sm font-semibold text-text-secondary">Hôm nay</span>
        </div>
      </div>

      {/* TOP 3 HIGHLIGHT (Optional, can be used to make first page more interesting) */}
      {currentPage === 1 && initialBooks.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialBooks.slice(0, 3).map((book, idx) => (
            <div key={book.id} className="relative group">
              <div className={cn(
                "absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center z-20 shadow-lg font-bold text-xl",
                idx === 0 ? "bg-yellow-500 text-black scale-110" : 
                idx === 1 ? "bg-slate-300 text-black" : 
                "bg-amber-600 text-white"
              )}>
                {idx === 0 ? <Trophy size={20} /> : idx + 1}
              </div>
              <div className="bg-surface-card rounded-2xl p-4 border border-border-default hover:border-primary-accent transition-all duration-300 flex items-center gap-4">
                <BookCard book={book} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-text-primary line-clamp-1 mb-1">{book.book_name_translated}</h3>
                  <p className="text-sm text-text-secondary mb-2">{book.author_name_translated}</p>
                  <div className="flex items-center gap-1.5 text-primary-accent font-bold text-sm">
                    <Flame size={14} />
                    <span>{book.view.toLocaleString()} lượt đọc</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MAIN LIST */}
      <section className="bg-surface-card rounded-2xl p-6 border border-border-default shadow-sm">
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-10 gap-x-2 md:gap-x-4 justify-items-center">
          {(currentPage === 1 ? initialBooks.slice(3) : initialBooks).map((book, idx) => {
            const rank = (currentPage - 1) * booksPerPage + (currentPage === 1 ? idx + 4 : idx + 1);
            return (
              <div key={book.id} className="relative group w-fit">
                <div className="absolute top-1 left-1 bg-background/80 backdrop-blur-sm text-text-primary text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                  #{rank}
                </div>
                <BookCard book={book} />
                <div className="mt-1 px-1 flex items-center justify-center gap-1 text-[10px] text-text-muted font-bold">
                  <Flame size={10} className="text-primary-accent" />
                  <span>{book.view.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="py-8 border-t border-border-default/30">
          <PagePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
