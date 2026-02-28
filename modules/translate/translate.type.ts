export type RuleType = "translation" | "extraction" | "synthesis";

export type TranslationRule = {
  id: string;
  user_id: string | null;
  name: string;
  content: string;
  type: RuleType;
  created_at: string;
  updated_at: string;
};

export type TranslationRuleInsert = Omit<TranslationRule, "id" | "created_at" | "updated_at">;

export type TranslationMode = "basic" | "advance";

export type TranslateChapterRequest = {
  book_id: string;
  chapter_id: string;
  mode: TranslationMode;
  // Parameters for Advance Mode
  rules?: string; // The final combined prompt
  prev_chapters_count?: number;
  next_chapters_count?: number;
};

export type TranslateChapterResponse = {
  chapter_id: string;
  summary_translated: string;
  chapter_title_translated: string;
  content_translated: string;
};

export type TranslationJobLog = {
  chapter_number: number;
  status: "pending" | "processing" | "success" | "error";
  message?: string;
};
