"use client";

import { HomeOverviewSection } from "@/components/features/home/HomeOverviewSection";
import { getNewestBookList } from "@/modules/book/book.service";
import { BookCardWithAuthor } from "@/modules/book/book.types";
import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState<BookCardWithAuthor[]>([]);

  useEffect(() => {
    getNewestBookList().then(setBooks);
  }, []);

  return (
    <main
      className="
        max-w-screen-2xl
        mx-auto
      ">
      <HomeOverviewSection books={books} />
    </main>
  );
}
