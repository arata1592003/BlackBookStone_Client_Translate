"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { getUserStats } from "@/modules/user/user.service";
import { useEffect, useState } from "react";

interface StatCardData {
  title: string;
  value: string;
}

const StatCard = ({ title, value }: StatCardData) => (
  <article
    className="flex flex-col justify-between flex-1 grow rounded-lg overflow-hidden border border-solid border-border-subtle shadow-[0px_4px_12px_#000000] bg-cover bg-center relative self-stretch"
    style={{
      backgroundImage: "url('/dark-rock-wall-seamless-texture-free-105.png')",
    }}
  >
    <div className="flex flex-col justify-between px-5 py-[10px] flex-1 w-full">
      <h2
        className="text-xl font-bold text-white"
        style={{ whiteSpace: "pre-line" }}
      >
        {title}
      </h2>

      <p className="text-xl text-white">{value}</p>
    </div>
  </article>
);

export const UserStats = () => {
  const { user, userProfile, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<StatCardData[] | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getUserStats(user);
      if (data) {
        const formattedStats: StatCardData[] = [
          {
            title: "Đã cào",
            value: `${data.crawledCount} bộ`,
          },
          {
            title: "Đã dịch",
            value: `${data.translatedCount} bộ`,
          },
          {
            title: "Tổng chi phí",
            value: `${data.totalCost.toLocaleString()} đ`,
          },
          {
            title: "Số lượng giao dịch",
            value: `${data.transactionCount} lần`,
          },
        ];
        setStats(formattedStats);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <section
        className="h-[150px] items-center gap-20 px-[50px] py-2.5 w-full flex relative self-stretch"
        aria-label="Statistics loading"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex-1 self-stretch bg-gray-700 animate-pulse rounded-lg"
          ></div>
        ))}
      </section>
    );
  }

  return (
    <section
      className="h-[150px] items-center gap-20 px-[50px] py-2.5 w-full flex relative self-stretch"
      aria-label="Statistics"
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </section>
  );
};
