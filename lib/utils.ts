import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function formatCurrency(amount: number | string) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount));
}

export function formatNumber(num: number | string) {
  return new Intl.NumberFormat("vi-VN").format(Number(num));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVisiblePages(
  current: number,
  total: number,
  delta = 2,
): (number | "...")[] {
  const pages: (number | "...")[] = [];
  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total) {
    if (end < total - 1) pages.push("...");
    pages.push(total);
  }

  return pages.filter((item, index) => pages.indexOf(item) === index);
}

