"use client";

import { 
  FileUp, 
  AlertCircle, 
  Info,
  X,
  FileText,
  Loader2,
  CheckCircle2,
  Trash2,
  UploadCloud,
  FileArchive
} from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { addRawChapterAction } from "@/app/actions/chapter";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import mammoth from "mammoth";

interface AddMultipleChaptersProps {
  bookId: string;
  nextChapterNumber: number;
}

interface ChapterPreview {
  id: string;
  fileName: string;
  chapterNumber: number;
  title: string;
  content: string;
  status: "pending" | "processing" | "success" | "error";
  error?: string;
}

export const AddMultipleChapters = ({ bookId, nextChapterNumber }: AddMultipleChaptersProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [previews, setPreviews] = useState<ChapterPreview[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  // Hàm trích xuất số chương từ tên file
  const extractChapterNumber = (fileName: string): number => {
    // Tìm số đầu tiên trong tên file
    const match = fileName.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const cleanTitle = (fileName: string): string => {
    return fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();
  };

  const processFile = async (file: File): Promise<ChapterPreview[]> => {
    const fileName = file.name.toLowerCase();
    
    // Xử lý ZIP
    if (fileName.endsWith(".zip")) {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      const extractedFiles: ChapterPreview[] = [];
      
      for (const [path, zipEntry] of Object.entries(content.files)) {
        if (zipEntry.dir || path.startsWith("__MACOSX")) continue;
        
        const entryName = zipEntry.name.toLowerCase();
        if (entryName.endsWith(".txt")) {
          const text = await zipEntry.async("string");
          extractedFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            fileName: zipEntry.name,
            chapterNumber: extractChapterNumber(zipEntry.name),
            title: cleanTitle(zipEntry.name),
            content: text,
            status: "pending"
          });
        } else if (entryName.endsWith(".docx")) {
          const buffer = await zipEntry.async("arraybuffer");
          const result = await mammoth.extractRawText({ arrayBuffer: buffer });
          extractedFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            fileName: zipEntry.name,
            chapterNumber: extractChapterNumber(zipEntry.name),
            title: cleanTitle(zipEntry.name),
            content: result.value,
            status: "pending"
          });
        }
      }
      return extractedFiles;
    } 
    
    // Xử lý TXT
    if (fileName.endsWith(".txt")) {
      const text = await file.text();
      return [{
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        chapterNumber: extractChapterNumber(file.name),
        title: cleanTitle(file.name),
        content: text,
        status: "pending"
      }];
    }

    // Xử lý DOCX
    if (fileName.endsWith(".docx")) {
      const buffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      return [{
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        chapterNumber: extractChapterNumber(file.name),
        title: cleanTitle(file.name),
        content: result.value,
        status: "pending"
      }];
    }

    return [];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsParsing(true);
    const newPreviews: ChapterPreview[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const processed = await processFile(files[i]);
        newPreviews.push(...processed);
      } catch (err) {
        console.error(`Lỗi khi xử lý file ${files[i].name}:`, err);
      }
    }

    // Sắp xếp theo số chương
    newPreviews.sort((a, b) => a.chapterNumber - b.chapterNumber);
    
    setPreviews(prev => [...prev, ...newPreviews]);
    setIsParsing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePreview = (id: string) => {
    setPreviews(prev => prev.filter(p => p.id !== id));
  };

  const updatePreview = (id: string, updates: Partial<ChapterPreview>) => {
    setPreviews(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleUploadAll = async () => {
    if (previews.length === 0) return;
    
    setIsUploading(true);
    setOverallProgress(0);
    
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
      <div className="border-b border-border-default pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Thêm nhiều chương</h2>
          <p className="text-sm text-text-muted">Tải lên danh sách file hoặc file ZIP. Hệ thống sẽ tự nhận diện chương.</p>
        </div>
        
        <div className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.docx,.zip"
            multiple
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isParsing || isUploading}
            variant="outline"
            className="h-11 px-6 border-primary text-primary hover:bg-primary/5 rounded-xl font-bold flex items-center gap-2"
          >
            {isParsing ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
            Chọn file
          </Button>
          
          {previews.length > 0 && (
            <Button 
              onClick={handleUploadAll} 
              disabled={isUploading}
              className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20"
            >
              {isUploading ? `Đang xử lý ${overallProgress}%` : `Lưu tất cả (${previews.length})`}
            </Button>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2 animate-in fade-in duration-300">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-primary">
            <span>Tiến độ tổng quát</span>
            <span>{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      )}

      {previews.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border-default rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
        >
          <div className="w-20 h-20 bg-surface-raised rounded-full flex items-center justify-center text-text-muted group-hover:text-primary group-hover:scale-110 transition-all">
            <FileArchive size={40} />
          </div>
          <div className="max-w-xs space-y-1">
            <p className="font-bold text-text-primary">Kéo thả hoặc nhấn để chọn file</p>
            <p className="text-xs text-text-muted leading-relaxed">Hỗ trợ định dạng .txt, .docx hoặc file .zip chứa nhiều chương.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-surface-raised rounded-2xl border border-border-default overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background/50 border-b border-border-default text-text-muted font-bold uppercase tracking-tighter text-[10px]">
                <tr>
                  <th className="px-6 py-4 text-left w-20">Chương</th>
                  <th className="px-6 py-4 text-left">Tiêu đề chương (Raw)</th>
                  <th className="px-6 py-4 text-left hidden md:table-cell">Tên file</th>
                  <th className="px-6 py-4 text-center w-32">Trạng thái</th>
                  <th className="px-6 py-4 text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/50">
                {previews.map((p) => (
                  <tr key={p.id} className="group hover:bg-background/30 transition-colors">
                    <td className="px-6 py-4">
                      <Input
                        type="number"
                        value={p.chapterNumber}
                        onChange={(e) => updatePreview(p.id, { chapterNumber: parseInt(e.target.value) || 0 })}
                        className="h-9 w-20 bg-background text-center font-bold"
                        disabled={isUploading || p.status === "success"}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        value={p.title}
                        onChange={(e) => updatePreview(p.id, { title: e.target.value })}
                        className="h-9 bg-background font-medium"
                        disabled={isUploading || p.status === "success"}
                      />
                    </td>
                    <td className="px-6 py-4 text-text-muted text-xs italic hidden md:table-cell">
                      {p.fileName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {p.status === "pending" && <span className="text-[10px] font-bold text-text-faint uppercase">Sẵn sàng</span>}
                      {p.status === "processing" && <Loader2 size={16} className="animate-spin text-primary mx-auto" />}
                      {p.status === "success" && <CheckCircle2 size={18} className="text-success mx-auto" />}
                      {p.status === "error" && (
                        <div className="flex flex-col items-center gap-1">
                          <AlertCircle size={18} className="text-destructive" />
                          <span className="text-[8px] text-destructive font-bold uppercase truncate max-w-[80px]">{p.error}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => removePreview(p.id)}
                        disabled={isUploading || p.status === "success"}
                        className="p-2 text-text-muted hover:text-destructive transition-colors disabled:opacity-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
            <Info className="text-primary shrink-0" size={20} />
            <p className="text-xs text-text-secondary leading-relaxed">
              <strong>Mẹo:</strong> Hệ thống tự động lấy số chương từ tên file. Bạn có thể sửa lại số chương hoặc tiêu đề trực tiếp trong bảng trước khi nhấn lưu.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
