"use client";

import { HomeOverviewSection } from "@/components/features/home/HomeOverviewSection";
import { HomeHeader } from "@/components/layout/HomeHeader";
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
      <HomeHeader />
      <HomeOverviewSection books={books} />
    </main>
  );
}
