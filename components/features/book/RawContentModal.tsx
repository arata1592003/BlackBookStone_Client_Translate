"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative bg-bg-box text-text-primary rounded-lg shadow-xl max-w-2xl w-full h-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-surface-border">
          <h2 className="text-xl font-bold">Nội dung RAW: {title}</h2>
          <Button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-hover transition-colors"
            title="Đóng"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto whitespace-pre-wrap font-mono text-sm">
          {content}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t border-surface-border">
          <Button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md">
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};
