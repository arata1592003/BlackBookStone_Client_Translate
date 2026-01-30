"use client";

import Link from "next/link";
import React from "react";
import { Tag } from "@/modules/tag/tag.type";

interface HomeHeaderTagsDropdownProps {
  tags: Tag[];
  isTagsDropdownOpen: boolean;
  setIsTagsDropdownOpen: (isOpen: boolean) => void;
}

export const HomeHeaderTagsDropdown: React.FC<HomeHeaderTagsDropdownProps> = ({
  tags,
  isTagsDropdownOpen,
  setIsTagsDropdownOpen,
}) => {
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsTagsDropdownOpen(true)}
      onMouseLeave={() => setIsTagsDropdownOpen(false)}
    >
      <span
        className="whitespace-nowrap cursor-pointer"
        onClick={() => setIsTagsDropdownOpen((v) => !v)} // hỗ trợ mobile
      >
        Thể loại
      </span>

      {isTagsDropdownOpen && tags.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
          <ul className="py-1 text-gray-700 max-h-96 overflow-y-auto">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/the-loai/${tag.name}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {tag.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
