"use client";

import { HomeOverviewSection } from "@/components/features/home/HomeOverviewSection";
import { getHotBookList, getNewestBookList, getCompletedBookList } from "@/modules/book/book.service"; // Import all three
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: hotBooks, isLoading: isLoadingHotBooks } = useQuery({
    queryKey: ["hotBooks"],
    queryFn: () => getHotBookList(14),
    staleTime: 5 * 60 * 1000,
  });

  const { data: newChapterBooks, isLoading: isLoadingNewChapterBooks } = useQuery({
    queryKey: ["newChapterBooks"],
    queryFn: () => getNewestBookList(), // getNewestBookList doesn't take a limit
    staleTime: 5 * 60 * 1000,
  });

  const { data: completedBooks, isLoading: isLoadingCompletedBooks } = useQuery({
    queryKey: ["completedBooks"],
    queryFn: () => getCompletedBookList(20), // Fetch 20 completed books
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = isLoadingHotBooks || isLoadingNewChapterBooks || isLoadingCompletedBooks;

  // Provide empty arrays if data is still loading
  const hotBookListData = hotBooks || [];
  const newChapterBookListData = newChapterBooks || [];
  const completedBookListData = completedBooks || [];

  return (
    <main
      className="
        max-w-screen-2xl
        mx-auto
      "
    >
      {isLoading && <div>Đang tải...</div>}
      <HomeOverviewSection
        hotBooks={hotBookListData}
        newChapterBooks={newChapterBookListData}
        completedBooks={completedBookListData} // Pass completed books
      />
    </main>
  );
}
