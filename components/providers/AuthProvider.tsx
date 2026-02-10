"use client";

import { createContext, useContext } from "react";
import type { AuthContextType } from "@/modules/auth/auth.type";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileById } from "@/modules/user/user.service";
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
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      return await getUserProfileById(user.id);
    },
    enabled: !!user,
    staleTime: Infinity,
    retry: false,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
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
