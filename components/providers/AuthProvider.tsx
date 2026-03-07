"use client";

import { createContext, useContext } from "react";
import type { AuthContextType } from "@/modules/auth/auth.type";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileById } from "@/modules/user/user.service";
import { getWalletBalance } from "@/modules/wallet/wallet.service";
import { User } from "@supabase/supabase-js";
import { UserProfile } from "@/modules/user/user.type";

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
  // 1. Query lấy thông tin profile
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      return await getUserProfileById(user.id);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  // 2. Query lấy số dư ví
  const { data: walletBalance, isLoading: isWalletLoading } = useQuery({
    queryKey: ["walletBalance", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      return await getWalletBalance(user.id);
    },
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 phút
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile: userProfile as UserProfile,
        walletBalance: walletBalance ?? 0,
        isAuthenticated: !!user,
        isProfileLoading: isProfileLoading || isWalletLoading,
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
