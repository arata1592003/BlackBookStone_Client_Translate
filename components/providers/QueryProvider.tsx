// components/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Component này sẽ cung cấp QueryClient cho toàn bộ ứng dụng
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Chúng ta sử dụng useState để đảm bảo QueryClient chỉ được tạo một lần
  // và không thay đổi giữa các lần re-render.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Cấu hình mặc định cho tất cả các query
        staleTime: 5 * 60 * 1000, // Dữ liệu sẽ được coi là "cũ" (stale) sau 5 phút
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
