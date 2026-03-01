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
