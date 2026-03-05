"use client";

import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createBookAction } from "@/app/actions/book";
import { useAuth } from "@/components/providers/AuthProvider";

export default function AddBookPage() {
  const { user } = useAuth();

  const [bookName, setBookName] = useState("");

  const [isAddingBook, setIsAddingBook] = useState(false);
  const [addBookError, setAddBookError] = useState<string | null>(null);
  const [addBookSuccess, setAddBookSuccess] = useState<string | null>(null);

  const handleAddBookFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddBookError(null);
    setAddBookSuccess(null);
    setIsAddingBook(true);

    if (!bookName.trim()) {
      setAddBookError("Tên truyện không được để trống.");
      setIsAddingBook(false);
      return;
    }

    if (!user) {
      setAddBookError("Bạn cần đăng nhập để thực hiện thao tác này.");
      setIsAddingBook(false);
      return;
    }

    try {
      const result = await createBookAction(bookName, user);

      if (result.success) {
        setAddBookSuccess(result.message || "Truyện đã được thêm thành công!");
        setBookName("");
      } else {
        setAddBookError(result.error || "Có lỗi xảy ra khi thêm truyện.");
      }
    } catch (error: unknown) {
      console.error("Lỗi khi thêm truyện:", error);
      setAddBookError(
        (error as Error).message || "Có lỗi xảy ra khi thêm truyện.",
      );
    } finally {
      setIsAddingBook(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-5 p-5 relative flex-1 self-stretch w-full grow bg-surface-section">
      <Link
        href="/tai-khoan/ban-lam-viec"
        className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={20} />
        Quay lại Bàn làm việc
      </Link>
      <h2 className="text-3xl font-bold text-text-primary">Thêm Truyện Mới</h2>
      <p className="text-lg text-text-secondary">
        Nhập thông tin truyện để thêm vào hệ thống.
      </p>

      {addBookSuccess && (
        <div className="bg-success/20 text-success p-3 rounded-md text-sm flex items-center gap-2 w-full max-w-lg">
          <CheckCircle2 size={20} />
          {addBookSuccess}
        </div>
      )}
      {addBookError && (
        <div className="bg-destructive/20 text-destructive p-3 rounded-md text-sm w-full max-w-lg">
          {addBookError}
        </div>
      )}

      <div className="w-full max-w-lg bg-surface-card p-6 rounded-lg shadow-md border border-border-default">
        <form onSubmit={handleAddBookFinal} className="flex flex-col gap-6">
          {/* Book Name */}
          <div>
            <Label htmlFor="bookName">Tên Truyện</Label>
            <Input
              id="bookName"
              type="text"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              placeholder="Nhập tên truyện của bạn"
              required
            />
          </div>
          
          <Button type="submit" disabled={isAddingBook} className="w-full">
            {isAddingBook ? "Đang thêm truyện..." : "Thêm Truyện"}
          </Button>
        </form>
      </div>
    </div>
  );
}
