"use client";

import Link from "next/link";
import { 
  Zap, 
  Shield, 
  Cpu, 
  Workflow, 
  ArrowRight, 
  Languages, 
  CloudUpload, 
  BookMarked,
  CheckCircle2,
  Table2,
  Settings2,
  Gift,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b border-border-default/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-secondary-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-screen-xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-success text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Gift size={14} className="fill-success" /> Tặng ngay 10.000đ khi tạo tài khoản trải nghiệm
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Dịch thuật & Quản lý truyện <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-accent">
              Chuẩn Xác Tới Từng Chữ
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Nền tảng dịch thuật AI chuyên sâu dành cho dịch giả. Tự động hóa quy trình dịch thuật, quản lý thực thể nhân vật và xuất bản đa định dạng chuyên nghiệp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button size="lg" className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black shadow-xl shadow-primary/20 group" asChild>
              <Link href="/dang-ky">
                Nhận 10k & Dịch ngay
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-border-default hover:bg-surface-raised text-lg font-bold" asChild>
              <Link href="#modes">Xem bảng giá</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. TRANSLATION MODES (Bảng giá & Chế độ) */}
      <section id="modes" className="py-24 bg-surface-card/30 border-b border-border-default/30">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-4 tracking-tight">Chế độ dịch linh hoạt</h2>
            <p className="text-text-secondary">Lựa chọn giải pháp phù hợp với nhu cầu và ngân sách của bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Mode */}
            <div className="p-8 rounded-[2.5rem] border border-border-default bg-surface-card relative overflow-hidden group hover:border-primary/30 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-text-primary mb-1">Basic Mode</h3>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Dịch nhanh siêu tốc</p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                  <Zap size={24} />
                </div>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-black text-text-primary">100đ</span>
                <span className="text-text-secondary font-bold"> / chương</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-text-secondary">
                  <Clock size={16} className="text-primary" /> ~30 giây / chương
                </li>
                <li className="flex items-center gap-3 text-sm text-text-secondary">
                  <CheckCircle2 size={16} className="text-success" /> Chất lượng ổn định
                </li>
                <li className="flex items-center gap-3 text-sm text-text-secondary">
                  <CheckCircle2 size={16} className="text-success" /> Phù hợp truyện hiện đại
                </li>
              </ul>
              <Button className="w-full h-12 rounded-xl bg-surface-raised hover:bg-foreground/5 text-foreground font-bold border border-border-default" asChild>
                <Link href="/dang-ky">Dùng thử Basic</Link>
              </Button>
            </div>

            {/* Advance Mode */}
            <div className="p-8 rounded-[2.5rem] border-2 border-primary bg-primary/5 relative overflow-hidden group shadow-2xl shadow-primary/10">
              <div className="absolute top-4 right-8 bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                Khuyên dùng
              </div>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black text-text-primary mb-1">Advance Mode</h3>
                  <p className="text-xs text-primary font-black uppercase tracking-widest">Ngữ cảnh chuyên sâu</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary text-primary-foreground">
                  <Cpu size={24} />
                </div>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-black text-text-primary">2.000đ</span>
                <span className="text-text-secondary font-bold"> / chương</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-text-secondary">
                  <Clock size={16} className="text-primary" /> ~1 phút / chương
                </li>
                <li className="flex items-center gap-3 text-sm text-text-secondary">
                  <CheckCircle2 size={16} className="text-success" /> Hiểu sâu ngữ cảnh, phong cách
                </li>
                <li className="flex items-center gap-3 text-sm text-text-secondary">
                  <CheckCircle2 size={16} className="text-success" /> Áp dụng Rule & Glossary nâng cao
                </li>
              </ul>
              <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-lg shadow-primary/20" asChild>
                <Link href="/dang-ky">Dùng thử Advance</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section id="features" className="py-32 bg-background">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-4 tracking-tight">Tính năng dành cho Dịch giả</h2>
            <p className="text-text-secondary text-lg">Kiểm soát hoàn toàn chất lượng bản dịch với các công cụ chuyên nghiệp</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Settings2,
                title: "Dịch theo yêu cầu",
                desc: "Tự định nghĩa Prompt riêng cho AI. Yêu cầu AI dịch theo văn phong kiếm hiệp, hiện đại hoặc hài hước tùy ý.",
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              },
              {
                icon: Table2,
                title: "Chỉnh sửa bảng tên",
                desc: "Quản lý danh sách nhân vật, địa danh và thuật ngữ (Glossary). Đảm bảo tên nhân vật luôn thống nhất từ đầu đến cuối truyện.",
                color: "text-purple-500",
                bg: "bg-purple-500/10"
              },
              {
                icon: Workflow,
                title: "Tách chương tự động",
                desc: "Đưa vào 1 file văn bản khổng lồ, AI sẽ tự động nhận diện và tách thành từng chương riêng biệt để quản lý.",
                color: "text-green-500",
                bg: "bg-green-500/10"
              },
              {
                icon: Shield,
                title: "Xuất bản đa định dạng",
                desc: "Hỗ trợ đóng gói truyện thành file EPUB chất lượng cao để đọc trên Kindle hoặc file DOCX để đăng tải.",
                color: "text-orange-500",
                bg: "bg-orange-500/10"
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl border border-border-default bg-surface-card hover:border-primary/30 transition-all group">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", f.bg, f.color)}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-lg font-black text-text-primary mb-3 tracking-tight leading-tight">{f.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="py-32">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="bg-gradient-to-r from-primary to-primary-accent rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <Zap size={400} className="absolute -top-40 -left-40" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 tracking-tight">Trải nghiệm miễn phí ngay</h2>
            <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
              Tặng ngay <span className="text-white font-black underline">10.000đ</span> vào tài khoản. Đủ để bạn dịch thử 100 chương Basic hoặc 5 chương Advance chất lượng cao.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-primary hover:bg-white/90 text-xl font-black shadow-xl group" asChild>
                <Link href="/dang-ky">
                  Đăng ký nhận 10k
                  <ArrowRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <p className="text-sm font-bold text-white/60">Đăng nhập nhanh qua Google • Không cần cài đặt</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
