"use client";

import { BookCabinetItem } from "@/components/features/user/BookCabinetItem";
import { useAuth } from "@/components/providers/AuthProvider";
import { getFollowedBooksForCurrentUser } from "@/modules/book/book.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleFollowBookAction } from "@/app/actions/book";

export default function TuTruyenPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery({
    queryKey: ['followedBooks', user?.id],
    queryFn: () => getFollowedBooksForCurrentUser(user),
    enabled: !!user,
  });

  const handleDelete = async (id: string) => {
    try {
      const result = await toggleFollowBookAction(id);
      if (result.success) {
        // Cập nhật lại cache của React Query
        queryClient.invalidateQueries({ queryKey: ['followedBooks', user?.id] });
      } else {
        alert(result.error || "Không thể xóa truyện.");
      }
    } catch (error) {
      console.error("Xóa truyện thất bại:", error);
      alert("Lỗi kết nối. Vui lòng thử lại sau.");
    }
  };

  return (
    <main className="flex flex-col items-start gap-4 md:gap-5 p-2 md:p-2.5 relative flex-1 self-stretch w-full grow bg-surface-section overflow-x-hidden">
      <div className="flex flex-col h-full items-start gap-4 md:gap-5 px-2 sm:px-4 md:px-[30px] py-4 md:py-5 relative self-stretch w-full">
        {isLoading ? (
          <div className="text-foreground text-center w-full">
          </div>
        ) : !books || books.length === 0 ? (
          <div className="text-foreground text-center w-full">
          </div>
        ) : (
          books.map((book) => (
            <BookCabinetItem
              key={book.id}
              novel={book}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </main>
  );
}
