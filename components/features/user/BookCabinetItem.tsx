'use client';

import { UserBookItem } from "@/modules/book/book.types";
import { timeAgo } from "@/utils/date";
import { Trash } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

interface BookCabinetItemProps {
  novel: UserBookItem;
  onDelete: (id: string) => void;
}

export const BookCabinetItem = ({ novel, onDelete }: BookCabinetItemProps) => {
  return (
    <article
      className="flex items-start relative self-stretch w-full flex-[0_0_auto] rounded-[10px] overflow-hidden border border-solid border-[#868686] shadow-lg"
      style={{ backgroundImage: `url(${'/dark-rock-wall-seamless-texture-free-105.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Link
        href={`/truyen/${novel.slug}`}
        className="
          flex-1
          transition-all duration-200 ease-out
          hover:bg-black/60
          hover:shadow-xl
          hover:scale-[1.01]
          cursor-pointer
        "
      >
        <div className="h-[150px] items-center flex-1 grow flex gap-5 relative bg-black/50 p-2 rounded-md">
          <div className="items-center justify-center gap-2.5 aspect-[0.7] flex relative self-stretch">
            <Image
              className="relative flex-1 grow aspect-[0.7] object-cover rounded"
              alt={`${novel.title} cover`}
              src={novel.coverImageUrl || '/placeholder.jpg'}
              width={100}
              height={150}
            />
          </div>

          <div className="flex-col items-start gap-[5px] px-5 py-[5px] flex-1 grow flex relative self-stretch">
            <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
              <h2 className="relative flex items-center justify-center w-fit [font-family:'Roboto-Bold',Helvetica] font-bold text-white text-2xl tracking-[0.10px] leading-6 whitespace-nowrap">
                {novel.title}
              </h2>

              {novel.status && (
                <span className="inline-flex items-center justify-center gap-2.5 px-2.5 py-[5px] relative flex-[0_0_auto] bg-[#3a1f1c] rounded-[10px] overflow-hidden">
                  <span className="relative w-fit mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#f5b7b1] text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                    {novel.status}
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
              <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-white text-xl tracking-[0.10px] leading-5 whitespace-nowrap">
                Chương: {novel.totalChapters}
              </span>
              <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-white text-xl tracking-[0.10px] leading-5 whitespace-nowrap">
                Cập nhật: {timeAgo(novel.updatedAt)}
              </span>
            </div>

            <div className="inline-flex items-center justify-center gap-5 relative flex-[0_0_auto]">
              {novel.genres.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2.5 p-[5px] relative flex-[0_0_auto] bg-[#ffffff33] rounded-[10px] overflow-hidden"
                >
                  <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-white text-base text-center tracking-[0.10px] leading-[normal] whitespace-nowrap">
                    {tag}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
      

      <div
        className="
          flex items-center justify-center
          self-stretch              /* cao bằng container cha */
          w-[60px]                  /* tăng bề ngang nút */
          cursor-pointer
          transition-colors
          hover:bg-red-900/70
          group
        "
        onClick={() => onDelete(novel.id)}
      >
        <Trash
          size={26}            
          className="text-white/70 group-hover:text-white transition-colors"
        />
      </div>
    </article>
  );
};
