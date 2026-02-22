"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { SearchBookResult } from "@/modules/book/book.types"; // Updated import to SearchBookResult
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react"; // For description icon

interface SearchBookCardProps {
  book: SearchBookResult; // Updated prop type
}

export const SearchBookCard = ({ book }: SearchBookCardProps) => {
  // Corrected typo here
  const isCompleted = book.status === "COMPLETED"; // Use book.status

  return (
    <Link href={`/truyen/${book.slug}`} className="block">
      <div
        className={cn(
          "group flex flex-col md:flex-row gap-4 p-4 h-52", // Changed px-3 py-6 to px-3 pt-4 pb-8
          "bg-surface-card rounded-md overflow-hidden",
          "shadow-md hover:shadow-lg transition-all duration-200",
          "border border-border-default hover:border-primary-accent", // Subtle border and accent on hover
        )}
      >
        {/* Image Section */}
        <div className="relative flex-shrink-0 w-full h-full md:w-2/7 pb-4">
          <div className="relative w-full h-full rounded-md overflow-hidden border border-border-default">
            <Image
              src={book.cover_image_url || "/placeholder.jpg"}
              alt={book.book_name_translated || "Ảnh bìa truyện"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {isCompleted && (
            <Badge className="absolute top-2 left-2 bg-success text-foreground font-semibold rounded-full z-10">
              FULL
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow min-h-0">
          {/* Top info */}
          <div className="flex-shrink-0">
            <h3
              className="
                text-xl font-bold
                text-text-primary
                line-clamp-2 mb-1
                transition-colors duration-200
                group-hover:text-[var(--primary-accent)]
              "
            >
              {" "}
              {book.book_name_translated}
            </h3>

            {book.author_name_translated && (
              <p className="text-text-secondary text-sm mb-2 line-clamp-1">
                {book.author_name_translated}
              </p>
            )}

            <p className="text-primary-accent font-semibold text-base mb-2">
              {book.chapterCount} Chương
            </p>
          </div>

          {/* Description */}
          {book.description && (
            <div className="flex gap-2 mt-auto overflow-hidden">
              <Quote
                size={16}
                className="text-text-secondary mt-1 flex-shrink-0"
              />
              <p className="text-text-muted text-sm line-clamp-4">
                {book.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
