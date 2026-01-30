'use client';

import { UserHeader } from '@/components/features/user/UserHeader'; // New import
import { UserNavigationMenu } from '@/components/features/user/UserNavigationMenu';
import React from 'react';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full relative bg-black">
      <UserNavigationMenu />
      <div className="flex flex-col flex-1"> {/* New wrapper for header and content */}
        <UserHeader />
        <main className="flex-1 flex flex-col"> {/* main tag for semantic structure */}
          {children}
        </main>
      </div>
    </div>
  );
}
