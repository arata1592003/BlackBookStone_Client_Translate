import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Roboto } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "App";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} - Công cụ dịch thuật & Quản lý truyện AI chuyên nghiệp`,
    template: `%s | ${APP_NAME}`
  },
  description: `${APP_NAME} cung cấp giải pháp dịch thuật AI tiên tiến nhất dành cho dịch giả và tác giả. Quản lý kho truyện, dịch thuật tự động với ngữ cảnh sâu và xuất bản đa định dạng chỉ trong vài phút.`,
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: `${APP_NAME} - AI Translation Tool`,
    description: 'Nền tảng hỗ trợ dịch thuật và quản lý truyện online sử dụng trí tuệ nhân tạo.',
    url: SITE_URL,
    siteName: APP_NAME,
    locale: 'vi_VN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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

  if (process.env.NODE_ENV === "development") {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log(session);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": APP_NAME,
    "url": SITE_URL
  };

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable} antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider user={user}>{children}</AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <NextProgressBar />
        <GoogleAnalytics />
        <FloatingSupportButton supportUrl="https://omg10.com/4/10612805" />
      </body>
    </html>
  );
}
