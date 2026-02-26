"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { 
  Facebook, 
  Mail, 
  Info, 
  ShieldCheck, 
  FileText, 
  AlertTriangle,
  ChevronRight
} from "lucide-react";

export const Footer = () => {
  const { appName, logoSrc } = useTheme();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Trang chủ", href: "/trang-chu" },
    { label: "Truyện mới", href: "/truyen-moi" },
    { label: "Truyện Hot", href: "/truyen-hot" },
    { label: "Truyện Full", href: "/truyen-full" },
    { label: "Sắp xếp", href: "/sap-xep" },
  ];

  const policyLinks = [
    { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
    { label: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
    { label: "Miễn trừ trách nhiệm", href: "/mien-tru-trach-nhiem" },
  ];

  return (
    <footer className="bg-surface-card border-t border-border-default mt-auto">
      <div className="max-w-screen-2xl mx-auto px-4 py-12 md:px-8 xl:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
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
              {appName} là nền tảng đọc truyện online miễn phí, cập nhật nhanh nhất các bộ truyện dịch, truyện convert chất lượng cao. Trải nghiệm đọc mượt mà, giao diện tối ưu cho mọi thiết bị.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/your-fanpage" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-surface-raised text-text-muted hover:text-primary-accent hover:bg-primary/10 transition-all shadow-sm"
                aria-label="Facebook Fanpage"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="mailto:contact@blackstonebook.com" 
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
              Chính sách & Quy định
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

          {/* 4. DISCLAIMER / NOTICE */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-text-primary border-l-4 border-primary-accent pl-3">
              Cảnh báo bản quyền
            </h4>
            <div className="p-4 rounded-xl bg-surface-raised/50 border border-border-default space-y-3">
              <div className="flex items-center gap-2 text-warning font-bold text-xs uppercase">
                <Info size={14} /> Lưu ý
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Mọi nội dung trên website được thu thập và tổng hợp từ internet. Chúng tôi không sở hữu bản quyền của các tác phẩm này. Nếu bạn là chủ sở hữu bản quyền và muốn gỡ bỏ nội dung, vui lòng liên hệ qua Email hoặc Fanpage.
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-12 pt-8 border-t border-border-default flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-text-muted font-medium uppercase tracking-wider">
          <div>
            &copy; {currentYear} <span className="text-primary-accent">{appName}</span>. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by BlackStone Engine</span>
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
