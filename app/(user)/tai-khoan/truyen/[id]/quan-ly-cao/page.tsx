import { notFound } from "next/navigation";
import { getManagedBookAction } from "@/app/actions/book";
import CrawlManagementPage from "@/components/features/book/CrawlManagementPage"; // Import Client Component

export default async function ManagedBookCrawlPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  console.log(id);
  const { success, data: book, error } = await getManagedBookAction(id);

  if (!success || !book) {
    console.error("Failed to fetch managed book for crawling:", error);
    notFound();
  }

  return <CrawlManagementPage bookId={id} bookDetails={book} currentManagedChapters={book.chapters} />;
}
