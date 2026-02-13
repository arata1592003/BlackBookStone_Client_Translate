// app/(user)/tai-khoan/them-truyen/page.tsx
"use client";

import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getAllTags } from "@/modules/tag/tag.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { fetchBookMetadataAction, createBookAction } from "@/app/actions/book";
import { useAuth } from "@/components/providers/AuthProvider";

const TAG_LIMIT = 30;

export default function AddBookPage() {
  const router = useRouter();

  const { user } = useAuth();

  const [sourceBookCode, setSourceBookCode] = useState("");
  const [rawUrl, setRawUrl] = useState("");
  const [bookNameRaw, setBookNameRaw] = useState("");
  const [bookNameTranslated, setBookNameTranslated] = useState("");
  const [authorNameRaw, setAuthorNameRaw] = useState("");
  const [authorNameTranslated, setAuthorNameTranslated] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [metadataFetchError, setMetadataFetchError] = useState<string | null>(
    null,
  );

  const [isAddingBook, setIsAddingBook] = useState(false);
  const [addBookError, setAddBookError] = useState<string | null>(null);
  const [addBookSuccess, setAddBookSuccess] = useState<string | null>(null);

  const { data: allGenres, isLoading: isLoadingGenres } = useQuery({
    queryKey: ["allTags", TAG_LIMIT],
    queryFn: () => getAllTags(TAG_LIMIT),
    staleTime: Infinity,
  });

  const resetMetadataFields = useCallback(() => {
    setBookNameRaw("");
    setBookNameTranslated("");
    setAuthorNameRaw("");
    setAuthorNameTranslated("");
    setDescription("");
    setCoverImageUrl("");
    setSelectedGenres([]);
    setMetadataFetchError(null);
  }, []);

  useEffect(() => {
    if (!rawUrl.trim()) {
      resetMetadataFields();
    }
  }, [rawUrl, resetMetadataFields]);

  const handleFetchMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    setMetadataFetchError(null);
    setIsFetchingMetadata(true);
    setAddBookError(null);
    setAddBookSuccess(null);

    if (!rawUrl.trim()) {
      setMetadataFetchError("Vui lòng dán link truyện gốc.");
      setIsFetchingMetadata(false);
      return;
    }

    try {
      const result = await fetchBookMetadataAction(rawUrl);

      if (result.success && result.data) {
        setSourceBookCode(result.data.book_id);
        setBookNameRaw(result.data.book_name_raw || "");
        setAuthorNameRaw(result.data.author_name_raw || "");
        setCoverImageUrl(result.data.cover_image_url || "");
        setBookNameTranslated("");
        setAuthorNameTranslated("");
        setDescription("");
      } else {
        setMetadataFetchError(
          result.error ||
            "Không thể lấy thông tin truyện tự động. Vui lòng nhập thủ công.",
        );
        resetMetadataFields();
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy metadata:", error);
      setMetadataFetchError(
        error.message || "Có lỗi xảy ra khi lấy thông tin.",
      );
      resetMetadataFields();
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleAddBookFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddBookError(null);
    setAddBookSuccess(null);
    setIsAddingBook(true);

    if (!bookNameTranslated.trim()) {
      setAddBookError("Tên truyện dịch không được để trống.");
      setIsAddingBook(false);
      return;
    }
    if (!authorNameTranslated.trim()) {
      setAddBookError("Tên tác giả dịch không được để trống.");
      setIsAddingBook(false);
      return;
    }

    const bookData = {
      rawUrl,
      bookNameRaw,
      bookNameTranslated,
      authorNameRaw,
      authorNameTranslated,
      description,
      coverImageUrl,
      sourceBookCode,
      genres: selectedGenres,
    };
    // console.log("Final book data to be submitted:", bookData);

    try {
      const result = await createBookAction(bookData, user);

      if (result.success) {
        setAddBookSuccess(result.message || "Truyện đã được thêm thành công!");
        setRawUrl("");
        resetMetadataFields();
      } else {
        setAddBookError(result.error || "Có lỗi xảy ra khi thêm truyện.");
      }
    } catch (error: any) {
      console.error("Lỗi khi thêm truyện:", error);
      setAddBookError(error.message || "Có lỗi xảy ra khi thêm truyện.");
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
        <div className="bg-emerald-500/20 text-emerald-500 p-3 rounded-md text-sm flex items-center gap-2 w-full max-w-lg mx-auto md:mx-0">
          <CheckCircle2 size={20} />
          {addBookSuccess}
        </div>
      )}
      {addBookError && (
        <div className="bg-red-500/20 text-red-500 p-3 rounded-md text-sm w-full max-w-lg mx-auto md:mx-0">
          {addBookError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left Column: Raw URL Input & Fetch Metadata */}
        <div className="flex flex-col gap-6">
          <form onSubmit={handleFetchMetadata} className="flex flex-col gap-6">
            <div>
              <Label htmlFor="rawUrlInput">Link truyện gốc (raw)</Label>
              <Input
                id="rawUrlInput"
                type="url"
                value={rawUrl}
                onChange={(e) => setRawUrl(e.target.value)}
                placeholder="https://example.com/truyen-goc"
              />
            </div>
            <Button
              type="submit"
              disabled={isFetchingMetadata || !rawUrl.trim()}
              className="w-full"
            >
              {isFetchingMetadata
                ? "Đang lấy thông tin..."
                : "Lấy thông tin tự động"}
            </Button>
          </form>
          {metadataFetchError && (
            <div className="bg-red-500/20 text-red-500 p-3 rounded-md text-sm">
              {metadataFetchError}
            </div>
          )}
        </div>

        {/* Right Column: Full Book Details Form */}
        <div className="flex flex-col gap-6">
          <form onSubmit={handleAddBookFinal} className="flex flex-col gap-6">
            {isFetchingMetadata && (
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-8 bg-gray-700 rounded" />
                <div className="h-8 bg-gray-700 rounded" />
                <div className="h-8 bg-gray-700 rounded" />
                <div className="h-8 bg-gray-700 rounded" />
                <div className="h-20 bg-gray-700 rounded" />
                <div className="h-10 bg-gray-700 rounded" />
              </div>
            )}

            {!isFetchingMetadata && (
              <>
                {/* Book Name Translated */}
                <div>
                  <Label htmlFor="bookNameTranslated">Tên Truyện Dịch</Label>
                  <Input
                    id="bookNameTranslated"
                    type="text"
                    value={bookNameTranslated}
                    onChange={(e) => setBookNameTranslated(e.target.value)}
                    placeholder="Nhập tên truyện đã dịch"
                    required
                  />
                </div>
                {/* Book Name Raw */}
                <div>
                  <Label htmlFor="bookNameRaw">Tên Truyện Gốc (nếu có)</Label>
                  <Input
                    id="bookNameRaw"
                    type="text"
                    value={bookNameRaw}
                    onChange={(e) => setBookNameRaw(e.target.value)}
                    placeholder="Tên truyện gốc (tùy chọn)"
                  />
                </div>
                {/* Author Name Translated */}
                <div>
                  <Label htmlFor="authorNameTranslated">Tên Tác Giả Dịch</Label>
                  <Input
                    id="authorNameTranslated"
                    type="text"
                    value={authorNameTranslated}
                    onChange={(e) => setAuthorNameTranslated(e.target.value)}
                    placeholder="Nhập tên tác giả đã dịch"
                    required
                  />
                </div>
                {/* Author Name Raw */}
                <div>
                  <Label htmlFor="authorNameRaw">
                    Tên Tác Giả Gốc (nếu có)
                  </Label>
                  <Input
                    id="authorNameRaw"
                    type="text"
                    value={authorNameRaw}
                    onChange={(e) => setAuthorNameRaw(e.target.value)}
                    placeholder="Tên tác giả gốc (tùy chọn)"
                  />
                </div>
                {/* Cover Image URL */}
                <div>
                  <Label htmlFor="coverImageUrl">Link Ảnh Bìa</Label>
                  <Input
                    id="coverImageUrl"
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                  />
                  {coverImageUrl && (
                    <Image
                      src={coverImageUrl}
                      alt="Ảnh bìa"
                      width={150}
                      height={225}
                      className="mt-2 h-auto rounded-md object-cover"
                    />
                  )}
                </div>
                {/* Description */}
                <div>
                  <Label htmlFor="description">Mô tả truyện</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Nhập mô tả chi tiết về truyện..."
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                {/* Genres */}
                <div>
                  <Label>Thể loại</Label>
                  {isLoadingGenres ? (
                    <p className="text-text-muted">Đang tải thể loại...</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {allGenres?.map((tag) => (
                        <Button
                          key={tag.id}
                          type="button"
                          variant={
                            selectedGenres.includes(tag.id)
                              ? "default"
                              : "outline"
                          }
                          onClick={() => {
                            setSelectedGenres((prev) =>
                              prev.includes(tag.id)
                                ? prev.filter((id) => id !== tag.id)
                                : [...prev, tag.id],
                            );
                          }}
                        >
                          {tag.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isAddingBook}
                  className="w-full"
                >
                  {isAddingBook ? "Đang thêm truyện..." : "Thêm Truyện"}
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
