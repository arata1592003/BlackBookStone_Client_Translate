"use client";

import { Tag } from "@/modules/tag/tag.type";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Tag as TagIcon } from "lucide-react";

interface HomeHeaderTagsDropdownProps {
  tags: Tag[];
  isTagsDropdownOpen: boolean; 
  setIsTagsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HomeHeaderTagsDropdown: React.FC<HomeHeaderTagsDropdownProps> = ({
  tags,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors h-6">
        <span className="whitespace-nowrap text-sm md:text-base">Thể loại</span>
        <ChevronDown size={16} />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
          <span className="whitespace-nowrap text-sm md:text-base">Thể loại</span>
          <ChevronDown size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-surface-card border-border-default max-h-[400px] overflow-hidden flex flex-col p-0" 
        align="start"
      >
        <div className="p-2 grid grid-cols-1 gap-1 overflow-y-auto">
          {tags.map((tag) => (
            <DropdownMenuItem key={tag.id} asChild className="cursor-pointer focus:bg-surface-hover">
              <Link href={`/the-loai/${tag.name}`} className="w-full flex items-center">
                <TagIcon className="mr-2 h-4 w-4" />
                <span>{tag.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
