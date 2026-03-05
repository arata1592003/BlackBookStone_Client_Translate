import { getManagedBookDetails } from "@/modules/book/book.service";
import { TranslationManager } from "@/components/features/translate/TranslationManager";
import { ArrowLeft, Languages } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/user/server";

interface TranslationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TranslationPage({ params }: TranslationPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const book = await getManagedBookDetails(id, supabase);

  if (!book) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full bg-surface-base">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-surface-card border-b border-border-default px-6 py-4">
        <div className="flex items-center gap-4">
          <Link 
            href={`/tai-khoan/truyen/${id}`}
            className="p-2 rounded-full hover:bg-surface-raised transition-colors text-text-muted hover:text-text-primary"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Languages className="text-primary-accent" size={20} />
              Dịch thuật AI: <span className="text-primary">{book.title}</span>
            </h1>
            <p className="text-xs text-text-muted">Quản lý và thực hiện dịch chương truyện tự động</p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <TranslationManager book={book} />
      </main>
    </div>
  );
}
