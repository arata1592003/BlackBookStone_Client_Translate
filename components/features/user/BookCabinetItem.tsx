"use client";

import { Badge } from "@/components/ui/badge";
import { UserBookItem } from "@/modules/book/book.types";
import { timeAgo } from "@/utils/date";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BookCabinetItemProps {
  novel: UserBookItem;
  onDelete: (id: string) => void;
}

export const BookCabinetItem = ({ novel, onDelete }: BookCabinetItemProps) => {
  return (
    <article
      className="flex items-stretch relative self-stretch w-full rounded-md overflow-hidden border border-solid border-border-default shadow-lg bg-surface-card"
      style={{
        backgroundImage: `url(${"/dark-rock-wall-seamless-texture-free-105.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Link
        href={`/truyen/${novel.slug}`}
        className="
          flex-1
          transition-all duration-200 ease-out
          hover:bg-background/60
          cursor-pointer
          min-w-0
        "
      >
        <div className="min-h-[100px] md:h-[150px] items-center flex gap-2 md:gap-5 relative bg-background/50 p-1 md:p-3">
          {/* Cover - Small on mobile to maximize text space */}
          <div className="relative w-[60px] xs:w-[70px] md:w-[100px] aspect-[0.7] shrink-0 overflow-hidden rounded shadow-sm">
            <Image
              className="object-cover"
              alt={`${novel.title} cover`}
              src={novel.coverImageUrl || "/placeholder.jpg"}
              fill
              sizes="(max-width: 768px) 60px, 100px"
            />
          </div>

          {/* Info */}
          <div className="flex-col items-start gap-0.5 md:gap-2 flex-1 grow flex relative min-w-0 py-0.5 md:py-1">
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2 self-stretch w-full">
              <h2 className="font-roboto font-bold text-foreground text-base md:text-2xl tracking-tight leading-tight truncate">
                {novel.title}
              </h2>

              {novel.status && (
                <Badge className="bg-accent-red-bg text-accent-red-text border-none text-[9px] md:text-xs px-1 py-0">
                  {novel.status}
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-0 md:gap-5 self-stretch w-full">
              <span className="font-roboto font-normal text-foreground text-[11px] md:text-xl opacity-90">
                Chương: <span className="font-semibold">{novel.totalChapters}</span>
              </span>
              <span className="font-roboto font-normal text-foreground text-[9px] md:text-xl opacity-70 italic md:not-italic">
                Cập nhật: {timeAgo(novel.updatedAt)}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 md:gap-2 mt-auto">
              {novel.genres.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-foreground/10 text-foreground font-normal text-[9px] md:text-xs px-1 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Delete Action - Minimal width on mobile */}
      <div
        className="
          flex items-center justify-center
          self-stretch
          w-10 md:w-[60px]
          cursor-pointer
          transition-colors
          hover:bg-destructive/70
          bg-destructive/10
          md:bg-transparent
          border-l border-border-default/30
          group
        "
        onClick={(e) => {
          e.preventDefault();
          onDelete(novel.id);
        }}
        title="Xóa khỏi tủ truyện"
      >
        <Trash
          size={16}
          className="text-foreground/70 group-hover:text-foreground transition-colors md:size-7"
        />
      </div>
    </article>
  );
};
