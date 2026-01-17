"use client";

import { HomeHeader } from "@/components/layout/HomeHeader";
import { HomeOverviewSection } from "@/components/sections/HomeOverviewSection";
import { getNewestBooks } from "@/features/book/book.service";
import { Book } from "@/features/book/book.types";
import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    getNewestBooks().then(setBooks);
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
