import { fetchBookInfoById } from "@/modules/book/book.repo";
import { ChapterDetail, ChapterRow } from "@/modules/chapter/chapter.type";
import { mapToChapterDetail, mapToChapterRow } from "./chapter.mapper";
import {
  fetchChapterCountByBookId,
  fetchChapterDetail,
  fetchChapterListByBookId,
  fetchNewestChaptersByBookId,
  fetchNextChapterNumber,
  fetchPrevChapterNumber,
  fetchAllChaptersContentByBookId,
  incrementChapterView as repoIncrementChapterView,
  AllChapterContentRow,
  insertChapter,
} from "./chapter.repo";
import { SupabaseClient } from "@supabase/supabase-js";

export const increaseChapterView = async (
  chapterId: string,
  supabase?: SupabaseClient,
): Promise<void> => {
  await repoIncrementChapterView(chapterId, supabase);
};

export async function addRawChapter(
  supabase: SupabaseClient,
  data: {
    bookId: string;
    chapterNumber: number;
    title: string;
    content: string;
  },
): Promise<string> {
  const totalWordsRaw = data.content.trim().split(/\s+/).length;

  return await insertChapter(supabase, {
    book_id: data.bookId,
    chapter_number: data.chapterNumber,
    chapter_title_raw: data.title,
    content_raw: data.content,
    total_words_raw: totalWordsRaw,
  });
}

export async function getFullBookDataForDownload(
  bookId: string,
  supabase?: SupabaseClient,
) {
  const chapters: AllChapterContentRow[] =
    await fetchAllChaptersContentByBookId(bookId, supabase);
  
  return chapters.map((ch) => ({
    number: ch.chapter_number,
    titleRaw: ch.chapter_title_raw,
    titleTranslated: ch.chapter_title_translated,
    summaryTranslated: ch.summary_translated,
    contentRaw: ch.content_raw,
    contentTranslated: ch.content_translated,
  }));
}

export async function getNewestChapterListByBookSlug(
  bookId: string,
  limit = 10,
  supabase?: SupabaseClient,
): Promise<ChapterRow[]> {
  const rows = await fetchNewestChaptersByBookId(bookId, limit, supabase);
  return rows.map(mapToChapterRow);
}

export async function getChapterListByBookSlug(
  bookId: string,
  offset = 0,
  limit = 20,
  newestFirst = false,
  supabase?: SupabaseClient,
): Promise<ChapterRow[]> {
  const rows = await fetchChapterListByBookId(
    bookId,
    offset,
    offset + limit - 1,
    newestFirst,
    supabase,
  );

  return rows.map(mapToChapterRow);
}

export async function getChapterCountByBookSlug(
  bookId: string,
  supabase?: SupabaseClient,
): Promise<number> {
  const totalChapter = await fetchChapterCountByBookId(bookId, supabase);
  return totalChapter;
}

export async function getChapterDetailByIdAndNumber(
  bookId: string,
  chapterNumber: number,
  supabase?: SupabaseClient,
): Promise<ChapterDetail> {
  const book = await fetchBookInfoById(bookId, supabase);
  if (!book) throw new Error("Book not found");

  const chapter = await fetchChapterDetail(book.id, chapterNumber, supabase);
  if (!chapter) throw new Error("Chapter not found");

  const [prev, next] = await Promise.all([
    fetchPrevChapterNumber(book.id, chapterNumber, supabase),
    fetchNextChapterNumber(book.id, chapterNumber, supabase),
  ]);

  return mapToChapterDetail(
    bookId,
    book.name ?? "",
    chapter,
    prev,
    next,
  );
}
