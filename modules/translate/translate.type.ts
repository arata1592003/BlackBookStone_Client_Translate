export type TranslationRule = {
  id: string;
  user_id: string | null;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type TranslationRuleInsert = Omit<TranslationRule, "id" | "created_at" | "updated_at">;

export type TranslationMode = "BASIC" | "ADVANCE";

export type JobStatus = "PENDING" | "RUNNING" | "DONE" | "ERROR" | "CANCELLED";

export type BookTranslateJobRequest = {
  type: "BOOK_TRANSLATE";
  book_id: string;
  mode: TranslationMode;
  max_retry: number;
  rule_ids: string[];
};

export type BookTranslateJobResponse = {
  job_id: string;
  status: JobStatus;
  total_chapters: number;
  mode: TranslationMode;
  max_retry: number;
};

export type JobItem = {
  id: string;
  type: "BOOK_TRANSLATE";
  status: JobStatus;
  mode: TranslationMode;
  completed: number;
  total: number;
  created_at: string;
};

export type JobListResponse = {
  items: JobItem[];
  total: number;
};

export type ChapterJobDetail = {
  id: string;
  chapter_number: number;
  status: JobStatus | "DONE"; // API trả về DONE khi hoàn thành
  retry_count: number;
  error_message: string | null;
  started_at: string | null;
  finished_at: string | null;
};

export type JobDetailResponse = {
  id: string;
  book_id: string;
  type: "BOOK_TRANSLATE";
  status: JobStatus;
  mode: TranslationMode;
  completed: number;
  total: number;
  max_retry: number;
  error_msg: string | null;
  created_at: string;
  updated_at: string;
  chapters: ChapterJobDetail[];
};

export type TranslationJobLog = {
  chapter_number: number;
  status: "pending" | "processing" | "success" | "error";
  message?: string;
};

// --- Debug Types ---

export type DebugCharacter = {
  name_original: string;
  name_vn: string;
  role: string;
  age?: string;
  faction?: string;
  realm?: string;
  description?: string;
  narrative_pronoun?: string;
  gender?: string;
  aliases?: string[];
};

export type DebugCharacterRelation = {
  target_A: string;
  target_B: string;
  call_A_to_B?: string;
  call_B_to_A?: string;
  address_A_to_B?: string;
  address_B_to_A?: string;
};

export type DebugTerm = {
  term_original: string;
  base_translation: string;
  variants?: string[];
  context_description?: string;
  category?: string;
  note?: string;
  quality_level?: string;
};

export type KnowledgeInput = {
  characters?: DebugCharacter[];
  character_relations?: DebugCharacterRelation[];
  term_glossary?: DebugTerm[];
};

export type NewKnowledgeOutput = {
  chapter_id: string;
  chapter_number: number;
  logged_at: string;
  new_characters?: DebugCharacter[];
  new_character_relations?: DebugCharacterRelation[];
  new_term_glossary?: DebugTerm[];
};
