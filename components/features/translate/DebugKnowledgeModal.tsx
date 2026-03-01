"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Bug,
  BookText,
  Info,
  Users,
  FlaskConical,
  Link,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ManagedChapter } from "@/modules/book/book.types";
import {
  getChapterKnowledgeInputAction,
  getChapterNewKnowledgeAction,
} from "@/app/actions/translate";
import {
  DebugCharacter,
  DebugCharacterRelation,
  DebugTerm,
  KnowledgeInput,
  NewKnowledgeOutput,
} from "@/modules/translate/translate.type";

interface DebugKnowledgeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  chapter: ManagedChapter;
}

export const DebugKnowledgeModal = ({
  isOpen,
  onOpenChange,
  bookId,
  chapter,
}: DebugKnowledgeModalProps) => {
  const [activeTab, setActiveTab] = useState<"input" | "new">("input");
  const [isLoading, setIsLoading] = useState(true);
  const [inputKnowledge, setInputKnowledge] = useState<KnowledgeInput | null>(
    null,
  );
  const [newKnowledge, setNewKnowledge] = useState<NewKnowledgeOutput | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsLoading(true);
      fetchKnowledge();
    }
  }, [isOpen, chapter.id]);

  const fetchKnowledge = async () => {
    try {
      const [inputRes, newRes] = await Promise.all([
        getChapterKnowledgeInputAction(bookId, chapter.id),
        getChapterNewKnowledgeAction(bookId, chapter.id),
      ]);

      console.log(inputRes.data);

      if (!inputRes.success)
        throw new Error(inputRes.error || "Lỗi khi lấy kiến thức đầu vào.");
      if (!newRes.success)
        throw new Error(newRes.error || "Lỗi khi lấy kiến thức mới.");

      setInputKnowledge(inputRes.data || null);
      setNewKnowledge(newRes.data || null);
    } catch (err: any) {
      console.error("Debug knowledge fetch error:", err);
      setError(err.message || "Không thể tải dữ liệu debug.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCharacter = (char: DebugCharacter, index: number) => (
    <div
      key={index}
      className="bg-background/50 border border-border-default rounded-lg p-3 space-y-1"
    >
      <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
        <Users size={14} className="text-blue-400" /> {char.name_vn} (
        {char.name_original})
      </div>
      {char.role && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Vai trò:</span> {char.role}
        </p>
      )}
      {(char.faction || char.realm) && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Môn phái/Cảnh giới:</span>{" "}
          {char.faction || "N/A"} - {char.realm || "N/A"}
        </p>
      )}
      {char.description && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Mô tả:</span> {char.description}
        </p>
      )}
      {(char.narrative_pronoun || char.gender) && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Xưng hô/Giới tính:</span>{" "}
          {char.narrative_pronoun || "N/A"} - {char.gender || "N/A"}
        </p>
      )}
      {char.aliases && char.aliases.length > 0 && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Biệt danh:</span>{" "}
          {char.aliases.join(", ")}
        </p>
      )}
    </div>
  );

  const renderRelation = (rel: DebugCharacterRelation, index: number) => (
    <div
      key={index}
      className="bg-background/50 border border-border-default rounded-lg p-3 text-xs text-text-muted"
    >
      <div className="flex items-center justify-between font-bold text-text-primary mb-1">
        <span>
          {rel.target_A}{" "}
          <Link size={12} className="inline-block text-gray-500 mx-1" />{" "}
          {rel.target_B}
        </span>
      </div>
      {rel.call_A_to_B && (
        <span>
          {rel.target_A} gọi {rel.target_B}:{" "}
          <span className="text-blue-300">{rel.call_A_to_B}</span>
        </span>
      )}
      {rel.call_B_to_A && (
        <span>
          , {rel.target_B} gọi {rel.target_A}:{" "}
          <span className="text-blue-300">{rel.call_B_to_A}</span>
        </span>
      )}
      {(rel.address_A_to_B || rel.address_B_to_A) && (
        <>
          {" "}
          <br />{" "}
          <span>
            Xưng hô: {rel.target_A} xưng {rel.address_A_to_B || "N/A"} -{" "}
            {rel.target_B} xưng {rel.address_B_to_A || "N/A"}
          </span>
        </>
      )}
    </div>
  );

  const renderTerm = (term: DebugTerm, index: number) => (
    <div
      key={index}
      className="bg-background/50 border border-border-default rounded-lg p-3 space-y-1"
    >
      <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
        <FlaskConical size={14} className="text-green-400" />{" "}
        {term.base_translation} ({term.term_original})
      </div>
      {term.category && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Loại:</span> {term.category}
        </p>
      )}
      {term.context_description && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Mô tả:</span> {term.context_description}
        </p>
      )}
      {term.quality_level && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Phẩm chất:</span> {term.quality_level}
        </p>
      )}
      {term.note && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Ghi chú:</span> {term.note}
        </p>
      )}
      {term.variants && term.variants.length > 0 && (
        <p className="text-xs text-text-muted">
          <span className="font-medium">Biến thể:</span>{" "}
          {term.variants.join(", ")}
        </p>
      )}
    </div>
  );

  const renderEmptyState = (message: string) => (
    <div className="py-10 text-center text-text-muted italic flex flex-col items-center gap-2">
      <Info size={24} /> {message}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] bg-surface-card text-text-primary border-border-default flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-border-default flex flex-col items-start space-y-1">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Bug className="text-destructive" size={24} /> Debug Kiến thức AI
            (Chương {chapter.chapterNumber})
          </DialogTitle>
          <p className="text-xs text-text-muted">
            Kiểm tra dữ liệu AI đã học và đang sử dụng cho chương này.
          </p>
        </DialogHeader>

        <div className="flex border-b border-border-default bg-background/50">
          <button
            className={cn(
              "flex-1 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === "input"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted",
            )}
            onClick={() => setActiveTab("input")}
          >
            Kiến thức đầu vào
          </button>
          <button
            className={cn(
              "flex-1 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === "new"
                ? "border-primary text-primary"
                : "border-transparent text-text-muted",
            )}
            onClick={() => setActiveTab("new")}
          >
            Kiến thức mới sinh ra
          </button>
        </div>

        <ScrollArea className="flex-1 p-8 bg-background/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-text-muted">
              <Loader2 className="animate-spin" size={40} />
              <p className="font-bold">Đang tải dữ liệu debug...</p>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-destructive p-8 text-center gap-3">
              <AlertTriangle size={32} />
              <p className="font-bold text-lg">Lỗi tải dữ liệu!</p>
              <p className="text-sm">{error}</p>
              <Button
                onClick={fetchKnowledge}
                variant="outline"
                className="mt-4"
              >
                <BookText size={16} className="mr-2" /> Thử lại
              </Button>
            </div>
          ) : (
            <div>
              {activeTab === "input" && inputKnowledge && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Users size={18} /> Nhân vật
                  </h3>
                  <div className="space-y-4">
                    {inputKnowledge.characters &&
                    inputKnowledge.characters.length > 0
                      ? inputKnowledge.characters.map(renderCharacter)
                      : renderEmptyState(
                          "Không có nhân vật trong kiến thức đầu vào.",
                        )}
                  </div>

                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 pt-6 border-t border-border-default/50">
                    <Link size={18} /> Quan hệ nhân vật
                  </h3>
                  <div className="space-y-4">
                    {inputKnowledge.character_relations &&
                    inputKnowledge.character_relations.length > 0
                      ? inputKnowledge.character_relations.map(renderRelation)
                      : renderEmptyState(
                          "Không có quan hệ nhân vật trong kiến thức đầu vào.",
                        )}
                  </div>

                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 pt-6 border-t border-border-default/50">
                    <FlaskConical size={18} /> Thuật ngữ & Cảnh giới
                  </h3>
                  <div className="space-y-4">
                    {inputKnowledge.term_glossary &&
                    inputKnowledge.term_glossary.length > 0
                      ? inputKnowledge.term_glossary.map(renderTerm)
                      : renderEmptyState(
                          "Không có thuật ngữ trong kiến thức đầu vào.",
                        )}
                  </div>
                </div>
              )}

              {activeTab === "new" && newKnowledge && (
                <div className="space-y-6">
                  <p className="text-sm text-text-muted mb-4">
                    Kiến thức mới được sinh ra từ chương này vào lúc:{" "}
                    <span className="font-bold text-text-primary">
                      {new Date(newKnowledge.logged_at).toLocaleString()}
                    </span>
                  </p>

                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Users size={18} /> Nhân vật mới
                  </h3>
                  <div className="space-y-4">
                    {newKnowledge.new_characters &&
                    newKnowledge.new_characters.length > 0
                      ? newKnowledge.new_characters.map(renderCharacter)
                      : renderEmptyState("Không có nhân vật mới được sinh ra.")}
                  </div>

                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 pt-6 border-t border-border-default/50">
                    <Link size={18} /> Quan hệ nhân vật mới
                  </h3>
                  <div className="space-y-4">
                    {newKnowledge.new_character_relations &&
                    newKnowledge.new_character_relations.length > 0
                      ? newKnowledge.new_character_relations.map(renderRelation)
                      : renderEmptyState(
                          "Không có quan hệ nhân vật mới được sinh ra.",
                        )}
                  </div>

                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 pt-6 border-t border-border-default/50">
                    <FlaskConical size={18} /> Thuật ngữ & Cảnh giới mới
                  </h3>
                  <div className="space-y-4">
                    {newKnowledge.new_term_glossary &&
                    newKnowledge.new_term_glossary.length > 0
                      ? newKnowledge.new_term_glossary.map(renderTerm)
                      : renderEmptyState(
                          "Không có thuật ngữ mới được sinh ra.",
                        )}
                  </div>
                </div>
              )}

              {!isLoading && !error && !inputKnowledge && !newKnowledge && (
                <div className="h-full flex flex-col items-center justify-center text-text-muted italic text-lg py-20 text-center gap-3">
                  <Info size={40} />
                  <p>Không tìm thấy dữ liệu debug cho chương này.</p>
                  <p className="text-sm">
                    Hãy đảm bảo bạn đã dịch chương này bằng chế độ Nâng cao
                    (Advance Mode) để thu thập kiến thức.
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="p-4 border-t border-border-default bg-background/50">
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="font-bold border border-border-default px-8"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
