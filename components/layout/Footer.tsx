"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { 
  Facebook, 
  Mail, 
  ShieldCheck, 
  FileText, 
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export const Footer = () => {
  const { appName, logoSrc } = useTheme();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Trang chủ", href: "/trang-chu" },
    { label: "Bàn làm việc", href: "/tai-khoan/ban-lam-viec" },
    { label: "Nạp tiền", href: "/tai-khoan/nap-tien" },
  ];

  const policyLinks = [
    { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
    { label: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
    { label: "Miễn trừ trách nhiệm", href: "/mien-tru-trach-nhiem" },
  ];

  return (
    <footer className="bg-surface-card border-t border-border-default mt-auto">
      <div className="max-w-screen-2xl mx-auto px-4 py-12 md:px-8 xl:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* 1. BRAND SECTION */}
          <div className="space-y-6">
            <Link href="/trang-chu" className="inline-block">
              <Image
                src={logoSrc}
                alt={appName}
                width={180}
                height={60}
                className="h-auto w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              {appName} là nền tảng AI tiên tiến hỗ trợ dịch thuật và quản lý truyện online. Chúng tôi cung cấp công cụ mạnh mẽ giúp dịch giả tối ưu hóa quy trình làm việc và nâng cao chất lượng bản dịch.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61585366575326" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-surface-raised text-text-muted hover:text-primary-accent hover:bg-primary/10 transition-all shadow-sm"
                aria-label="Facebook Fanpage"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="mailto:hacthachtruyen@gmail.com" 
                className="p-2 rounded-full bg-surface-raised text-text-muted hover:text-primary-accent hover:bg-primary/10 transition-all shadow-sm"
                aria-label="Email Contact"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-text-primary border-l-4 border-primary-accent pl-3">
              Liên kết nhanh
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-text-muted hover:text-primary-accent flex items-center gap-2 transition-colors group"
                  >
                    <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. POLICIES */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-text-primary border-l-4 border-primary-accent pl-3">
              Chính sách & Pháp lý
            </h4>
            <ul className="space-y-3">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-text-muted hover:text-primary-accent flex items-center gap-2 transition-colors"
                  >
                    {link.label === "Chính sách bảo mật" && <ShieldCheck size={14} />}
                    {link.label === "Điều khoản sử dụng" && <FileText size={14} />}
                    {link.label === "Miễn trừ trách nhiệm" && <AlertTriangle size={14} />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-12 pt-8 border-t border-border-default flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-text-muted font-medium uppercase tracking-wider">
          <div className="flex flex-col gap-1">
            <div>
              &copy; {currentYear} <span className="text-primary-accent font-bold">{appName}</span>. All Rights Reserved.
            </div>
            <div className="lowercase text-[10px] opacity-60">contact: hacthachtruyen@gmail.com</div>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <ExternalLink size={12} />
              AI Translation Platform
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-success" /> 
              An toàn & Bảo mật
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
