"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TranslationRule, TranslationRuleInsert, RuleType } from "@/modules/translate/translate.type";
import { saveTranslationRuleAction, updateTranslationRuleAction } from "@/app/actions/rule";
import { Sparkles, Save, Layers } from "lucide-react";

interface TranslationRuleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingRule?: TranslationRule | null;
  onSaved: () => void;
}

export const TranslationRuleDialog = ({
  isOpen,
  onOpenChange,
  editingRule,
  onSaved,
}: TranslationRuleDialogProps) => {
  const [formData, setFormData] = useState<TranslationRuleInsert>({
    user_id: null,
    name: "",
    content: "",
    type: "translation",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingRule) {
      setFormData({
        user_id: editingRule.user_id,
        name: editingRule.name,
        content: editingRule.content,
        type: editingRule.type,
      });
    } else {
      setFormData({
        user_id: null,
        name: "",
        content: "",
        type: "translation",
      });
    }
  }, [editingRule, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingRule) {
        await updateTranslationRuleAction(editingRule.id, formData);
      } else {
        await saveTranslationRuleAction(formData);
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      alert("Lỗi khi lưu bộ quy tắc.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-surface-card text-text-primary border-border-default">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="text-primary-accent" size={24} />
            {editingRule ? "Chỉnh sửa quy tắc" : "Tạo mảnh ghép quy tắc mới"}
          </DialogTitle>
          <DialogDescription className="text-text-muted text-xs">
            Định nghĩa các yêu cầu Prompt để AI thực hiện dịch thuật và xử lý dữ liệu chuẩn xác hơn.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase text-text-muted">Tên mảnh ghép</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="VD: Xưng hô Ta - Ngươi"
                  className="bg-background border-border-default h-10"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-text-muted">Loại quy tắc</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val: RuleType) => setFormData(prev => ({ ...prev, type: val }))}
                >
                  <SelectTrigger className="bg-background border-border-default h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-card border-border-default text-text-primary">
                    <SelectItem value="translation">Dịch thuật (Translation)</SelectItem>
                    <SelectItem value="extraction">Trích xuất (Extraction)</SelectItem>
                    <SelectItem value="synthesis">Tổng hợp (Synthesis)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content" className="text-xs font-bold uppercase text-text-muted">Nội dung câu lệnh (Prompt)</Label>
                <span className="text-[10px] text-text-faint italic">Sử dụng Markdown để AI dễ hiểu hơn</span>
              </div>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Nhập nội dung quy tắc chi tiết..."
                className="bg-background border-border-default min-h-[200px] focus:border-primary-accent text-sm leading-relaxed"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border-default">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-text-muted">Hủy bỏ</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 px-8">
              {isSubmitting ? "Đang xử lý..." : (
                <><Save size={18} className="mr-2" /> Lưu mảnh ghép</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
