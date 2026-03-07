"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import {
  ManagedBookDetails,
  ManagedChapter,
  ChapterContent,
} from "@/modules/book/book.types";
import {
  TranslationRule,
  TranslationMode,
  TranslationJobLog,
  JobDetailResponse,
} from "@/modules/translate/translate.type";
import {
  getRulesLibraryAction,
  getMyRuleSetsAction,
  saveMyRuleSetAction,
} from "@/app/actions/rule";
import {
  startBookTranslationAction,
  getJobStatusAction,
  cancelJobAction,
  getRunningJobsAction,
} from "@/app/actions/translate";
import { deleteChaptersTranslationAction } from "@/app/actions/chapter";

import { TranslationRuleDialog } from "./TranslationRuleDialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Layers,
  Play,
  Square,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  PlusCircle,
  Save,
  FolderOpen,
  Settings2,
  Library,
  Eye,
  Trash2,
  X,
  ClipboardList,
  Info,
  Terminal,
  Bug,
  FileEdit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DebugKnowledgeModal } from "./DebugKnowledgeModal";

// --- SUB-COMPONENTS ---

const RuleSnippetItem = memo(
  ({
    rule,
    isSelected,
    onToggle,
    onEdit,
    onDelete,
  }: {
    rule: TranslationRule;
    isSelected: boolean;
    onToggle: (id: string) => void;
    onEdit: (rule: TranslationRule) => void;
    onDelete: (id: string) => void;
  }) => (
    <div className="relative group/rule">
      <div
        onClick={() => onToggle(rule.id)}
        className={cn(
          "p-3 rounded-xl border transition-all cursor-pointer bg-surface-raised relative",
          isSelected
            ? "bg-primary-accent/5 border-primary-accent shadow-sm"
            : "border-white/10 hover:border-primary-accent/30",
        )}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                isSelected
                  ? "bg-primary-accent border-primary-accent"
                  : "border-border-default",
              )}
            >
              {isSelected && <CheckCircle2 size={10} className="text-white" />}
            </div>
            <span
              className={cn(
                "text-xs font-bold",
                isSelected ? "text-primary-accent" : "text-text-primary",
              )}
            >
              {rule.name}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
          {rule.content}
        </p>
      </div>

      {/* Edit/Delete Actions - Only for user rules */}
      {rule.user_id && (
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/rule:opacity-100 transition-opacity z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(rule);
            }}
            className="p-1 bg-background/80 hover:bg-background rounded-md border border-white/10 text-text-secondary hover:text-primary transition-colors"
            title="Sửa quy tắc"
          >
            <FileEdit size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(rule.id);
            }}
            className="p-1 bg-background/80 hover:bg-background rounded-md border border-white/10 text-text-secondary hover:text-destructive transition-colors"
            title="Xóa quy tắc"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  ),
);
RuleSnippetItem.displayName = "RuleSnippetItem";

const ChapterGridItem = memo(
  ({
    chapter,
    isSelected,
    jobStatus,
    onToggle,
    onView,
    onDebug,
  }: {
    chapter: ManagedChapter;
    isSelected: boolean;
    jobStatus?: "PENDING" | "RUNNING" | "DONE" | "ERROR" | "CANCELLED";
    onToggle: (id: string) => void;
    onView: (ch: ManagedChapter) => void;
    onDebug: (ch: ManagedChapter) => void;
  }) => {
    const isTranslated = chapter.status || jobStatus === "DONE";
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-3 rounded-xl border transition-all relative overflow-hidden group/item h-full",
          isSelected
            ? "bg-primary/5 border-primary shadow-md shadow-primary/5"
            : "bg-surface-card border-white/10 hover:border-primary-accent/40 hover:bg-surface-raised shadow-sm",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className="flex items-center gap-2 cursor-pointer min-w-0 flex-1"
            onClick={() => onToggle(chapter.id)}
          >
            <div
              className={cn(
                "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all mt-0.5",
                isSelected
                  ? "bg-primary border-primary"
                  : "border-border-default",
              )}
            >
              {isSelected && <CheckCircle2 size={10} className="text-white" />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate">
                Chương {chapter.chapterNumber}
              </span>
              <span className="text-[10px] text-text-muted truncate">
                {chapter.title || "Không có tiêu đề"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
            {isTranslated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDebug(chapter);
                }}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Bug size={14} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView(chapter);
              }}
              className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Eye size={14} />
            </Button>
          </div>
        </div>
        <div className="mt-auto pt-2 border-t border-border-default/30 flex items-center justify-between">
          {jobStatus === "RUNNING" ? (
            <span className="bg-primary/10 text-primary text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase flex items-center gap-1">
              <Loader2 size={8} className="animate-spin" /> Đang dịch
            </span>
          ) : jobStatus === "ERROR" ? (
            <span className="bg-destructive/10 text-destructive text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase">
              Lỗi
            </span>
          ) : isTranslated ? (
            <span className="bg-success/10 text-success text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase">
              Đã dịch
            </span>
          ) : (
            <span className="bg-text-faint/10 text-text-faint text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase">
              Chưa dịch
            </span>
          )}
          <span className="text-[9px] text-text-muted italic">
            {chapter.totalWordsRaw || 0} chữ
          </span>
        </div>
      </div>
    );
  },
);
ChapterGridItem.displayName = "ChapterGridItem";

// --- MAIN COMPONENT ---

export const TranslationManager = ({
  book: initialBook,
}: {
  book: ManagedBookDetails;
}) => {
  const [book, setBook] = useState<ManagedBookDetails>(initialBook);
  const [library, setLibrary] = useState<TranslationRule[]>([]);
  const [ruleSets, setRuleSets] = useState<any[]>([]);
  const [selectedRuleIds, setSelectedRuleIds] = useState<Set<string>>(
    new Set(),
  );
  const [newSetName, setNewSetName] = useState("");

  const [mode, setMode] = useState<TranslationMode>("BASIC");
  const [manualPrompt, setManualPrompt] = useState("");
  const [selectedChapterIds, setSelectedSelectedChapterIds] = useState<
    Set<string>
  >(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const CHAPTERS_PER_PAGE = 100;

  // Job & Polling State
  const [isInitialChecking, setIsInitialChecking] = useState(true);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobDetail, setJobDetail] = useState<JobDetailResponse | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [jobLogs, setJobLogs] = useState<TranslationJobLog[]>([]);
  const [progress, setProgress] = useState(0);

  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TranslationRule | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [viewingChapter, setViewingChapter] = useState<ManagedChapter | null>(
    null,
  );
  const [viewContent, setViewContent] = useState<ChapterContent | null>(null);
  const [isFetchingContent, setIsFetchingChapterContent] = useState(false);
  const [activeTab, setActiveTab] = useState<"translated" | "raw">(
    "translated",
  );

  // Debug State
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  const [debuggingChapter, setDebuggingChapter] =
    useState<ManagedChapter | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadLibrary(), loadRuleSets()]);
      await checkRunningJobs();
      setIsInitialChecking(false);
    };
    init();

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const checkRunningJobs = async () => {
    const res = await getRunningJobsAction();
    if (res.success && res.data?.items) {
      for (const job of res.data.items) {
        // Lấy chi tiết để kiểm tra book_id
        const detailRes = await getJobStatusAction(job.id);
        if (detailRes.success && detailRes.data?.book_id === book.id) {
          startPolling(job.id);
          return true;
        }
      }
    }
    return false;
  };

  const startPolling = (jobId: string) => {
    setCurrentJobId(jobId);
    setIsTranslating(true);

    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    const poll = async () => {
      const res = await getJobStatusAction(jobId);
      if (res.success && res.data) {
        const data = res.data;
        setJobDetail(data);
        setProgress(Math.round((data.completed / data.total) * 100));

        // Cập nhật logs
        const logs: TranslationJobLog[] = data.chapters
          .filter((c) => c.status !== "PENDING")
          .map((c) => ({
            chapter_number: c.chapter_number,
            status:
              c.status === "DONE"
                ? "success"
                : c.status === "RUNNING"
                  ? "processing"
                  : "error",
            message:
              c.error_message ||
              (c.status === "DONE" ? "Hoàn thành" : "Đang xử lý..."),
          }));
        setJobLogs(logs);

        if (
          data.status === "DONE" ||
          data.status === "ERROR" ||
          data.status === "CANCELLED"
        ) {
          setIsTranslating(false);
          setIsStopping(false);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

          if (data.status === "DONE") {
            // Refresh book chapters to show "Translated" status
            window.location.reload();
          }
        }
      }
    };

    poll(); // Gọi ngay lập tức
    pollIntervalRef.current = setInterval(poll, 3000); // Mỗi 3 giây
  };

  const handleEditRule = useCallback((rule: TranslationRule) => {
    setEditingRule(rule);
    setIsRuleDialogOpen(true);
  }, []);

  const handleDeleteRule = useCallback(async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mảnh ghép quy tắc này?")) return;
    const { deleteTranslationRuleAction } = await import("@/app/actions/rule");
    const res = await deleteTranslationRuleAction(id);
    if (res.success) {
      loadLibrary();
      setSelectedRuleIds((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    } else {
      alert(res.error);
    }
  }, []);

  const loadLibrary = async () => {
    const res = await getRulesLibraryAction();
    if (res.success) setLibrary(res.data);
  };

  const loadRuleSets = async () => {
    const res = await getMyRuleSetsAction();
    if (res.success) setRuleSets(res.data);
  };

  const totalPages = Math.ceil(book.chapters.length / CHAPTERS_PER_PAGE);
  const paginatedChapters = useMemo(() => {
    const start = (currentPage - 1) * CHAPTERS_PER_PAGE;
    return book.chapters.slice(start, start + CHAPTERS_PER_PAGE);
  }, [book.chapters, currentPage]);

  const toggleRule = useCallback((id: string) => {
    setSelectedRuleIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  const toggleChapter = useCallback((id: string) => {
    setSelectedSelectedChapterIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  const applyRuleSet = useCallback(
    (setId: string) => {
      const set = ruleSets.find((s) => s.id === setId);
      if (set)
        setSelectedRuleIds(
          new Set(set.translation_rule_set_items.map((i: any) => i.rule_id)),
        );
    },
    [ruleSets],
  );

  const handleSaveSet = async () => {
    if (!newSetName.trim() || selectedRuleIds.size === 0) return;
    const res = await saveMyRuleSetAction(
      newSetName,
      Array.from(selectedRuleIds),
    );
    if (res.success) {
      setNewSetName("");
      loadRuleSets();
      alert("Đã lưu!");
    }
  };

  const handleViewContent = useCallback(async (chapter: ManagedChapter) => {
    setViewingChapter(chapter);
    setViewContent(null);
    setIsFetchingChapterContent(true);
    setActiveTab(chapter.status ? "translated" : "raw");
    try {
      const response = await fetch(`/api/chapters/${chapter.id}/content`);
      const res = await response.json();
      if (res.success && res.data) setViewContent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingChapterContent(false);
    }
  }, []);

  const handleDebugChapter = useCallback((chapter: ManagedChapter) => {
    setDebuggingChapter(chapter);
    setIsDebugModalOpen(true);
  }, []);

  const handleDeleteSelectedTranslations = async () => {
    const idsToDelete = Array.from(selectedChapterIds).filter((id) => {
      const ch = book.chapters.find((c) => c.id === id);
      return ch?.status === true;
    });
    if (idsToDelete.length === 0) return;
    if (!confirm(`Xóa bản dịch của ${idsToDelete.length} chương?`)) return;
    const res = await deleteChaptersTranslationAction(idsToDelete);
    if (res.success) {
      setBook((prev) => ({
        ...prev,
        chapters: prev.chapters.map((c) =>
          idsToDelete.includes(c.id) ? { ...c, status: false } : c,
        ),
      }));
      setSelectedSelectedChapterIds(new Set());
    } else alert(res.error);
  };

  const startTranslation = async () => {
    setIsTranslating(true);
    setJobLogs([]);
    setProgress(0);

    const res = await startBookTranslationAction({
      type: "BOOK_TRANSLATE",
      book_id: book.id,
      mode: mode,
      max_retry: 3,
      rule_ids: Array.from(selectedRuleIds),
    });

    if (res.success && res.data) {
      startPolling(res.data.job_id);
    } else {
      alert(res.error || "Không thể bắt đầu tiến trình dịch thuật.");
      setIsTranslating(false);
    }
  };

  const handleStopTranslation = async () => {
    if (!currentJobId) return;
    setIsStopping(true);
    const res = await cancelJobAction(currentJobId);
    if (!res.success) {
      alert(res.error || "Không thể hủy tiến trình.");
      setIsStopping(false);
    }
  };

  // Helper to get chapter status from current job
  const getChapterJobStatus = (chapterNumber: number) => {
    if (!jobDetail) return undefined;
    const chapterJob = jobDetail.chapters.find(
      (c) => c.chapter_number === chapterNumber,
    );
    return chapterJob?.status;
  };

  return (
    <div className="flex flex-col h-full bg-surface-section text-text-primary">
      <section className="bg-surface-card border-b border-border-default p-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isInitialChecking ? (
              <Button
                disabled
                className="bg-surface-raised text-text-muted font-bold h-11 px-6 border border-border-default"
              >
                <Loader2 className="mr-2 animate-spin" size={18} /> Đang kiểm
                tra trạng thái...
              </Button>
            ) : !isTranslating ? (
              <Button
                onClick={startTranslation}
                className="bg-primary hover:bg-primary/90 font-bold h-11 px-6 shadow-lg shadow-primary/20"
              >
                <Play className="mr-2" size={18} /> Bắt đầu dịch thuật AI
              </Button>
            ) : (
              <Button
                onClick={handleStopTranslation}
                variant="destructive"
                disabled={isStopping}
                className="font-bold h-11 px-6"
              >
                {isStopping ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={18} /> Đang
                    dừng...
                  </>
                ) : (
                  <>
                    <Square className="mr-2" size={18} /> Dừng dịch
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              disabled={isInitialChecking}
              onClick={() =>
                window.open(
                  `/tai-khoan/truyen/${book.id}/them-chuong`,
                  "_blank",
                )
              }
              className="border-border-default hover:bg-surface-raised font-bold h-11"
            >
              <PlusCircle className="mr-2 text-success" size={18} /> Thêm chương
            </Button>
            <Button
              variant="outline"
              disabled={isInitialChecking}
              onClick={() => setIsConfigModalOpen(true)}
              className="border-border-default hover:bg-surface-raised font-bold h-11"
            >
              <Settings2 className="mr-2 text-primary-accent" size={18} /> Thiết
              lập AI
            </Button>
          </div>
          {(isTranslating || jobLogs.length > 0) && (
            <div className="flex-1 max-w-md flex items-center gap-4 bg-background/50 px-4 py-2 rounded-xl border border-border-default">
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
                  <span className="text-text-muted">Tiến độ: {progress}%</span>
                  <button
                    onClick={() => setIsLogModalOpen(true)}
                    className="text-primary-accent hover:underline flex items-center gap-1"
                  >
                    <Terminal size={12} /> Nhật ký chi tiết
                  </button>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {selectedChapterIds.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelectedTranslations}
                className="h-9 font-bold uppercase animate-in fade-in zoom-in-95"
              >
                <Trash2 size={16} className="mr-1.5" /> Xóa (
                {selectedChapterIds.size})
              </Button>
            )}
            <div className="flex bg-background/50 rounded-lg border border-border-default p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSelectedSelectedChapterIds(
                    new Set(book.chapters.map((c) => c.id)),
                  )
                }
                className="h-7 text-[10px] font-bold"
              >
                Tất cả
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSelectedChapterIds(new Set())}
                className="h-7 text-[10px] font-bold text-text-muted"
              >
                Bỏ chọn
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 overflow-hidden flex flex-col max-w-screen-2xl mx-auto w-full p-6">
        <section className="flex-1 flex flex-col min-h-0 bg-surface-card rounded-2xl border border-border-default shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList size={22} className="text-text-muted" /> Quản lý
              danh sách chương{" "}
              <span className="text-sm font-medium text-text-muted ml-2">
                ({book.chapters.length} ch)
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-text-faint uppercase">
                Đến trang:
              </label>
              <Input
                type="number"
                min={1}
                max={totalPages}
                className="h-8 w-16 bg-background border-border-default text-xs text-center"
                placeholder={currentPage.toString()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = parseInt((e.target as HTMLInputElement).value);
                    if (!isNaN(v))
                      setCurrentPage(Math.max(1, Math.min(totalPages, v)));
                  }
                }}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-4">
              {paginatedChapters.map((chapter) => (
                <ChapterGridItem
                  key={chapter.id}
                  chapter={chapter}
                  isSelected={selectedChapterIds.has(chapter.id)}
                  jobStatus={getChapterJobStatus(chapter.chapterNumber)}
                  onToggle={toggleChapter}
                  onView={handleViewContent}
                  onDebug={handleDebugChapter}
                />
              ))}
            </div>
          </ScrollArea>
          {totalPages > 1 && (
            <div className="mt-6 pt-4 border-t border-border-default flex items-center justify-between">
              <div className="text-[11px] text-text-muted font-bold uppercase tracking-widest">
                Trang {currentPage} / {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="h-9 px-4 text-xs font-bold border-border-default"
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="h-9 px-4 text-xs font-bold border-border-default"
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* MODALS (Log, Config, View, Rules) - Giữ nguyên logic UI cũ nhưng map data mới */}
      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent className="max-w-xl bg-surface-card text-text-primary border-border-default flex flex-col h-[70vh]">
          <DialogHeader className="border-b border-border-default pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Terminal className="text-primary-accent" size={20} /> Nhật ký
              dịch thuật chi tiết
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {jobLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-text-muted italic text-sm py-20">
                  Đang chờ AI bắt đầu công việc...
                </div>
              ) : (
                jobLogs.map((log, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-xs border-b border-border-default/30 pb-2 last:border-none animate-in fade-in slide-in-from-top-1"
                  >
                    {log.status === "processing" ? (
                      <Loader2
                        size={14}
                        className="animate-spin text-primary mt-0.5"
                      />
                    ) : log.status === "success" ? (
                      <CheckCircle2 size={14} className="text-success mt-0.5" />
                    ) : log.status === "error" ? (
                      <AlertCircle
                        size={14}
                        className="text-destructive mt-0.5"
                      />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-text-muted/20 flex items-center justify-center mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-bold">
                        {log.chapter_number > 0
                          ? `Chương ${log.chapter_number}`
                          : "Hệ thống"}
                      </span>
                      <span
                        className={cn(
                          "text-[10px]",
                          log.status === "error"
                            ? "text-destructive"
                            : "text-text-muted",
                        )}
                      >
                        {log.message}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="p-4 border-t border-border-default bg-background/30">
            <Button
              onClick={() => setIsLogModalOpen(false)}
              className="w-full font-bold"
            >
              Quay lại quản lý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="max-w-2xl bg-surface-card text-text-primary border-border-default">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Layers className="text-primary-accent" size={24} /> Cấu hình AI
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4 py-4">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">
                  Chế độ
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(["BASIC", "ADVANCE"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left group",
                        mode === m
                          ? "bg-primary/5 border-primary"
                          : "bg-background border-border-default hover:border-primary/30",
                      )}
                    >
                      <div
                        className={cn(
                          "font-bold",
                          mode === m ? "text-primary" : "text-text-primary",
                        )}
                      >
                        {m === "BASIC" ? "Cơ bản" : "Nâng cao"}
                      </div>
                      <div className="text-[10px] text-text-muted mt-1">
                        {m === "BASIC" ? "Dịch nhanh." : "Ngữ cảnh sâu."}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                  <FolderOpen size={12} /> Bộ quy tắc đã lưu
                </label>
                <div className="flex flex-wrap gap-2">
                  {ruleSets.map((set) => (
                    <button
                      key={set.id}
                      onClick={() => applyRuleSet(set.id)}
                      className="px-3 py-2 rounded-lg bg-background border border-border-default text-xs font-bold hover:bg-primary/10 transition-all"
                    >
                      {set.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Library size={14} className="text-primary-accent" /> Thư
                    viện mảnh ghép quy tắc
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRuleDialogOpen(true)}
                    className="h-8 text-primary-accent hover:bg-primary/10 font-bold"
                  >
                    <Plus size={16} className="mr-1" /> Thêm
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {library.map((rule) => (
                    <RuleSnippetItem
                      key={rule.id}
                      rule={rule}
                      isSelected={selectedRuleIds.has(rule.id)}
                      onToggle={toggleRule}
                      onEdit={handleEditRule}
                      onDelete={handleDeleteRule}
                    />
                  ))}
                </div>
              </div>
              {selectedRuleIds.size > 0 && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                  <label className="text-[10px] font-bold uppercase text-primary-accent flex items-center gap-1">
                    <Save size={12} /> Lưu tổ hợp (Rule Set)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={newSetName}
                      onChange={(e) => setNewSetName(e.target.value)}
                      placeholder="Tên bộ..."
                      className="h-10 bg-background"
                    />
                    <Button
                      onClick={handleSaveSet}
                      className="h-10 bg-primary px-6"
                    >
                      Lưu
                    </Button>
                  </div>
                </div>
              )}

              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Info className="text-primary shrink-0 mt-0.5" size={18} />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">
                      Ghi chú:
                    </p>
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      Các quy tắc bạn chọn sẽ được kết hợp thành một Prompt duy
                      nhất gửi tới AI. Hệ thống sẽ dịch tự động toàn bộ các
                      chương chưa có bản dịch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4 border-t border-border-default">
            <Button
              onClick={() => setIsConfigModalOpen(false)}
              className="w-full bg-primary hover:bg-primary/90 h-12 font-bold text-lg"
            >
              Xong
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!viewingChapter}
        onOpenChange={(open) => !open && setViewingChapter(null)}
      >
        <DialogContent className="max-w-5xl w-full h-[90vh] bg-surface-card text-text-primary border-border-default flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-border-default flex flex-col items-start space-y-1">
            <DialogTitle className="text-xl">
              Chương {viewingChapter?.chapterNumber}: {viewingChapter?.title}
            </DialogTitle>
            <p className="text-xs text-text-muted">
              Nội dung chi tiết chương truyện
            </p>
          </DialogHeader>
          <div className="flex border-b border-border-default bg-background/50">
            <button
              className={cn(
                "flex-1 py-4 text-sm font-bold transition-all border-b-2",
                activeTab === "translated"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted",
              )}
              onClick={() => setActiveTab("translated")}
            >
              BẢN DỊCH AI
            </button>
            <button
              className={cn(
                "flex-1 py-4 text-sm font-bold transition-all border-b-2",
                activeTab === "raw"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted",
              )}
              onClick={() => setActiveTab("raw")}
            >
              BẢN GỐC (RAW)
            </button>
          </div>
          <ScrollArea className="flex-1 p-10 bg-background/30">
            {isFetchingContent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-text-muted">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-bold">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <div className="text-lg leading-relaxed whitespace-pre-wrap font-sans text-text-secondary selection:bg-primary/30">
                  {activeTab === "translated"
                    ? viewContent?.contentTranslated || "Chưa có bản dịch."
                    : viewContent?.contentRaw || "Không tìm thấy dữ liệu gốc."}
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="p-4 border-t border-border-default bg-background/50">
            <Button
              onClick={() => setViewingChapter(null)}
              variant="ghost"
              className="font-bold border border-border-default px-8"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TranslationRuleDialog
        isOpen={isRuleDialogOpen}
        onOpenChange={(open) => {
          setIsRuleDialogOpen(open);
          if (!open) setEditingRule(null);
        }}
        editingRule={editingRule}
        onSaved={loadLibrary}
      />

      {debuggingChapter && (
        <DebugKnowledgeModal
          isOpen={isDebugModalOpen}
          onOpenChange={setIsDebugModalOpen}
          bookId={book.id}
          chapter={debuggingChapter}
        />
      )}
    </div>
  );
};
