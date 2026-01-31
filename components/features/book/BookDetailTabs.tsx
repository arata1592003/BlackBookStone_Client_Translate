"use client";

import { ChapterList } from "@/components/features/chapter/ChapterList";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

type Props = {
  slug: string;
  description?: string;
  defaultTab?: TabKey;
};

type TabKey = "intro" | "chapters" | "comments";

const TABS: { id: TabKey; label: string }[] = [
  { id: "intro", label: "Giới thiệu" },
  { id: "chapters", label: "D.S Chương" },
  { id: "comments", label: "Bình luận" },
];

export const BookDetailTabs = ({
  slug,
  description,
  defaultTab = "chapters",
}: Props) => {
  const [tab, setTab] = useState<TabKey>(defaultTab);

  return (
    <section className="flex flex-col w-[902px] items-start relative flex-[0_0_auto] rounded-sm overflow-hidden border border-solid border-white">
      <nav
        className="flex w-[900px] items-start relative flex-[0_0_auto] border-b [border-bottom-style:solid] border-white"
        role="tablist"
      >
        {TABS.map((tabItem, index) => (
          <Button
            key={tabItem.id}
            variant="ghost"
            role="tab"
            aria-selected={tab === tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`rounded-none p-2.5 h-auto ${
              index < TABS.length - 1
                ? "border-r [border-right-style:solid] border-white"
                : ""
            } ${
              tab === tabItem.id
                ? "bg-surface-card font-bold"
                : "hover:bg-surface-hover"
            }`}
          >
            <span className="font-inter font-medium text-text-secondary text-base tracking-[0] leading-[normal] whitespace-nowrap">
              {tabItem.label}
            </span>
          </Button>
        ))}
      </nav>

      <div className="flex flex-col items-start gap-2.5 px-0 py-2.5 relative self-stretch w-full flex-[0_0_auto]">
        {tab === "intro" && (
          <div className="p-4 text-text-secondary text-base leading-relaxed font-roboto font-normal">
            {description || "Chưa có giới thiệu"}
          </div>
        )}

        {tab === "chapters" && <ChapterList slug={slug} />}

        {tab === "comments" && (
          <div className="p-4 text-text-secondary text-base opacity-70 font-roboto font-normal">
            Bình luận sẽ cập nhật
          </div>
        )}
      </div>
    </section>
  );
};
