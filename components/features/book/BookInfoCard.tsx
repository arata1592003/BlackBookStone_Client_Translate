"use client";

import { BookInfo } from "@/modules/book/book.types";
import { Bookmark, BookmarkCheck, List, Play, User as UserIcon, Activity, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { checkFollowStatusAction, toggleFollowBookAction } from "@/app/actions/book";
import { useAuth } from "@/components/providers/AuthProvider";

type Props = {
  bookInfo: BookInfo & {
    genres?: { id: number; name: string }[];
  };
  onGoChapterList?: () => void;
};

export const BookInfoCard = ({ bookInfo, onGoChapterList }: Props) => {
  const { user } = useAuth();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }
      const result = await checkFollowStatusAction(bookInfo.id);
      if (result.success) {
        setIsFollowed(result.isFollowed);
      }
      setIsChecking(false);
    };
    checkStatus();
  }, [bookInfo.id, user]);

  const handleToggleFollow = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để lưu truyện.");
      return;
    }
    if (isLoadingFollow) return;

    setIsLoadingFollow(true);
    try {
      const result = await toggleFollowBookAction(bookInfo.id);
      if (result.success) {
        setIsFollowed(result.isFollowed ?? false);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Follow toggle failed:", error);
    } finally {
      setIsLoadingFollow(false);
    }
  };

  const actionButtons = [
    {
      id: 1,
      IconComponent: Play,
      label: "Đọc từ đầu",
      href: `/truyen/${bookInfo.slug}/chuong/1`,
      variant: "default" as const,
    },
    { 
      id: 2, 
      IconComponent: isFollowed ? BookmarkCheck : Bookmark, 
      label: isFollowed ? "Đã lưu" : "Lưu truyện", 
      variant: "secondary" as const,
      onClick: handleToggleFollow,
      isLoading: isLoadingFollow,
      isActive: isFollowed
    },
    { id: 3, IconComponent: List, label: "D.S Chương", variant: "secondary" as const, onClick: onGoChapterList },
  ];

  return (
    <section
      className="flex flex-col md:flex-row w-full items-center md:items-start gap-6 md:gap-8 py-6 md:py-8 px-4 md:px-0 relative rounded-xl overflow-hidden bg-surface-card/50 border border-border-default/50 shadow-sm"
      aria-label="Book information section"
    >
      {/* Background Decorative Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <Image 
          src={bookInfo.cover_image_url || "/placeholder-cover.jpg"} 
          alt="" fill className="object-cover blur-2xl" 
        />
      </div>

      <div className="relative z-10 flex-shrink-0 w-40 md:w-56 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-border-default">
        <Image
          src={bookInfo.cover_image_url || "/placeholder-cover.jpg"}
          alt={`Cover image for ${bookInfo.book_name_translated}`}
          fill
          priority
          sizes="(max-width: 768px) 160px, 224px"
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center md:items-start gap-4 flex-1 w-full">
        <div className="flex flex-col items-center md:items-start gap-2">
          <h1 className="text-center md:text-left font-inter font-extrabold text-text-primary text-2xl md:text-4xl tracking-tight leading-tight">
            {bookInfo.book_name_translated}
          </h1>
          
          <div className="flex items-center gap-2 text-text-secondary">
            <UserIcon size={16} className="text-primary-accent" />
            <span className="text-sm md:text-base font-medium">Dịch giả:</span>
            <span className="text-sm md:text-base text-primary-accent font-bold">{bookInfo.user_name}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 text-xs md:text-sm font-semibold">
            <Activity size={14} className="mr-1.5" />
            {bookInfo.publication_status}
          </Badge>
          
          {bookInfo.genres && bookInfo.genres.map((genre) => (
            <Badge
              key={genre.id}
              variant="secondary"
              className="bg-surface-raised text-text-secondary hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer px-3 py-1 text-xs md:text-sm font-normal"
            >
              {genre.name}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 w-full max-w-md gap-4 py-4 border-y border-border-default/30 my-2">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] md:text-xs text-text-muted uppercase font-bold tracking-wider">Số chữ</span>
            <span className="text-sm md:text-lg font-mono font-bold text-text-primary">{bookInfo.count_word.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] md:text-xs text-text-muted uppercase font-bold tracking-wider">Chương</span>
            <span className="text-sm md:text-lg font-mono font-bold text-text-primary">{bookInfo.count_chapter}</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] md:text-xs text-text-muted uppercase font-bold tracking-wider">Lượt đọc</span>
            <span className="text-sm md:text-lg font-mono font-bold text-text-primary">{bookInfo.view.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 w-full mt-2">
          {actionButtons.map((button) => {
            const Icon = button.IconComponent;
            const isPrimary = button.variant === "default";
            const isLoading = (button as any).isLoading;
            const isActive = (button as any).isActive;

            const btnContent = (
              <>
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Icon size={18} className={isPrimary ? "text-white" : (isActive ? "text-success" : "text-primary-accent")} />
                )}
                <span className="font-bold text-sm md:text-base">{button.label}</span>
              </>
            );

            return button.href ? (
              <Button
                key={button.id}
                asChild
                variant={button.variant}
                className={cn(
                  "flex-1 md:flex-none min-w-[130px] md:min-w-[150px] h-11 md:h-12 gap-2 shadow-sm rounded-lg transition-all active:scale-95",
                  isPrimary ? "bg-primary hover:bg-primary/90 text-white" : "bg-surface-raised border-border-default hover:bg-primary/10"
                )}
              >
                <Link href={button.href}>{btnContent}</Link>
              </Button>
            ) : (
              <Button
                key={button.id}
                variant={button.variant}
                onClick={button.onClick}
                disabled={isLoading || isChecking}
                className={cn(
                  "flex-1 md:flex-none min-w-[130px] md:min-w-[150px] h-11 md:h-12 gap-2 shadow-sm rounded-lg transition-all active:scale-95",
                  isPrimary ? "bg-primary hover:bg-primary/90 text-white" : "bg-surface-raised border-border-default hover:bg-primary/10",
                  isActive && "border-success/50 bg-success/5 text-success"
                )}
              >
                {btnContent}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
