"use client";

import { createContext, useContext } from "react";
import type { AuthContextType } from "@/modules/auth/auth.type";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileById } from "@/modules/user/user.service";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/modules/user/user.type";

// Mở rộng AuthContextType để bao gồm trạng thái loading
interface IAuthContext extends AuthContextType {
  isProfileLoading: boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  // Sử dụng useQuery để fetch và cache userProfile
  const { data: userProfile, isLoading: isProfileLoading, isError } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      return await getUserProfileById(user.id);
    },
    // Chỉ chạy khi có user
    enabled: !!user,
    // Dữ liệu profile ít khi thay đổi, ta có thể đặt staleTime rất lâu
    // để tránh fetch lại không cần thiết.
    staleTime: Infinity,
    // Nếu có lỗi, không cần thử lại liên tục
    retry: false,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        // Cung cấp userProfile (có thể là null nếu đang load hoặc lỗi)
        userProfile: userProfile as UserProfile,
        isAuthenticated: !!user,
        isProfileLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
