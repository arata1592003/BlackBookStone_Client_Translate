"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import { getUserStats } from "@/modules/user/user.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface StatCardData {
  title: string;
  value: string;
}

const StatCard = ({ title, value }: StatCardData) => (
  <article
    className="flex flex-col justify-between rounded-lg overflow-hidden border border-solid border-border-subtle shadow-[0px_4px_12px_var(--color-shadow-default)] bg-cover bg-center relative min-h-[100px] md:min-h-[120px] transition-all duration-500"
    style={{
      backgroundImage: "var(--image-texture)",
    }}
  >
    <div className="flex flex-col justify-between px-3 md:px-5 py-3 md:py-4 flex-1 w-full bg-background/40">
      <h2
        className="text-sm md:text-lg font-bold text-foreground leading-tight"
        style={{ whiteSpace: "pre-line" }}
      >
        {title}
      </h2>

      <p className="text-sm md:text-xl font-semibold text-foreground mt-2">{value}</p>
    </div>
  </article>
);

export const UserStats = () => {
  const { user } = useAuth();

  const { data: rawStats, isLoading } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: () => getUserStats(user),
    enabled: !!user,
  });

  const stats = useMemo(() => {
    if (!rawStats) return null;
    return [
      { title: "Đã cào", value: `${rawStats.crawledCount} bộ` },
      { title: "Đã dịch", value: `${rawStats.translatedCount} bộ` },
      { title: "Tổng chi phí", value: `${rawStats.totalCost.toLocaleString()} đ` },
      { title: "Giao dịch", value: `${rawStats.transactionCount} lần` },
    ];
  }, [rawStats]);

  if (isLoading || !stats) {
    return (
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-4 md:px-8 py-4 w-full" aria-label="Statistics loading">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[100px] md:h-[120px] rounded-lg w-full" />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-4 md:px-8 py-4 w-full" aria-label="Statistics">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </section>
  );
};
