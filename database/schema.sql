-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.book_comments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  book_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT book_comments_pkey PRIMARY KEY (id),
  CONSTRAINT book_comments_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id),
  CONSTRAINT book_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.book_follows (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  book_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT book_follows_pkey PRIMARY KEY (id),
  CONSTRAINT book_follows_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT book_follows_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id)
);
CREATE TABLE public.book_tags (
  book_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT book_tags_pkey PRIMARY KEY (book_id, tag_id),
  CONSTRAINT fk_book_tags_book FOREIGN KEY (book_id) REFERENCES public.books(id),
  CONSTRAINT fk_book_tags_tag FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);
CREATE TABLE public.books (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  source_id uuid NOT NULL,
  owner_user_id uuid NOT NULL,
  book_name_raw text,
  author_name_raw text,
  book_name_translated text,
  author_name_translated text,
  publication_status text,
  cover_image_url text,
  url_raw text,
  is_published boolean DEFAULT false,
  draft_expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  slug text NOT NULL,
  description text,
  source_book_code text,
  CONSTRAINT books_pkey PRIMARY KEY (id),
  CONSTRAINT books_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sources(id),
  CONSTRAINT books_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id)
);
CREATE TABLE public.chapter_access (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  chapter_id uuid NOT NULL,
  paid_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chapter_access_pkey PRIMARY KEY (id),
  CONSTRAINT chapter_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT chapter_access_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapter_content(chapter_id)
);
CREATE TABLE public.chapter_content (
  chapter_id uuid NOT NULL,
  content_raw text,
  content_translated text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_paid boolean DEFAULT false,
  CONSTRAINT chapter_content_pkey PRIMARY KEY (chapter_id),
  CONSTRAINT chapter_content_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES public.chapters(id)
);
CREATE TABLE public.chapters (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  book_id uuid NOT NULL,
  chapter_number integer NOT NULL,
  chapter_title_raw text,
  chapter_title_translated text,
  summary_translated text,
  published_at_raw timestamp with time zone,
  view_count integer DEFAULT 0,
  chapter_status boolean,
  total_words_raw integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  total_words_translate integer DEFAULT 0,
  url_raw text,
  CONSTRAINT chapters_pkey PRIMARY KEY (id),
  CONSTRAINT chapters_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id)
);
CREATE TABLE public.jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['crawl'::text, 'translate'::text, 'main_crawl'::text, 'fetch_chapter_urls'::text])),
  book_id uuid,
  status text NOT NULL DEFAULT 'PENDING'::text CHECK (status = ANY (ARRAY['PENDING'::text, 'RUNNING'::text, 'DONE'::text, 'ERROR'::text, 'CANCELLED'::text, 'FETCHING_URLS'::text, 'URLS_FETCHED'::text, 'CRAWLING_CONTENT'::text])),
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_activity_at timestamp with time zone,
  CONSTRAINT jobs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.settings (
  id uuid NOT NULL,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  type text NOT NULL,
  description text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sources (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  base_url text,
  rate_limit_per_min integer DEFAULT 60,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sources_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tags (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT tags_pkey PRIMARY KEY (id)
);
CREATE TABLE public.topup_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  price_amount integer NOT NULL CHECK (price_amount > 0),
  currency text DEFAULT 'VND'::text,
  gems integer NOT NULL CHECK (gems > 0),
  bonus_gems integer DEFAULT 0 CHECK (bonus_gems >= 0),
  is_active boolean DEFAULT true,
  note text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT topup_plans_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  first_name text,
  last_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_admin boolean DEFAULT false,
  phone text,
  date_of_birth date,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.wallet_transaction_chapters (
  wallet_transaction_id uuid NOT NULL,
  chapter_id uuid NOT NULL,
  word_count integer CHECK (word_count > 0),
  words_per_gem integer CHECK (words_per_gem > 0),
  factor numeric CHECK (factor > 0::numeric),
  amount_gem bigint CHECK (amount_gem > 0),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT fk_wtc_wallet_transaction FOREIGN KEY (wallet_transaction_id) REFERENCES public.wallet_transactions(id),
  CONSTRAINT fk_wtc_chapter FOREIGN KEY (chapter_id) REFERENCES public.chapters(id)
);
CREATE TABLE public.wallet_transaction_topup_plans (
  wallet_transaction_id uuid NOT NULL UNIQUE,
  topup_plan_id uuid NOT NULL,
  gems_assigned integer DEFAULT 0,
  bonus_gems integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT fk_wttp_wallet_transaction FOREIGN KEY (wallet_transaction_id) REFERENCES public.wallet_transactions(id),
  CONSTRAINT fk_wttp_topup_plan FOREIGN KEY (topup_plan_id) REFERENCES public.topup_plans(id)
);
CREATE TABLE public.wallet_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  change_gem bigint NOT NULL DEFAULT 0,
  balance_after bigint DEFAULT 0,
  reason text NOT NULL,
  method text,
  reference_code text,
  gateway_txn_id text UNIQUE,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT fk_wallet_transactions_user FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.wallets (
  id uuid NOT NULL,
  balance_gem numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT wallets_pkey PRIMARY KEY (id),
  CONSTRAINT wallets_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);