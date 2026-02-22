"use client";

import { ChapterList } from "@/components/features/chapter/ChapterList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  return (
    <section className="w-full mt-6">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-surface-card border border-border-default rounded-t-lg rounded-b-none h-auto p-0 overflow-hidden">
          {TABS.map((tabItem) => (
            <TabsTrigger
              key={tabItem.id}
              value={tabItem.id}
              className="py-3 text-lg font-medium text-text-secondary data-[state=active]:bg-surface-raised data-[state=active]:text-primary rounded-none border-r border-border-default last:border-r-0 transition-all"
            >
              {tabItem.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="bg-surface-card border-x border-b border-border-default rounded-b-lg p-4 min-h-[200px]">
          <TabsContent value="intro" className="mt-0 outline-none">
            <div className="text-text-secondary text-base leading-relaxed font-roboto font-normal">
              {description || "Chưa có giới thiệu"}
            </div>
          </TabsContent>
          <TabsContent value="chapters" className="mt-0 outline-none">
            <ChapterList slug={slug} />
          </TabsContent>
          <TabsContent value="comments" className="mt-0 outline-none">
            <div className="text-text-secondary text-base opacity-70 font-roboto font-normal">
              Bình luận sẽ cập nhật
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
};
