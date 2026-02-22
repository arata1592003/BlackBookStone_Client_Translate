"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { List, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from "next/link";

interface Props {
  slug: string;
  prevChapter?: number | null;
  nextChapter?: number | null;
}

export const ChapterPagination = ({
  slug,
  prevChapter,
  nextChapter,
}: Props) => {
  return (
    <Pagination className="py-4">
      <PaginationContent className="gap-4">
        <PaginationItem>
          {prevChapter ? (
            <PaginationLink 
              asChild
              size="default"
              className="gap-1 pl-2.5 cursor-pointer"
            >
              <Link href={`/truyen/${slug}/chuong/${prevChapter}`}>
                <ChevronLeft className="h-4 w-4" />
                <span>Chương trước</span>
              </Link>
            </PaginationLink>
          ) : (
            <div className="flex items-center gap-1 pl-2.5 py-2 text-sm opacity-50 cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
              <span>Chương trước</span>
            </div>
          )}
        </PaginationItem>

        <PaginationItem>
          <Button variant="outline" size="icon" disabled className="bg-surface-raised">
            <List size={20} className="text-foreground" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          {nextChapter ? (
            <PaginationLink
              asChild
              size="default"
              className="gap-1 pr-2.5 cursor-pointer"
            >
              <Link href={`/truyen/${slug}/chuong/${nextChapter}`}>
                <span>Chương sau</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </PaginationLink>
          ) : (
            <div className="flex items-center gap-1 pr-2.5 py-2 text-sm opacity-50 cursor-not-allowed">
              <span>Chương sau</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
