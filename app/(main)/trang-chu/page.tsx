"use client";

import { HomeOverviewSection } from "@/components/features/home/HomeOverviewSection";
import { getNewestBookList } from "@/modules/book/book.service";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: books, isLoading } = useQuery({
    // Dữ liệu này không phụ thuộc vào user, nên key có thể là một chuỗi đơn giản
    queryKey: ["newestBooks"],
    queryFn: getNewestBookList,
    // Dữ liệu sách mới có thể thay đổi, nên staleTime có thể ngắn hơn
    staleTime: 1 * 60 * 1000, // 1 phút
  });

  // HomeOverviewSection cần một mảng, nên ta sẽ truyền một mảng rỗng
  // nếu books chưa có dữ liệu hoặc đang loading.
  const bookListData = books || [];

  return (
    <main
      className="
        max-w-screen-2xl
        mx-auto
      "
    >
      {/* Có thể thêm một chỉ báo loading ở đây nếu muốn */}
      {/* {isLoading && <div>Đang tải...</div>} */}
      <HomeOverviewSection books={bookListData} />
    </main>
  );
}
