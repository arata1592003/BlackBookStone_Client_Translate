import { fetchBookInfoBySlug } from "@/modules/book/book.repo";
import { ChapterDetail, ChapterRow } from "@/modules/chapter/chapter.type";
import { mapToChapterDetail, mapToChapterRow } from "./chapter.mapper";
import {
  fetchChapterCountByBookSlug,
  fetchChapterDetail,
  fetchChapterListByBookSlug,
  fetchNewestChaptersByBookSlug,
  fetchNextChapterNumber,
  fetchPrevChapterNumber
} from "./chapter.repo";

export async function getNewestChapterListByBookSlug(
  slug: string,
  limit = 10
): Promise<ChapterRow[]> {
  const rows = await fetchNewestChaptersByBookSlug(slug, limit);
  return rows.map(mapToChapterRow);
}

export async function getChapterListByBookSlug(
  slug: string,
  offset = 0,
  limit = 20,
  newestFirst = false
): Promise<ChapterRow[]> {
  const rows = await fetchChapterListByBookSlug(
    slug,
    offset,
    offset + limit - 1,
    newestFirst
  );

  return rows.map(mapToChapterRow);
}

export async function getChapterCountByBookSlug(slug: string): Promise<number> {
  const totalChapter = await fetchChapterCountByBookSlug(slug);
  return totalChapter;
}

export async function getChapterDetailBySlugAndNumber(
  slug: string,
  chapterNumber: number
): Promise<ChapterDetail> {
  const book = await fetchBookInfoBySlug(slug);
  if (!book) throw new Error("Book not found");

  const chapter = await fetchChapterDetail(book.id, chapterNumber);
  if (!chapter) throw new Error("Chapter not found");

  const [prev, next] = await Promise.all([
    fetchPrevChapterNumber(book.id, chapterNumber),
    fetchNextChapterNumber(book.id, chapterNumber),
  ]);

  return mapToChapterDetail(
    slug,
    book.book_name_translated ?? "",
    chapter,
    prev,
    next
  );
}
