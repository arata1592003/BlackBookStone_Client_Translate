'use client';

import { Button } from "@/components/ui/Button";
import { UserBookItem } from "@/modules/book/book.types";
import { timeAgo } from "@/utils/date";
import { AppWindowMac, Eye, SquarePen, Trash } from "lucide-react";
import Image from "next/image";

interface UserBookCardProps {
  novel: UserBookItem;
}

const backgroundPath = "/dark-rock-wall-seamless-texture-free-105.png"

const handleNovelAction = (novelId: string, action: string) => {
  console.log(`Novel ${novelId}: ${action} action triggered`);
};

const getStatusStyles = (status: string | null) => {
  switch (status) {
    case "Đang ra":
      return { backgroundColor: "#1c3a3a", color: "#b1f5f5" };
    case "Hoàn thành":
      return { backgroundColor: "#1c3a2f", color: "#b1f5d5" };
    default:
      return { backgroundColor: "#3a1f1c", color: "#f5b7b1" };
  }
};

export const UserBookCard = ({ novel }: UserBookCardProps) => {
  const statusStyles = getStatusStyles(novel.status);

  return (
    <article
      key={novel.id}
      className="flex items-start gap-5 relative self-stretch w-full flex-[0_0_auto] rounded-lg overflow-hidden border border-solid border-border-subtle shadow-[0px_4px_12px_#000000]"
    >
      <Image
        src={backgroundPath || '/placeholder.jpg'}
        alt={novel.title || "Book Cover"}
        fill
        style={{ objectFit: 'cover' }}
        className="z-0"
      />
      <div className="relative h-full z-10 flex items-start gap-5 self-stretch w-full">
        <div className="items-center h-full flex-1 grow flex gap-2.5  relative bg-opacity-50 rounded-lg">
          <div className="self-stretch flex flex-col border-r border-white/30">
          {/* VIEW */}
          <div
            className="
              flex-1
              flex items-center justify-center
              cursor-pointer
              transition-colors
              hover:bg-blue-500/70
              group
              px-4
            "
            onClick={() => handleNovelAction(novel.id, "view")}
          >
            <Eye
              size={20}
              className="text-white/70 group-hover:text-white"
            />
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-white/20" />

          {/* DELETE */}
          <div
            className="
              flex-1
              flex items-center justify-center
              cursor-pointer
              transition-colors
              hover:bg-red-900/70
              group
            "
            onClick={() => handleNovelAction(novel.id, "delete")}
          >
            <Trash
              size={20}
              className="text-white/70 group-hover:text-white"
            />
          </div>

        </div>

          <div className="flex flex-col items-start justify-between px-5 py-[5px] relative flex-1 self-stretch grow">
            <div className="flex gap-2.5 self-stretch w-full items-center relative flex-[0_0_auto]">
              <h3 className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-bold text-white text-xl tracking-[0.10px] leading-9 whitespace-nowrap">
                {novel.title}
              </h3>

              {novel.status && (
                <span
                  className="inline-flex items-center justify-center gap-2.5 px-2.5 py-[5px] relative flex-[0_0_auto] rounded-md overflow-hidden"
                  style={{ backgroundColor: statusStyles.backgroundColor }}
                >
                  <span
                    className="relative w-fit mt-[-1.00px] font-inter font-normal text-lg tracking-[0] leading-[normal] whitespace-nowrap"
                    style={{ color: statusStyles.color }}
                  >
                    {novel.status}
                  </span>
                </span>
              )}
              <div className="self-stretch flex items-center justify-center px-1 hover:bg-blue-900/20 transition-colors cursor-pointer"
                onClick={() => handleNovelAction(novel.id, "edit")}>
                <SquarePen size={20} className="text-white" />
                </div>
              </div>

            <div className="flex gap-5 self-stretch w-full items-center relative flex-[0_0_auto]">
              <p className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-normal text-white text-lg tracking-[0.10px] leading-8 whitespace-nowrap">
                Tình trạng: {novel.translatedChapters}/{novel.totalChapters}
              </p>

              <p className="relative flex items-center justify-center w-fit font-roboto font-normal text-white text-lg tracking-[0.10px] leading-6 whitespace-nowrap">
                Cập nhật: {timeAgo(novel.updatedAt)}
              </p>
            </div>

            <div className="inline-flex justify-center gap-5 items-center relative flex-[0_0_auto]">
              {novel.genres.map((genre, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2.5 p-[5px] relative flex-[0_0_auto] bg-border-white-alpha rounded-md overflow-hidden"
                >
                  <span className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-normal text-white text-base text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                    {genre}
                  </span>
                </span>
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
              onClick={() => handleNovelAction(novel.id, "crawl")}
              className="w-full bg-emerald-600 hover:bg-emerald-500 border border-border-strong shadow-[0px_4px_4px_var(--color-shadow-white)] text-lg font-bold"
            >
              <AppWindowMac size={20} className="text-white" />
              Cào
            </Button>
            <Button
              onClick={() => handleNovelAction(novel.id, "translate")}
              className="w-full bg-violet-600 hover:bg-violet-500 border border-border-strong shadow-[0px_4px_4px_var(--color-shadow-white)] text-lg font-bold"
            >
              Dịch
            </Button>
            <Button
              onClick={() => handleNovelAction(novel.id, "download")}
              className="w-full bg-teal-500 hover:bg-teal-400 border border-border-strong shadow-[0px_4px_4px_var(--color-shadow-white)] text-lg font-bold"
            >
              Tải
            </Button>
          </div>
        </nav>
      </div>
    </article>
  );
};
