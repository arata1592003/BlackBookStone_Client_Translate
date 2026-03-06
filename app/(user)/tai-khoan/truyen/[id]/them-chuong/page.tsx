import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManagedBookDetails } from "@/modules/book/book.service";
import { createServerSupabaseClient } from "@/lib/supabase/user/server";
import { AddChapterClient } from "@/components/features/book/add-chapter/AddChapterClient";

interface AddChapterPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AddChapterPage({ params }: AddChapterPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const book = await getManagedBookDetails(id, supabase);

  if (!book) {
    notFound();
  }

  // Lấy số chương tiếp theo
  const nextChapterNumber = book.chapters.length > 0 
    ? Math.max(...book.chapters.map(c => c.chapterNumber)) + 1 
    : 1;

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-surface-section">
      <header className="bg-surface-card border-b border-border-default p-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/tai-khoan/truyen/${id}`}
              className="p-2 rounded-full hover:bg-surface-raised transition-colors text-text-muted hover:text-text-primary"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <BookOpen className="text-primary" size={20} />
                <h1 className="text-xl font-bold truncate max-w-[300px] md:max-w-md">
                  {book.title}
                </h1>
              </div>
              <p className="text-xs text-text-muted">Thêm nội dung chương mới</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-screen-xl mx-auto w-full p-6">
        <AddChapterClient bookId={id} nextChapterNumber={nextChapterNumber} />
      </main>
    </div>
  );
}
