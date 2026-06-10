-- =========================================================
-- ATELIER FINANCE DATABASE SCHEMA
-- Người 3: Backend, Database & Deployment Lead
-- Database: Supabase / PostgreSQL
-- =========================================================

-- Dùng UUID nếu cần tạo id tự động
create extension if not exists "pgcrypto";

-- =========================================================
-- 1. DATA SOURCES
-- Lưu nguồn dữ liệu: giá, báo cáo tài chính, vĩ mô...
-- =========================================================
create table if not exists public.data_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null,
  url text,
  description text,
  is_free boolean default true,
  legal_note text,
  created_at timestamptz default now()
);

-- =========================================================
-- 2. INDUSTRIES
-- Danh sách ngành
-- =========================================================
create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name_vi text not null,
  name_en text,
  description text,
  created_at timestamptz default now()
);

-- =========================================================
-- 3. STOCKS
-- Danh sách cổ phiếu/doanh nghiệp
-- =========================================================
create table if not exists public.stocks (
  id uuid primary key default gen_random_uuid(),
  ticker text unique not null,
  company_name text not null,
  exchange text,
  industry_id uuid references public.industries(id) on delete set null,
  listing_date date,
  website text,
  description text,
  source_id uuid references public.data_sources(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- 4. STOCK PRICES
-- Dữ liệu giá cổ phiếu theo ngày
-- =========================================================
create table if not exists public.stock_prices (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid not null references public.stocks(id) on delete cascade,
  trading_date date not null,
  open_price numeric,
  high_price numeric,
  low_price numeric,
  close_price numeric,
  adjusted_close_price numeric,
  volume numeric,
  source_id uuid references public.data_sources(id) on delete set null,
  created_at timestamptz default now(),

  constraint stock_prices_unique unique (stock_id, trading_date),
  constraint stock_prices_non_negative check (
    open_price >= 0
    and high_price >= 0
    and low_price >= 0
    and close_price >= 0
    and volume >= 0
  ),
  constraint stock_prices_high_low_check check (
    high_price is null
    or low_price is null
    or high_price >= low_price
  )
);

-- =========================================================
-- 5. FINANCIAL REPORTS
-- Báo cáo tài chính theo quý/năm
-- =========================================================
create table if not exists public.financial_reports (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid not null references public.stocks(id) on delete cascade,

  fiscal_year int not null,
  fiscal_quarter int,
  period_type text not null check (period_type in ('quarter', 'year', 'ttm')),
  report_type text default 'consolidated',

  revenue numeric,
  gross_profit numeric,
  operating_profit numeric,
  net_profit numeric,
  eps numeric,

  total_assets numeric,
  total_liabilities numeric,
  total_equity numeric,
  cash_and_equivalents numeric,
  short_term_debt numeric,
  long_term_debt numeric,
  inventory numeric,
  accounts_receivable numeric,

  operating_cash_flow numeric,
  investing_cash_flow numeric,
  financing_cash_flow numeric,
  capital_expenditure numeric,
  free_cash_flow numeric,

  source_id uuid references public.data_sources(id) on delete set null,
  source_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint financial_reports_unique unique (
    stock_id,
    fiscal_year,
    fiscal_quarter,
    period_type,
    report_type
  ),

  constraint fiscal_quarter_check check (
    fiscal_quarter is null
    or fiscal_quarter between 1 and 4
  )
);

-- =========================================================
-- 6. FINANCIAL RATIOS
-- Chỉ số tài chính đã tính
-- Công thức do Người 1 định nghĩa, Người 3 lưu output
-- =========================================================
create table if not exists public.financial_ratios (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid not null references public.stocks(id) on delete cascade,
  fiscal_year int not null,
  fiscal_quarter int,
  period_type text not null check (period_type in ('quarter', 'year', 'ttm')),

  revenue_growth numeric,
  net_profit_growth numeric,
  eps_growth numeric,

  gross_margin numeric,
  operating_margin numeric,
  net_margin numeric,
  roa numeric,
  roe numeric,
  roic numeric,

  debt_to_equity numeric,
  liabilities_to_assets numeric,
  current_ratio numeric,
  quick_ratio numeric,
  interest_coverage numeric,
  cash_to_debt numeric,

  cfo_to_net_profit numeric,
  fcf_margin numeric,
  operating_cash_flow_margin numeric,

  pe_ratio numeric,
  pb_ratio numeric,
  ps_ratio numeric,
  earnings_yield numeric,
  dividend_yield numeric,

  calculated_at timestamptz default now(),

  constraint financial_ratios_unique unique (
    stock_id,
    fiscal_year,
    fiscal_quarter,
    period_type
  )
);

-- =========================================================
-- 7. MACRO INDICATORS
-- Dữ liệu vĩ mô: GDP, CPI, lãi suất, tỷ giá...
-- =========================================================
create table if not exists public.macro_indicators (
  id uuid primary key default gen_random_uuid(),
  indicator_code text not null,
  indicator_name text not null,
  value numeric,
  unit text,
  period_date date not null,
  period_type text,
  country text default 'Vietnam',
  source_id uuid references public.data_sources(id) on delete set null,
  source_url text,
  created_at timestamptz default now(),

  constraint macro_indicators_unique unique (
    indicator_code,
    period_date,
    country
  )
);

-- =========================================================
-- 8. VALUATION RESULTS
-- Kết quả định giá
-- Logic do Người 1 định nghĩa, Người 3 lưu output/API
-- =========================================================
create table if not exists public.valuation_results (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid not null references public.stocks(id) on delete cascade,

  valuation_date date not null,
  method text not null,
  scenario text check (scenario in ('bear', 'base', 'bull')),

  fair_value_low numeric,
  fair_value_base numeric,
  fair_value_high numeric,
  market_price numeric,
  margin_of_safety numeric,
  confidence_level text,

  explanation text,
  created_at timestamptz default now(),

  constraint valuation_results_unique unique (
    stock_id,
    valuation_date,
    method,
    scenario
  )
);

-- =========================================================
-- 9. RISK ASSESSMENTS
-- Kết quả đánh giá rủi ro
-- Logic do Người 1 định nghĩa, Người 3 lưu output/API
-- =========================================================
create table if not exists public.risk_assessments (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid not null references public.stocks(id) on delete cascade,

  assessment_date date not null,

  financial_risk_score numeric,
  debt_risk_score numeric,
  earnings_quality_risk_score numeric,
  valuation_risk_score numeric,
  liquidity_risk_score numeric,
  business_risk_score numeric,
  transparency_risk_score numeric,
  data_quality_risk_score numeric,

  overall_risk_score numeric,
  overall_risk_level text check (
    overall_risk_level in ('low', 'medium', 'high', 'unknown')
  ),

  warning_notes text,
  explanation text,
  created_at timestamptz default now(),

  constraint risk_assessments_unique unique (
    stock_id,
    assessment_date
  )
);

-- =========================================================
-- 10. USER TABLES
-- Nếu nhóm làm tính năng cá nhân hóa
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stock_id uuid not null references public.stocks(id) on delete cascade,
  note text,
  created_at timestamptz default now(),

  constraint watchlists_unique unique (user_id, stock_id)
);

create table if not exists public.checklist_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stock_id uuid references public.stocks(id) on delete set null,
  checklist_type text not null,
  result jsonb,
  created_at timestamptz default now()
);

create table if not exists public.investment_journals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stock_id uuid references public.stocks(id) on delete set null,
  title text not null,
  thesis text,
  risk_notes text,
  decision text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.simulation_trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stock_id uuid not null references public.stocks(id) on delete cascade,
  trade_type text not null check (trade_type in ('buy', 'sell')),
  trade_date date not null,
  price numeric not null,
  quantity numeric not null,
  note text,
  created_at timestamptz default now()
);

-- =========================================================
-- 11. RAG SUPPORT TABLES
-- Nội dung RAG do Người 1 phụ trách
-- Người 3 chỉ hỗ trợ lưu/truy xuất nếu triển khai
-- =========================================================

create table if not exists public.rag_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text,
  category text,
  tags text[],
  difficulty text,
  content text not null,
  source text,
  last_updated date,
  allowed_usage text,
  related_metrics text[],
  warning_notes text,
  created_at timestamptz default now()
);

create table if not exists public.rag_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.rag_documents(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  metadata jsonb,
  created_at timestamptz default now(),

  constraint rag_chunks_unique unique (document_id, chunk_index)
);

create table if not exists public.rag_query_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  query text not null,
  retrieved_chunk_ids uuid[],
  answer text,
  created_at timestamptz default now()
);