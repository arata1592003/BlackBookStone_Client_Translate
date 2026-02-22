"use client";

import { Button } from "@/components/ui/button";
import { BookCardWithAuthor } from "@/modules/book/book.types";
import { useEffect, useRef, useState } from "react";
import { BookCard } from "./BookCard";

const GAP = 24; // gap-6 (tương đương 24px nếu 1 unit là 4px)

type Props = {
  books: BookCardWithAuthor[];
};

export const HorizontalBookScroller = ({ books }: Props) => {
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const firstCardRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* -------------------------------
     1. Đo width card (responsive)
  -------------------------------- */
  useEffect(() => {
    if (!firstCardRef.current) {
      if (books.length === 0) {
        setCardWidth(0);
      }
      return;
    }

    const update = () => {
      if (firstCardRef.current) {
        setCardWidth(firstCardRef.current.getBoundingClientRect().width);
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(firstCardRef.current);

    return () => {
      ro.disconnect();
    };
  }, [books]);

  /* -------------------------------
     2. Tính max index
  -------------------------------- */
  const maxIndex = Math.max(books.length - 1, 0);

  const canGoPrev = index > 0;
  const canGoNext = index < maxIndex;

  /* -------------------------------
     3. Dịch đúng 1 card
  -------------------------------- */
  // Chuyển GAP từ đơn vị Tailwind sang pixel
  const translateX = index * (cardWidth + GAP);

  return (
    <div className="relative w-full">
      {/* Prev */}
      <Button
        variant="ghost"
        onClick={() => setIndex((i) => Math.max(i - 1, 0))}
        disabled={!canGoPrev}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/60 px-2 py-1 text-foreground disabled:opacity-30 h-auto"
      >
        ‹
      </Button>

      {/* Viewport */}
      <div ref={containerRef} className="overflow-hidden w-full">
        <div
          className="
            flex gap-6
            transition-transform
            duration-500
            ease-in-out
          "
          style={{
            transform: `translateX(-${translateX}px)`,
          }}
        >
          {books.map((book, i) => (
            <div key={book.id} ref={i === 0 ? firstCardRef : null}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>

      {/* Next */}
      <Button
        variant="ghost"
        onClick={() => setIndex((i) => Math.min(i + 1, maxIndex))}
        disabled={!canGoNext}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/60 px-2 py-1 text-foreground disabled:opacity-30 h-auto"
      >
        ›
      </Button>
    </div>
  );
};
