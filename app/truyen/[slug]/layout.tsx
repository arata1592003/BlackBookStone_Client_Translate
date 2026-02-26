"use client";

import { HomeHeader } from "@/components/layout/HomeHeader";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHeader />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
