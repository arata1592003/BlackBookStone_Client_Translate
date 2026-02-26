"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { SearchBookResult } from "@/modules/book/book.types";
import { cn } from "@/lib/utils";
import { Star, BookOpen } from "lucide-react";

interface GridBookCardProps {
  book: SearchBookResult;
}

export const GridBookCard = ({ book }: GridBookCardProps) => {
  const isCompleted = book.status === "full" || book.status === "COMPLETED";

  return (
    <Link href={`/truyen/${book.slug}`} className="group block w-full">
      <div className="flex flex-col gap-2">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border-default bg-surface-raised shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-primary-accent/50 group-hover:-translate-y-1">
          <Image
            src={book.cover_image_url || "/placeholder.jpg"}
            alt={book.book_name_translated || "Ảnh bìa"}
            fill
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isCompleted && (
              <Badge className="bg-success text-foreground text-[10px] font-bold px-1.5 py-0 rounded-md border-none shadow-sm">
                FULL
              </Badge>
            )}
          </div>

          {/* View Overlay (Bottom) */}
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1 text-white text-[10px] font-bold">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span>Hot</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 px-1">
          <h3 className="text-sm md:text-base font-bold text-text-primary line-clamp-2 leading-tight group-hover:text-primary-accent transition-colors min-h-[2.5rem]">
            {book.book_name_translated}
          </h3>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1 text-text-muted">
              <BookOpen size={12} />
              <span className="text-[11px] font-medium">{book.chapterCount} ch</span>
            </div>
            
            {book.view > 0 && (
              <span className="text-[10px] text-text-muted italic">
                {book.view.toLocaleString()} lượt đọc
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
