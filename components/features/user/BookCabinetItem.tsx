"use client";

import { Badge } from "@/components/ui/badge";
import { UserBookItem } from "@/modules/book/book.types";
import { timeAgo } from "@/utils/date";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BookCabinetItemProps {
  novel: UserBookItem;
  onDelete: (id: string) => void;
}

export const BookCabinetItem = ({ novel, onDelete }: BookCabinetItemProps) => {
  return (
    <article
      className="flex items-start relative self-stretch w-full flex-[0_0_auto] rounded-md overflow-hidden border border-solid border-border-subtle shadow-lg"
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
          hover:shadow-xl
          hover:scale-[1.01]
          cursor-pointer
        "
      >
        <div className="h-[150px] items-center flex-1 grow flex gap-5 relative bg-background/50 p-2 rounded-md">
          <div className="items-center justify-center gap-2.5 aspect-[0.7] flex relative self-stretch">
            <Image
              className="relative flex-1 grow aspect-[0.7] object-cover rounded"
              alt={`${novel.title} cover`}
              src={novel.coverImageUrl || "/placeholder.jpg"}
              width={100}
              height={150}
            />
          </div>

          <div className="flex-col items-start gap-[5px] px-5 py-[5px] flex-1 grow flex relative self-stretch">
            <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
              <h2 className="relative flex items-center justify-center w-fit font-roboto font-bold text-foreground text-2xl tracking-[0.10px] leading-6 whitespace-nowrap">
                {novel.title}
              </h2>

              {novel.status && (
                <Badge className="bg-accent-red-bg text-accent-red-text border-none">
                  {novel.status}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
              <span className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-normal text-foreground text-xl tracking-[0.10px] leading-5 whitespace-nowrap">
                Chương: {novel.totalChapters}
              </span>
              <span className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-normal text-foreground text-xl tracking-[0.10px] leading-5 whitespace-nowrap">
                Cập nhật: {timeAgo(novel.updatedAt)}
              </span>
            </div>

            <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto]">
              {novel.genres.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-border-white-alpha text-foreground font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Link>

      <div
        className="
          flex items-center justify-center
          self-stretch
          w-[60px]
          cursor-pointer
          transition-colors
          hover:bg-destructive/70
          group
        "
        onClick={() => onDelete(novel.id)}
      >
        <Trash
          size={26}
          className="text-foreground/70 group-hover:text-foreground transition-colors"
        />
      </div>
    </article>
  );
};
