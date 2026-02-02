'use client';

import { BookCabinetItem } from "@/components/features/user/BookCabinetItem";
import { useAuth } from "@/components/providers/AuthProvider";
import { getFollowedBooksForCurrentUser } from "@/modules/book/book.service";
import { UserBookItem } from "@/modules/book/book.types";
import { useEffect, useState } from "react";

export default function TuTruyenPage() {
  const { user, userProfile, isAuthenticated } = useAuth();
  const [books, setBooks] = useState<UserBookItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const followedBooks = await getFollowedBooksForCurrentUser(user);
        setBooks(followedBooks);
      } catch (error) {
        console.error("Failed to fetch followed books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = (id: string) => {
    console.log(`Deleting book with id: ${id}`);
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };

  return (
    <main className="flex flex-col items-start gap-5 p-2.5 relative flex-1 self-stretch w-full grow bg-surface-section">
      <div className="flex flex-col h-full items-start gap-5 px-[30px] py-5 relative self-stretch w-full">
        {loading ? (
          <div className="text-white text-center w-full">Đang tải tủ truyện...</div>
        ) : books.length === 0 ? (
          <div className="text-white text-center w-full">Tủ truyện của bạn đang trống.</div>
        ) : (
          books.map((book) => (
            <BookCabinetItem key={book.id} novel={book} onDelete={handleDelete} />
          ))
        )}
      </div>
    </main>
  );
}
