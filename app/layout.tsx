import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Roboto } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import "./globals.css";
import NextProgressBar from "@/components/layout/NextProgressBar";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";
import { FloatingSupportButton } from "@/components/features/support/FloatingSupportButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hắc Thạch Thôn - Đọc truyện online miễn phí",
  description: "Đọc truyện online miễn phí với hàng ngàn đầu sách thuộc mọi thể loại. Cập nhật chương mới nhanh chóng và trải nghiệm đọc mượt mà trên Hắc Thạch Thôn.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // console.log(data);

  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider user={user}>{children}</AuthProvider>
        </QueryProvider>
        <NextProgressBar />
        <GoogleAnalytics />
        <FloatingSupportButton supportUrl="https://omg10.com/4/10612805" />
      </body>
    </html>
  );
}
