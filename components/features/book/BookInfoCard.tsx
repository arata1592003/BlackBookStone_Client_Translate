"use client";

import { BookInfo } from "@/modules/book/book.types";
import { Bookmark, List, Play } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type Props = {
  bookInfo: BookInfo & {
    genres?: { id: number; name: string }[];
  };
  onGoChapterList?: () => void;
};

export const BookInfoCard = ({ bookInfo, onGoChapterList }: Props) => {
  const actionButtons = [
    {
      id: 1,
      IconComponent: Play,
      label: "Đọc từ đầu",
      href: `/truyen/${bookInfo.slug}/chuong/1`,
    },
    { id: 2, IconComponent: Bookmark, label: "Lưu truyện" },
    { id: 3, IconComponent: List, label: "D.S Chương" },
  ];

  return (
    <section
      className="flex w-[900px] items-start gap-2.5 py-2.5 relative flex-[0_0_auto] rounded-md overflow-hidden bg-[url(/frame-67.png)] bg-cover bg-[50%_50%]"
      aria-label="Book information section"
    >
      <Image
        src={bookInfo.cover_image_url || "/placeholder-cover.jpg"}
        alt={`Cover image for ${bookInfo.book_name_translated}`}
        width={219}
        height={330}
        className="relative w-[219px] h-[330px] rounded-md shadow-[0px_4px_4px_var(--color-shadow-white)] aspect-[0.66] object-cover"
      />

      <div className="flex flex-col items-start gap-2.5 p-2.5 relative flex-1 self-stretch grow">
        <h1 className="relative w-fit mt-[-1.00px] font-inter font-bold text-text-secondary text-xl tracking-[0] leading-[normal] whitespace-nowrap">
          {bookInfo.book_name_translated}
        </h1>

        <div className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <p className="relative w-fit mt-[-1.00px] font-inter font-normal text-text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
            <span className="font-medium">Dịch</span>
            <span className="font-inter font-bold">
              :
            </span>
          </p>

          <div className="relative w-fit mt-[-1.00px] font-inter font-normal text-text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
            {bookInfo.user_name}
          </div>
        </div>

        <div className="inline-flex items-start gap-2.5 relative flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] font-inter font-medium text-text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
            Tình trạng:
          </div>

          <div className="relative w-fit mt-[-1.00px] font-inter font-normal text-text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
            {bookInfo.publication_status}
          </div>
        </div>

        {bookInfo.genres && bookInfo.genres.length > 0 && (
          <div
            className="inline-flex items-start gap-2.5 px-0 py-2.5 relative flex-[0_0_auto]"
            role="list"
            aria-label="Book genres"
          >
            {bookInfo.genres.map((genre) => (
              <div
                key={genre.id}
                className="inline-flex items-center gap-2.5 p-[5px] relative flex-[0_0_auto] bg-border-white-alpha rounded-md overflow-hidden"
                role="listitem"
              >
                <span className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-normal text-text-secondary text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
                  {genre.name}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-medium text-text-secondary text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            {bookInfo.count_word} chữ
          </div>

          <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-medium text-text-secondary text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            {bookInfo.count_chapter} chương
          </div>
        </div>

        <div className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-roboto font-medium text-text-secondary text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            {bookInfo.view} lượt đọc
          </div>
        </div>

        <div
          className="flex items-start gap-2.5 px-0 py-2.5 relative self-stretch w-full flex-[0_0_auto]"
          role="group"
          aria-label="Book actions"
        >
          {actionButtons.map((button) => {
            const Icon = button.IconComponent;

            if (button.href) {
              return (
                <Button
                  key={button.id}
                  asChild
                  className="p-2.5 bg-primary rounded-lg hover:bg-primary-hover transition-colors"
                >
                  <Link href={button.href} aria-label={button.label}>
                    <Icon
                      className="relative w-4 h-4 aspect-[1]"
                      aria-hidden="true"
                      size={16}
                    />
                    <span className="font-roboto font-medium text-text-secondary text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
                      {button.label}
                    </span>
                  </Link>
                </Button>
              );
            } else {
              return (
                <Button
                  key={button.id}
                  onClick={onGoChapterList}
                  className="p-2.5 bg-primary rounded-lg hover:bg-primary-hover transition-colors"
                  aria-label={button.label}
                >
                  <Icon
                    className="relative w-4 h-4 aspect-[1]"
                    aria-hidden="true"
                    size={16}
                  />
                  <span className="font-roboto font-medium text-text-secondary text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
                    {button.label}
                  </span>
                </Button>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
};
