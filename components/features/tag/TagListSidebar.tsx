"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllTags } from "@/modules/tag/tag.service";
import Link from "next/link"; // Assuming tags might link to a tag-specific page

export const TagListSidebar = () => {
  const {
    data: tags,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allTags"],
    queryFn: () => getAllTags(30), // Pass limit of 30
    staleTime: 5 * 60 * 1000, // Cache tags for 5 minutes
  });

  if (isLoading) {
    return <div>Đang tải thể loại...</div>;
  }

  if (error) {
    return <div>Lỗi khi tải thể loại: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {tags?.map((tag) => (
        <Link
          key={tag.id}
          href={`/the-loai/${tag.name}`}
          className="block px-2 py-1 rounded-md border border-text-muted/20 bg-surface-card hover:bg-surface-secondary text-text-primary hover:text-primary-accent text-sm transition-colors hover:border-primary"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
};
