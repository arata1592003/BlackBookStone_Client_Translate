"use client";

import { BookCabinetItem } from "@/components/features/user/BookCabinetItem";
import { useAuth } from "@/components/providers/AuthProvider";
import { getFollowedBooksForCurrentUser } from "@/modules/book/book.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function TuTruyenPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient(); // Lấy queryClient để vô hiệu hóa cache sau

  const { data: books, isLoading } = useQuery({
    queryKey: ['followedBooks', user?.id],
    queryFn: () => getFollowedBooksForCurrentUser(user),
    enabled: !!user,
  });

  const handleDelete = (id: string) => {
    // TODO: Triển khai logic xóa ở backend
    console.log(`Deleting book with id: ${id}`);
    
    // Giả sử xóa thành công, ta sẽ vô hiệu hóa query 'followedBooks'
    // để React Query tự động fetch lại dữ liệu mới.
    // Sau này khi có API xóa, bạn sẽ đặt lệnh này trong .then() hoặc sau khi await thành công.
    queryClient.invalidateQueries({ queryKey: ['followedBooks', user?.id] });
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
