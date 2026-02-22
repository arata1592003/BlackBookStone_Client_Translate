"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { SearchBookResult } from "@/modules/book/book.types";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface SearchBookCardProps {
  book: SearchBookResult;
}

export const SearchBookCard = ({ book }: SearchBookCardProps) => {
  const isCompleted = book.status === "COMPLETED";

  return (
    <Link href={`/truyen/${book.slug}`} className="block">
      <div
        className={cn(
          "group flex gap-3 md:gap-4 p-3 md:p-4 md:h-52", 
          "bg-surface-card rounded-md overflow-hidden",
          "shadow-md hover:shadow-lg transition-all duration-200",
          "border border-border-default hover:border-primary-accent",
        )}
      >
        {/* Image Section */}
        <div className="relative flex-shrink-0 w-24 xs:w-28 md:w-32 lg:w-36 aspect-[2/3]">
          <div className="relative w-full h-full rounded-md overflow-hidden border border-border-default">
            <Image
              src={book.cover_image_url || "/placeholder.jpg"}
              alt={book.book_name_translated || "Ảnh bìa truyện"}
              fill
              sizes="(max-width: 768px) 120px, (max-width: 1200px) 150px, 200px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {isCompleted && (
            <Badge className="absolute top-1 left-1 md:top-2 md:left-2 bg-success text-foreground font-semibold rounded-full z-10 scale-75 md:scale-100">
              FULL
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow min-h-0 py-0.5 md:py-1">
          {/* Top info */}
          <div className="flex-shrink-0">
            <h3
              className="
                text-sm md:text-xl font-bold
                text-text-primary
                line-clamp-2 mb-0.5 md:mb-1
                transition-colors duration-200
                group-hover:text-primary-accent
              "
            >
              {book.book_name_translated}
            </h3>

            {book.author_name_translated && (
              <p className="text-text-secondary text-[10px] md:text-sm mb-0.5 md:mb-2 line-clamp-1">
                {book.author_name_translated}
              </p>
            )}

            <p className="text-primary-accent font-semibold text-xs md:text-base mb-1 md:mb-2">
              {book.chapterCount} Chương
            </p>
          </div>

          {/* Description - Visible on all screens, but tightly clamped on mobile */}
          {book.description && (
            <div className="flex gap-1.5 md:gap-2 mt-auto overflow-hidden border-t border-border-default/30 pt-1.5 md:pt-2">
              <Quote
                size={12}
                className="text-text-secondary mt-0.5 flex-shrink-0 md:size-4"
              />
              <p className="text-text-muted text-[10px] md:text-sm line-clamp-2 md:line-clamp-3 lg:line-clamp-4 leading-normal">
                {book.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
