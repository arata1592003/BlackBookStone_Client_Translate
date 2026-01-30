"use client";

import { BookInfo } from "@/modules/book/book.types";
import { Bookmark, List, Play } from 'lucide-react'; // Import Lucide icons
import Image from "next/image";
import Link from "next/link";

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
      IconComponent: Play, // Using Play icon from Lucide
      label: "Đọc từ đầu",
      href: `/truyen/${bookInfo.slug}/chuong/1`,
    },
    { id: 2, IconComponent: Bookmark, label: "Lưu truyện" }, // Using Bookmark icon from Lucide
    { id: 3, IconComponent: List, label: "D.S Chương" }, // Using List icon from Lucide
  ];

  return (
    <section
      className="flex w-[900px] items-start gap-2.5 py-2.5 relative flex-[0_0_auto] rounded-[10px] overflow-hidden bg-[url(/frame-67.png)] bg-cover bg-[50%_50%]"
      aria-label="Book information section"
    >
      <Image
        src={bookInfo.cover_image_url || "/placeholder-cover.jpg"}
        alt={`Cover image for ${bookInfo.book_name_translated}`}
        width={219}
        height={330}
        className="relative w-[219px] h-[330px] rounded-[10px] shadow-[0px_4px_4px_#ffffff40] aspect-[0.66] object-cover"
      />

      <div className="flex flex-col items-start gap-2.5 p-2.5 relative flex-1 self-stretch grow">
        <h1 className="relative w-fit mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-gray-300 text-xl tracking-[0] leading-[normal] whitespace-nowrap">
          {bookInfo.book_name_translated}
        </h1>

        <div className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <p className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-normal text-gray-300 text-base tracking-[0] leading-[normal] whitespace-nowrap">
            <span className="font-medium">Dịch</span>
            <span className="[font-family:'Inter-Bold',Helvetica] font-bold">
              :
            </span>
          </p>

          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-300 text-base tracking-[0] leading-[normal] whitespace-nowrap">
            {bookInfo.user_name}
          </div>
        </div>

        <div className="inline-flex items-start gap-2.5 relative flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-gray-300 text-base tracking-[0] leading-[normal] whitespace-nowrap">
            Tình trạng:
          </div>

          <div className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-gray-300 text-base tracking-[0] leading-[normal] whitespace-nowrap">
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
                className="inline-flex items-center gap-2.5 p-[5px] relative flex-[0_0_auto] bg-[#ffffff33] rounded-[10px] overflow-hidden"
                role="listitem"
              >
                <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-gray-300 text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
                  {genre.name}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-gray-300 text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            {bookInfo.count_word} chữ
          </div>

          <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-gray-300 text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            {bookInfo.count_chapter} chương
          </div>
        </div>

        <div className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-gray-300 text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
            {bookInfo.view} lượt đọc
          </div>
        </div>

        <div
          className="flex items-start gap-2.5 px-0 py-2.5 relative self-stretch w-full flex-[0_0_auto]"
          role="group"
          aria-label="Book actions"
        >
          {actionButtons.map((button) => {
            const Icon = button.IconComponent; // Destructure the IconComponent

            if (button.href) {
              return (
                <Link
                  key={button.id}
                  href={button.href}
                  className="inline-flex items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto] bg-[#3600c0] rounded-[20px] overflow-hidden cursor-pointer border-0 hover:bg-[#4a00ff] transition-colors"
                  aria-label={button.label}
                >
                  <Icon
                    className="relative w-4 h-4 aspect-[1]"
                    aria-hidden="true"
                    size={16} // Set size for Lucide icon
                  />
                  <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-gray-300 text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
                    {button.label}
                  </span>
                </Link>
              );
            } else {
              return (
                <button
                  key={button.id}
                  onClick={onGoChapterList}
                  type="button"
                  className="inline-flex items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto] bg-[#3600c0] rounded-[20px] overflow-hidden cursor-pointer border-0 hover:bg-[#4a00ff] transition-colors"
                  aria-label={button.label}
                >
                  <Icon
                    className="relative w-4 h-4 aspect-[1]"
                    aria-hidden="true"
                    size={16} // Set size for Lucide icon
                  />
                  <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-gray-300 text-base text-center tracking-[0.10px] leading-4 whitespace-nowrap">
                    {button.label}
                  </span>
                </button>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
};
