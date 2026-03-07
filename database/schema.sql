-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.book_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  book_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['PENDING'::text, 'RUNNING'::text, 'DONE'::text, 'ERROR'::text, 'CANCELLED'::text])),
  total_chapters integer NOT NULL,
  completed_chapters integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  max_retry integer NOT NULL DEFAULT 3,
  mode text NOT NULL DEFAULT 'ADVANCE'::text CHECK (mode = ANY (ARRAY['ADVANCE'::text, 'BASIC'::text])),
  error_msg text,
  rule_ids ARRAY DEFAULT '{}'::uuid[],
  CONSTRAINT book_jobs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.books (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  name text,
  expire_at timestamp with time zone DEFAULT (now() + '7 days'::interval),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT books_pkey PRIMARY KEY (id),
  CONSTRAINT books_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.chapter_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  parent_job_id uuid NOT NULL,
  chapter_id uuid NOT NULL,
  chapter_number integer NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['PENDING'::text, 'RUNNING'::text, 'DONE'::text, 'ERROR'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  retry_count integer DEFAULT 0,
  error_message text,
  started_at timestamp with time zone,
  finished_at timestamp with time zone,
  CONSTRAINT chapter_jobs_pkey PRIMARY KEY (id),
  CONSTRAINT chapter_jobs_parent_job_id_fkey FOREIGN KEY (parent_job_id) REFERENCES public.book_jobs(id)
);
CREATE TABLE public.chapters (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  book_id uuid NOT NULL,
  chapter_number integer NOT NULL,
  chapter_title_raw text,
  chapter_title_translated text,
  summary_translated text,
  content_raw text,
  content_translated text,
  total_words_raw integer,
  total_words_translate integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chapters_pkey PRIMARY KEY (id),
  CONSTRAINT chapters_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id)
);
CREATE TABLE public.credit_packages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  credits numeric NOT NULL,
  bonus_credits numeric NOT NULL DEFAULT 0.00,
  total_credits numeric DEFAULT (credits + bonus_credits),
  price_vnd numeric NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT credit_packages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.credit_transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['purchase'::text, 'usage'::text, 'refund'::text, 'adjustment'::text, 'bonus'::text])),
  amount numeric NOT NULL,
  balance_before numeric NOT NULL,
  balance_after numeric NOT NULL,
  order_id uuid,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT credit_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT credit_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT credit_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.gemini_api_keys (
  id integer NOT NULL DEFAULT nextval('gemini_api_keys_id_seq'::regclass),
  key_index integer NOT NULL UNIQUE,
  key_alias text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE'::text CHECK (status = ANY (ARRAY['ACTIVE'::text, 'RUNNING'::text, 'COOLDOWN'::text, 'DEAD'::text])),
  cooldown_until timestamp with time zone,
  last_used_at timestamp with time zone,
  last_error_at timestamp with time zone,
  last_error_msg text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT gemini_api_keys_pkey PRIMARY KEY (id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  package_id uuid NOT NULL,
  credits numeric NOT NULL,
  bonus_credits numeric NOT NULL DEFAULT 0.00,
  total_credits numeric NOT NULL,
  amount_vnd numeric NOT NULL,
  order_code text NOT NULL UNIQUE,
  payment_status text NOT NULL DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'cancelled'::text, 'expired'::text, 'refunded'::text])),
  expired_at timestamp with time zone NOT NULL DEFAULT (now() + '00:30:00'::interval),
  paid_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT orders_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.credit_packages(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.sepay_transactions (
  id bigint NOT NULL DEFAULT nextval('sepay_transactions_id_seq'::regclass),
  sepay_id bigint UNIQUE,
  gateway text,
  transaction_date timestamp with time zone,
  account_number text,
  sub_account text,
  amount_in numeric NOT NULL DEFAULT 0,
  amount_out numeric NOT NULL DEFAULT 0,
  accumulated numeric,
  code text,
  transaction_content text,
  reference_number text,
  body text,
  order_id uuid,
  processed boolean NOT NULL DEFAULT false,
  processed_at timestamp with time zone,
  process_note text,
  raw_payload jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT sepay_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT sepay_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.translation_rule_set_items (
  rule_set_id uuid NOT NULL,
  rule_id uuid NOT NULL,
  sort_order integer DEFAULT 0,
  CONSTRAINT translation_rule_set_items_pkey PRIMARY KEY (rule_set_id, rule_id),
  CONSTRAINT fk_rule_set FOREIGN KEY (rule_set_id) REFERENCES public.translation_rule_sets(id),
  CONSTRAINT fk_rule FOREIGN KEY (rule_id) REFERENCES public.translation_rules(id)
);
CREATE TABLE public.translation_rule_sets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT translation_rule_sets_pkey PRIMARY KEY (id),
  CONSTRAINT translation_rule_sets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.translation_rules (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  name text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT translation_rules_pkey PRIMARY KEY (id),
  CONSTRAINT translation_rules_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.wallets (
  id uuid NOT NULL,
  credits numeric NOT NULL DEFAULT 0.00,
  total_credits_purchased numeric NOT NULL DEFAULT 0.00,
  total_credits_used numeric NOT NULL DEFAULT 0.00,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT wallets_pkey PRIMARY KEY (id),
  CONSTRAINT wallets_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);