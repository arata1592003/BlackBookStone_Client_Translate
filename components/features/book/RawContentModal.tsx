"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RawContentModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

export const RawContentModal: React.FC<RawContentModalProps> = ({
  title,
  content,
  onClose,
}) => {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col p-0 gap-0 bg-surface-card border-border-default overflow-hidden">
        <DialogHeader className="p-6 border-b border-border-default">
          <DialogTitle className="text-xl font-bold text-text-primary">
            Nội dung RAW: {title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="whitespace-pre-wrap font-mono text-sm text-text-secondary">
            {content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
