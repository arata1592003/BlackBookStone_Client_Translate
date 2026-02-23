"use client";

import { useEffect, useRef } from "react";
import { incrementChapterViewAction } from "@/app/actions/chapter";

interface Props {
  chapterId: string;
}

/**
 * Thành phần ẩn dùng để theo dõi và tăng lượt xem chương.
 * Chỉ thực hiện tăng view một lần duy nhất khi người dùng vào trang.
 */
export const ChapterViewTracker = ({ chapterId }: Props) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    
    const trackView = async () => {
      try {
        await incrementChapterViewAction(chapterId);
        hasTracked.current = true;
      } catch (error) {
        console.error("View tracking failed:", error);
      }
    };

    // Delay nhẹ một chút để tránh tính view ảo từ bot hoặc tải trang nhanh
    const timer = setTimeout(trackView, 3000); 

    return () => clearTimeout(timer);
  }, [chapterId]);

  return null; // Không hiển thị UI
};
