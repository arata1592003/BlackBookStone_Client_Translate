"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserBookItem } from "@/modules/book/book.types";
import { timeAgo } from "@/utils/date";
import { Eye, SquarePen, Trash, Download, Share2, Share, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toggleBookPublishAction } from "@/app/actions/book";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DownloadBookDialog } from "../book/DownloadBookDialog";

interface UserBookCardProps {
  novel: UserBookItem;
}

const backgroundPath = "/dark-rock-wall-seamless-texture-free-105.png";

export const UserBookCard = ({ novel }: UserBookCardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleNovelAction = (novelId: string, action: string) => {
    console.log(`Novel ${novelId}: ${action} action triggered`);
  };

  const handleTogglePublish = async () => {
    if (isPublishing) return;

    setIsPublishing(true);
    try {
      const result = await toggleBookPublishAction(novel.id, novel.isPublished);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["ownedBooks", user?.id] });
      } else {
        alert(result.error || "Có lỗi xảy ra khi cập nhật trạng thái.");
      }
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
      alert("Lỗi kết nối hệ thống. Vui lòng thử lại sau.");
    } finally {
      setIsPublishing(false);
    }
  };

  const actionText = novel.isPublished ? "ngừng chia sẻ" : "chia sẻ";

  return (
    <article
      key={novel.id}
      onClick={() => router.push(`/tai-khoan/truyen/${novel.id}`)}
      className="group flex flex-col md:flex-row items-stretch gap-0 md:gap-5 relative w-full rounded-lg overflow-hidden border border-solid border-border-default shadow-[0px_4px_12px_var(--color-shadow-default)] cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.005] hover:shadow-xl hover:border-primary bg-surface-card"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundPath || "/placeholder.jpg"}
          alt={novel.title || "Book Cover"}
          fill
          style={{ objectFit: "cover" }}
          className="opacity-40 md:opacity-100"
        />
      </div>

      <div className="relative h-full z-10 flex flex-col md:flex-row items-stretch gap-0 md:gap-5 w-full">
        {/* Main Content Area */}
        <div className="flex items-stretch flex-1 min-w-0 bg-background/40 md:bg-transparent">
          {/* Left Actions (Desktop Only) */}
          <div className="hidden md:flex self-stretch flex-col border-r border-border-default/30 w-14">
            <div
              className="flex-1 flex items-center justify-center cursor-pointer transition-colors hover:bg-primary/70 group px-4"
              onClick={(e) => { e.stopPropagation(); handleNovelAction(novel.id, "view"); }}
              title="Đọc truyện"
            >
              <Eye size={20} className="text-foreground/70 group-hover:text-foreground" />
            </div>
            <Separator className="bg-foreground/20" />
            <div
              className="flex-1 flex items-center justify-center cursor-pointer transition-colors hover:bg-destructive/70 group"
              onClick={(e) => { e.stopPropagation(); handleNovelAction(novel.id, "delete"); }}
              title="Xóa truyện"
            >
              <Trash size={20} className="text-foreground/70 group-hover:text-foreground" />
            </div>
          </div>

          {/* Text Info */}
          <div className="flex flex-col items-start justify-between p-3 md:px-5 md:py-[10px] flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 self-stretch w-full mb-1">
              <h3 className="font-roboto font-bold text-foreground text-lg md:text-xl tracking-tight leading-tight truncate max-w-[250px] md:max-w-none">
                {novel.title}
              </h3>

              {novel.status && (
                <Badge 
                  variant="outline"
                  className={cn(
                    "text-[10px] md:text-xs px-1.5 py-0 border-none",
                    novel.status === "Đang ra" 
                      ? "bg-[var(--color-book-card-variant1-bg)] text-[var(--color-book-card-variant1-text)]"
                      : novel.status === "Hoàn thành"
                      ? "bg-[var(--color-book-card-variant2-bg)] text-[var(--color-book-card-variant2-text)]"
                      : "bg-[var(--color-book-card-variant3-bg)] text-[var(--color-book-card-variant3-text)]"
                  )}
                >
                  {novel.status}
                </Badge>
              )}
              <div
                className="p-1 hover:bg-primary/20 rounded transition-colors cursor-pointer"
                onClick={(e) => { e.stopPropagation(); handleNovelAction(novel.id, "edit"); }}
                title="Sửa thông tin"
              >
                <SquarePen size={18} className="text-foreground" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-5 self-stretch w-full mb-2">
              <p className="font-roboto font-normal text-foreground text-xs md:text-base opacity-90">
                Tình trạng: <span className="font-semibold">{novel.translatedChapters}/{novel.totalChapters}</span>
              </p>

              <p className="font-roboto font-normal text-foreground text-[10px] md:text-sm opacity-70 italic md:not-italic">
                Cập nhật: {timeAgo(novel.updatedAt)}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 items-center mt-auto">
              {novel.genres.slice(0, 3).map((genre, index) => (
                <Badge key={index} variant="secondary" className="bg-foreground/10 text-foreground font-normal text-[10px] md:text-xs">
                  {genre}
                </Badge>
              ))}
              {novel.genres.length > 3 && (
                <span className="text-[10px] opacity-50">+{novel.genres.length - 3}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Area (Responsive) */}
        <nav
          className="flex md:flex-col items-center gap-2 p-3 md:p-2.5 md:w-[130px] bg-background/60 md:bg-transparent border-t md:border-t-0 md:border-l border-border-default/30"
          aria-label={`Actions for ${novel.title}`}
        >
          {/* Mobile Only Actions: Read and Delete */}
          <div className="flex md:hidden items-center gap-2 mr-2 border-r border-border-default/30 pr-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); handleNovelAction(novel.id, "view"); }}
              className="bg-primary/20 border-primary/30 text-primary-accent"
            >
              <Eye size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); handleNovelAction(novel.id, "delete"); }}
              className="bg-destructive/20 border-destructive/30 text-destructive"
            >
              <Trash size={18} />
            </Button>
          </div>

          <Button
            size="sm"
            onClick={(e) => { 
              e.stopPropagation(); 
              setIsDownloadModalOpen(true);
            }}
            className="flex-1 md:w-full bg-secondary-accent hover:bg-secondary-accent/90 text-foreground font-bold text-xs md:text-base h-9 md:h-10"
          >
            <Download size={16} className="md:size-5" />
            <span className="ml-1.5 md:ml-2">Tải</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                disabled={isPublishing}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "flex-1 md:w-full font-bold text-xs md:text-base h-9 md:h-10 transition-all",
                  novel.isPublished 
                    ? "bg-success hover:bg-success/90 text-foreground" 
                    : "bg-primary hover:bg-primary/90 text-foreground"
                )}
              >
                {isPublishing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : novel.isPublished ? (
                  <>
                    <Share2 size={16} className="md:size-5" />
                    <span className="ml-1.5 md:ml-2 whitespace-nowrap">Đã share</span>
                  </>
                ) : (
                  <>
                    <Share size={16} className="md:size-5" />
                    <span className="ml-1.5 md:ml-2 whitespace-nowrap">Share</span>
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận {actionText}</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn {actionText} truyện <strong>{novel.title}</strong> này không? 
                  {novel.isPublished 
                    ? " Truyện sẽ không còn hiển thị công khai trên trang chủ." 
                    : " Truyện sẽ được hiển thị công khai để mọi người cùng đọc."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleTogglePublish} className="bg-primary hover:bg-primary/90">
                  Xác nhận
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </nav>
      </div>

      <DownloadBookDialog 
        bookId={novel.id}
        bookTitle={novel.title || "Truyen"}
        isOpen={isDownloadModalOpen}
        onOpenChange={setIsDownloadModalOpen}
      />
    </article>
  );
};
