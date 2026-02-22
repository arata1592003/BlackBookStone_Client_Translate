"use client";

import { Button } from "@/components/ui/Button";
import { getVisiblePages, cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PagePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PagePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PagePaginationProps) => {
  const pageNumbers = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-center gap-2.5 p-2.5 relative self-stretch w-full flex-[0_0_auto]"
      aria-label="Pagination"
    >
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-surface-raised hover:bg-surface-raised/70 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
        Trang trước
      </Button>

      {pageNumbers.map((pageNum, index) =>
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
            onClick={() => typeof pageNum === "number" && onPageChange(pageNum)}
            disabled={typeof pageNum === "string"}
            className={cn(
              "px-3 py-1 rounded-md",
              currentPage === pageNum
                ? "bg-primary text-white"
                : "bg-surface-raised hover:bg-surface-raised/70 text-text-primary",
            )}
          >
            {pageNum}
          </Button>
        ),
      )}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-surface-raised hover:bg-surface-raised/70 text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Trang kế tiếp
        <ChevronRight size={16} />
      </Button>
    </nav>
  );
};
