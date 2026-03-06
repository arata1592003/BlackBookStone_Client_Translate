"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { addRawChapterAction } from "@/app/actions/chapter";
import { useRouter } from "next/navigation";

interface AddSingleChapterProps {
  bookId: string;
  nextChapterNumber: number;
}

export const AddSingleChapter = ({ bookId, nextChapterNumber }: AddSingleChapterProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    chapterNumber: nextChapterNumber,
    title: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      setLoading(false);
      return;
    }

    try {
      const result = await addRawChapterAction({
        bookId,
        chapterNumber: formData.chapterNumber,
        title: formData.title,
        content: formData.content,
      });

      if (result.success) {
        setSuccess(`Đã thêm thành công Chương ${formData.chapterNumber}!`);
        setFormData({
          chapterNumber: formData.chapterNumber + 1,
          title: "",
          content: "",
        });
        // Tự động cuộn lên đầu để xem thông báo
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(result.error || "Có lỗi xảy ra khi thêm chương.");
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="border-b border-border-default pb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Thêm 1 chương mới</h2>
          <p className="text-sm text-text-muted">Nhập nội dung chương thô (tiếng Trung, Anh...) để tiến hành dịch thuật sau này.</p>
        </div>

        {success && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-2xl flex items-center gap-3 text-success animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={20} />
            <p className="text-sm font-bold">{success}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-2">
              <Label htmlFor="chapterNumber" className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">
                Số chương
              </Label>
              <Input
                id="chapterNumber"
                type="number"
                value={formData.chapterNumber}
                onChange={(e) => setFormData({ ...formData, chapterNumber: parseInt(e.target.value) || 0 })}
                className="h-12 bg-surface-raised border-border-default focus:border-primary rounded-xl"
                required
              />
            </div>
            
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">
                Tiêu đề Raw
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ví dụ: 第一章: 重生 (Đệ nhất chương: Trọng sinh)"
                className="h-12 bg-surface-raised border-border-default focus:border-primary rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">
              Nội dung chương (Raw)
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Dán nội dung bản gốc vào đây..."
              className="min-h-[400px] bg-surface-raised border-border-default focus:border-primary rounded-2xl font-mono text-sm leading-relaxed p-6"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={loading}
              className="h-12 px-8 rounded-xl font-bold"
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="h-12 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <span>Lưu chương</span>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
