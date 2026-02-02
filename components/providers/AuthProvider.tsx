'use client';

import { createContext, useContext } from 'react';
import type { AuthContextType } from '@/modules/auth/auth.type';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  user,
  userProfile,
  children,
}: {
  user: AuthContextType['user'];
  userProfile: AuthContextType['userProfile']
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}


