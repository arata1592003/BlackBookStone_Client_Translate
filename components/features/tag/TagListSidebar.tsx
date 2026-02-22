"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllTags } from "@/modules/tag/tag.service";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Hash, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const TagListSidebar = () => {
  const {
    data: tags,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allTags"],
    queryFn: () => getAllTags(30),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-sm italic p-4">Không thể tải danh mục.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quick Filter Header */}
      <div className="flex items-center gap-2 px-1">
        <Sparkles size={16} className="text-primary-accent" />
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Khám phá thể loại</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tags?.map((tag) => (
          <Link
            key={tag.id}
            href={`/the-loai/${tag.name}`}
            className={cn(
              "group relative flex items-center gap-2 p-2.5 rounded-xl border border-border-default/50",
              "bg-surface-card/50 backdrop-blur-sm transition-all duration-300",
              "hover:border-primary/50 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5",
              "active:scale-95"
            )}
          >
            {/* Tag Icon Decoration */}
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-surface-raised group-hover:bg-primary/20 transition-colors">
              <Hash size={14} className="text-text-muted group-hover:text-primary-accent" />
            </div>

            <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors truncate">
              {tag.name}
            </span>

            {/* Hover Indicator */}
            <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-1 h-1 rounded-full bg-primary-accent shadow-[0_0_8px_var(--color-primary-accent)]" />
            </div>
          </Link>
        ))}
      </div>
      
      <Link 
        href="/tat-ca-the-loai" 
        className="text-center py-2 text-xs font-bold text-primary-accent hover:underline mt-2 uppercase tracking-widest"
      >
        Xem tất cả danh mục
      </Link>
    </div>
  );
};
