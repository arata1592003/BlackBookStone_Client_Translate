"use client";

import {
  Scissors,
  Info,
  FileText,
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Hash,
  Type,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import mammoth from "mammoth";
import { addRawChapterAction } from "@/app/actions/chapter";
import { useRouter } from "next/navigation";

interface AddSplitFileProps {
  bookId: string;
  nextChapterNumber: number;
}

interface SplitChapterPreview {
  id: string;
  chapterNumber: number;
  title: string;
  content: string;
  status: "pending" | "processing" | "success" | "error";
  error?: string;
}

export const AddSplitFile = ({
  bookId,
  nextChapterNumber,
}: AddSplitFileProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sourceFile, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [isReading, setIsReading] = useState(false);

  const [splitPattern, setSplitPattern] = useState<string>(
    "(^|\\n)(第[\\d一二三四五六七八九十百千万]+章|Chương\\s+\\d+|Chapter\\s+\\d+)",
  );
  const [previews, setPreviews] = useState<SplitChapterPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    setIsReading(true);
    setPreviews([]);

    try {
      let text = "";
      if (file.name.toLowerCase().endsWith(".txt")) {
        text = await file.text();
      } else if (file.name.toLowerCase().endsWith(".docx")) {
        const buffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        text = result.value;
      }
      setRawText(text);
      // Tự động split với pattern mặc định
      console.log(splitPattern);
      performSplit(text, splitPattern);
    } catch (err) {
      console.error("Lỗi khi đọc file:", err);
      alert("Không thể đọc file. Vui lòng thử lại.");
    } finally {
      setIsReading(false);
    }
  };

  const performSplit = (text: string, patternStr: string) => {
    if (!text || !patternStr) return;

    try {
      // Loại bỏ inline flags như (?m), (?i) vì JS không hỗ trợ cú pháp này trong chuỗi pattern
      const cleanedPattern = patternStr.replace(/\(\?[gimsuyx]+\)/g, "");

      // Sử dụng flag 'gm' để hỗ trợ tìm kiếm toàn cục và khớp đầu dòng (^)
      const regex = new RegExp(cleanedPattern, "gm");
      const matches = Array.from(text.matchAll(regex));

      if (matches.length === 0) {
        alert("Không tìm thấy chương nào với quy tắc hiện tại.");
        return;
      }

      const newPreviews: SplitChapterPreview[] = [];

      for (let i = 0; i < matches.length; i++) {
        const startIdx = matches[i].index!;
        const endIdx =
          i < matches.length - 1 ? matches[i + 1].index! : text.length;

        const fullMatch = matches[i][0].replace(/^\n|\n$/g, "").trim(); // Làm sạch tiêu đề
        const chapterContent = text
          .substring(startIdx + matches[i][0].length, endIdx)
          .trim();

        // Trích xuất số từ tiêu đề nếu có
        const numMatch = fullMatch.match(/(\d+)/);
        const chapterNum = numMatch
          ? parseInt(numMatch[1])
          : nextChapterNumber + i;

        newPreviews.push({
          id: Math.random().toString(36).substr(2, 9),
          chapterNumber: chapterNum,
          title: fullMatch,
          content: chapterContent,
          status: "pending",
        });
      }

      setPreviews(newPreviews);
    } catch (err) {
      alert("Quy tắc (Regex) không hợp lệ.");
    }
  };

  const handleManualSplit = () => {
    console.log(splitPattern);
    performSplit(rawText, splitPattern);
  };

  const updatePreview = (id: string, updates: Partial<SplitChapterPreview>) => {
    setPreviews((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const removePreview = (id: string) => {
    setPreviews((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUploadAll = async () => {
    if (previews.length === 0) return;

    setIsUploading(true);
    let completed = 0;
    const total = previews.length;

    for (const preview of previews) {
      if (preview.status === "success") {
        completed++;
        continue;
      }

      updatePreview(preview.id, { status: "processing" });

      try {
        const result = await addRawChapterAction({
          bookId,
          chapterNumber: preview.chapterNumber,
          title: preview.title,
          content: preview.content,
        });

        if (result.success) {
          updatePreview(preview.id, { status: "success" });
          completed++;
        } else {
          updatePreview(preview.id, { status: "error", error: result.error });
        }
      } catch (err: any) {
        updatePreview(preview.id, { status: "error", error: err.message });
      }

      setOverallProgress(Math.round((completed / total) * 100));
    }

    setIsUploading(false);
    if (completed === total) {
      router.refresh();
    }
  };

  return (
    <div className="p-8 md:p-10 space-y-8">
      <div className="border-b border-border-default pb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Tách chương từ 1 file lớn
        </h2>
        <p className="text-sm text-text-muted">
          Hệ thống sẽ tự động nhận diện ranh giới các chương dựa trên quy tắc
          bạn đặt ra.
        </p>
      </div>

      {!sourceFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border-default rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.docx"
            className="hidden"
          />
          <div className="w-20 h-20 bg-surface-raised rounded-full flex items-center justify-center text-text-muted group-hover:text-orange-500 group-hover:scale-110 transition-all">
            <Scissors size={40} />
          </div>
          <div className="max-w-xs space-y-1">
            <p className="font-bold text-text-primary">
              Tải lên file nguồn (.txt hoặc .docx)
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              Chọn file chứa toàn bộ các chương gộp chung.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface-raised p-6 rounded-2xl border border-border-default space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Hash size={16} className="text-orange-500" /> Cấu hình tách
                </h3>
                <button
                  onClick={() => {
                    setFile(null);
                    setRawText("");
                    setPreviews([]);
                  }}
                  className="text-[10px] font-bold text-destructive hover:underline"
                >
                  Đổi file
                </button>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="pattern"
                  className="text-xs font-bold text-text-secondary"
                >
                  Quy tắc nhận diện (Regex)
                </Label>
                <div className="space-y-3">
                  <Input
                    id="pattern"
                    value={splitPattern}
                    onChange={(e) => setSplitPattern(e.target.value)}
                    className="bg-background font-mono text-xs"
                    placeholder="Regex pattern..."
                  />
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Tiếng Việt", p: "(^|\\n)(Chương\\s+\\d+)" },
                      {
                        label: "Tiếng Trung",
                        p: "(^|\\n)(第[\\d一二三四五六七八九十百千万]+章)",
                      },
                      { label: "Tiếng Anh", p: "(^|\\n)(Chapter\\s+\\d+)" },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() => setSplitPattern(btn.p)}
                        className="text-[10px] bg-background border border-border-default px-2 py-1 rounded hover:border-primary transition-all"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleManualSplit}
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold"
                disabled={isReading}
              >
                {isReading ? (
                  <Loader2 size={18} className="animate-spin mr-2" />
                ) : (
                  <Scissors size={18} className="mr-2" />
                )}
                Thực hiện tách
              </Button>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
              <Info className="text-primary shrink-0 mt-0.5" size={18} />
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Hệ thống sẽ cắt nội dung từ vị trí khớp quy tắc này đến vị trí
                khớp tiếp theo. <br />
                <br />
                <strong>Lưu ý:</strong> Nên sử dụng Regex bắt đầu bằng{" "}
                <code>(^|\n)</code> để khớp ở đầu dòng.
              </p>
            </div>
          </div>

          {/* Preview List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                Kết quả tách{" "}
                <span className="text-sm font-medium text-text-muted">
                  ({previews.length} chương)
                </span>
              </h3>
              {previews.length > 0 && (
                <Button
                  onClick={handleUploadAll}
                  disabled={isUploading}
                  className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-xl font-bold"
                >
                  {isUploading ? `Đang lưu ${overallProgress}%` : `Lưu tất cả`}
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={overallProgress} className="h-1.5" />
              </div>
            )}

            {previews.length > 0 ? (
              <div className="bg-surface-raised rounded-2xl border border-border-default overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-background/50 sticky top-0 z-10 border-b border-border-default text-text-muted font-bold uppercase text-[10px]">
                      <tr>
                        <th className="px-6 py-4 text-left w-20">Số</th>
                        <th className="px-6 py-4 text-left">
                          Tiêu đề nhận diện
                        </th>
                        <th className="px-6 py-4 text-center w-24">
                          Trạng thái
                        </th>
                        <th className="px-6 py-4 text-right w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default/50">
                      {previews.map((p) => (
                        <tr
                          key={p.id}
                          className="group hover:bg-background/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <Input
                              type="number"
                              value={p.chapterNumber}
                              onChange={(e) =>
                                updatePreview(p.id, {
                                  chapterNumber: parseInt(e.target.value) || 0,
                                })
                              }
                              className="h-8 w-16 bg-background text-center text-xs font-bold"
                              disabled={isUploading || p.status === "success"}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <Input
                              value={p.title}
                              onChange={(e) =>
                                updatePreview(p.id, { title: e.target.value })
                              }
                              className="h-8 bg-background text-xs font-medium"
                              disabled={isUploading || p.status === "success"}
                            />
                          </td>
                          <td className="px-6 py-4 text-center">
                            {p.status === "pending" && (
                              <span className="text-[9px] font-bold text-text-faint uppercase">
                                Sẵn sàng
                              </span>
                            )}
                            {p.status === "processing" && (
                              <Loader2
                                size={14}
                                className="animate-spin text-primary mx-auto"
                              />
                            )}
                            {p.status === "success" && (
                              <CheckCircle2
                                size={16}
                                className="text-success mx-auto"
                              />
                            )}
                            {p.status === "error" && (
                              <span title={p.error}>
                                <AlertCircle
                                  size={16}
                                  className="text-destructive mx-auto"
                                />
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => removePreview(p.id)}
                              className="p-1.5 text-text-muted hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                              disabled={isUploading || p.status === "success"}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="h-64 border-2 border-dashed border-border-default rounded-3xl flex flex-center justify-center items-center text-text-muted italic text-sm">
                Đang chờ tách nội dung...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
