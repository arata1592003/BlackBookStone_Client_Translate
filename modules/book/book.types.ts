export type UserBookItem = {
  id: string;
  title: string;
  totalChapters: number;
  translatedChapters: number;
  updatedAt: string;
};

export type ManagedBookDetails = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  chapters: ManagedChapter[];
};

export type ManagedChapter = {
  id: string;
  chapterNumber: number;
  title: string;
  originalTitle: string | null;
  lastUpdated: string;
  totalWordsRaw: number | null;
  status: boolean;
};

export type ChapterContent = {
  contentRaw: string | null;
  contentTranslated: string | null;
};
