import { notFound } from "next/navigation";
import { getManagedBookAction } from "@/app/actions/book";
import ManagedBookContent from "@/components/features/book/ManagedBookContent"; // Import Client Component

export default async function ManagedBookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const { success, data: book, error } = await getManagedBookAction(id);

  if (!success || !book) {
    console.error("Failed to fetch managed book:", error);
    notFound();
  }

  return <ManagedBookContent book={book} />;
}
