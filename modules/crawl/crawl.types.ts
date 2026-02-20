export interface ChapterRaw {
  chapter_number: number;
  chapter_url: string;
}

export interface CrawledChapterResult {
  chapter_id: string;
  chapter_number: number;
  chapter_title_raw: string;
}
