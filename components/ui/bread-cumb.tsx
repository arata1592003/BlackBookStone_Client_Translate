"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  slug: string;
  bookTitle: string;
  chapterTitle: string;
  chapterNumber: number;
}

export const BreadcrumbResponsive = ({
  slug,
  bookTitle,
  chapterTitle,
}: Props) => {
  return (
    <Breadcrumb className="px-5 py-2.5 w-full rounded-sm border border-border-default bg-surface-card">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/trang-chu">Trang chủ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/truyen/${slug}`}>{bookTitle}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-text-primary font-semibold">
            {chapterTitle}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
