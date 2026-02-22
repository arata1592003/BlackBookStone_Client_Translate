"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserBookItem } from "@/modules/book/book.types";
import { timeAgo } from "@/utils/date";
import { AppWindowMac, Eye, SquarePen, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserBookCardProps {
  novel: UserBookItem;
}

const backgroundPath = "/dark-rock-wall-seamless-texture-free-105.png";

const handleNovelAction = (novelId: string, action: string) => {
  console.log(`Novel ${novelId}: ${action} action triggered`);
};

export const UserBookCard = ({ novel }: UserBookCardProps) => {
  const router = useRouter();

  return (
    <article
      key={novel.id}
      onClick={() => router.push(`/tai-khoan/truyen/${novel.id}`)}
      className="group flex items-start gap-5 relative self-stretch w-full flex-[0_0_auto] rounded-lg overflow-hidden border border-solid border-border-subtle shadow-[0px_4px_12px_var(--color-shadow-default)] cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-xl hover:border-primary"
    >
      <Image
        src={backgroundPath || "/placeholder.jpg"}
        alt={novel.title || "Book Cover"}
        fill
        style={{ objectFit: "cover" }}
        className="z-0"
      />
      <div className="relative h-full z-10 flex items-start gap-5 self-stretch w-full">
        <div className="items-center h-full flex-1 grow flex gap-2.5  relative bg-opacity-50 rounded-lg">
          <div className="self-stretch flex flex-col border-r border-border-default/30">
            {/* VIEW */}
            <div
              className="
              flex-1
              flex items-center justify-center
              cursor-pointer
              transition-colors
              hover:bg-primary/70
              group
              px-4
            "
              onClick={(e) => { e.stopPropagation(); handleNovelAction(novel.id, "view"); }}
            >
              <Eye size={20} className="text-foreground/70 group-hover:text-foreground" />
            </div>

            {/* Divider */}
            <Separator className="bg-foreground/20" />

            {/* DELETE */}
            <div
              className="
              flex-1
              flex items-center justify-center
              cursor-pointer
              transition-colors
              hover:bg-destructive/70
              group
            "
              onClick={(e) => { e.stopPropagation(); handleNovelAction(novel.id, "delete"); }}
            >
              <Trash
                size={20}
                className="text-foreground/70 group-hover:text-foreground"
              />
            </div>
          </div>

          <div className="flex flex-col items-start justify-between px-5 py-[5px] relative flex-1 self-stretch grow">
            <div className="flex gap-2.5 self-stretch w-full items-center relative flex-[0_0_auto]">
              <h3 className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-bold text-foreground text-xl tracking-[0.10px] leading-9 whitespace-nowrap">
                {novel.title}
              </h3>

              {novel.status && (
                <Badge 
                  variant="outline"
                  className={
                    novel.status === "Đang ra" 
                      ? "bg-[var(--color-book-card-variant1-bg)] text-[var(--color-book-card-variant1-text)] border-none"
                      : novel.status === "Hoàn thành"
                      ? "bg-[var(--color-book-card-variant2-bg)] text-[var(--color-book-card-variant2-text)] border-none"
                      : "bg-[var(--color-book-card-variant3-bg)] text-[var(--color-book-card-variant3-text)] border-none"
                  }
                >
                  {novel.status}
                </Badge>
              )}
              <div
                className="self-stretch flex items-center justify-center px-1 hover:bg-primary/20 transition-colors cursor-pointer"
                onClick={(e) => { e.stopPropagation(); handleNovelAction(novel.id, "edit"); }}
              >
                <SquarePen size={20} className="text-foreground" />
              </div>
            </div>

            <div className="flex gap-5 self-stretch w-full items-center relative flex-[0_0_auto]">
              <p className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-normal text-foreground text-lg tracking-[0.10px] leading-8 whitespace-nowrap">
                Tình trạng: {novel.translatedChapters}/{novel.totalChapters}
              </p>

              <p className="relative flex items-center justify-center w-fit font-roboto font-normal text-foreground text-lg tracking-[0.10px] leading-6 whitespace-nowrap">
                Cập nhật: {timeAgo(novel.updatedAt)}
              </p>
            </div>

            <div className="inline-flex justify-center gap-2 items-center relative flex-[0_0_auto]">
              {novel.genres.map((genre, index) => (
                <Badge key={index} variant="secondary" className="bg-border-white-alpha text-foreground font-normal">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <nav
          className="w-[120px] items-start self-stretch flex gap-5 px-2.5 py-[5px] relative"
          aria-label={`Actions for ${novel.title}`}
        >
          <div className="flex-col items-start gap-2.5 flex-1 grow flex relative self-stretch">
            <Button
              onClick={(e) => { e.stopPropagation(); handleNovelAction(novel.id, "crawl"); }}
              className="w-full bg-success hover:bg-success/90 border border-border-strong shadow-[0px_4px_4px_var(--color-shadow-white)] text-lg font-bold"
            >
              <AppWindowMac size={20} className="text-foreground" />
              Cào
            </Button>
            <Button
              onClick={(e) => { e.stopPropagation(); handleNovelAction(novel.id, "translate"); }}
              className="w-full bg-accent hover:bg-accent/90 border border-border-strong shadow-[0px_4px_4px_var(--color-shadow-white)] text-lg font-bold"
            >
              Dịch
            </Button>
            <Button
              onClick={(e) => { e.stopPropagation(); handleNovelAction(novel.id, "download"); }}
              className="w-full bg-secondary-accent hover:bg-secondary-accent/90 border border-border-strong shadow-[0px_4px_4px_var(--color-shadow-white)] text-lg font-bold"
            >
              Tải
            </Button>
          </div>
        </nav>
      </div>
    </article>
  );
};
