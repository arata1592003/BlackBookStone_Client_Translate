'use client';

import { HomeHeader } from "@/components/layout/HomeHeader";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HomeHeader />
      {children}
    </>
  );
}