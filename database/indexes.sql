-- =========================================================
-- ATELIER FINANCE DATABASE INDEXES
-- =========================================================

create index if not exists idx_stocks_ticker
on public.stocks (ticker);

create index if not exists idx_stocks_industry_id
on public.stocks (industry_id);

create index if not exists idx_stock_prices_stock_id_date
on public.stock_prices (stock_id, trading_date desc);

create index if not exists idx_financial_reports_stock_period
on public.financial_reports (
  stock_id,
  fiscal_year desc,
  fiscal_quarter desc,
  period_type
);

create index if not exists idx_financial_ratios_stock_period
on public.financial_ratios (
  stock_id,
  fiscal_year desc,
  fiscal_quarter desc,
  period_type
);

create index if not exists idx_macro_indicators_code_date
on public.macro_indicators (
  indicator_code,
  period_date desc
);

create index if not exists idx_valuation_results_stock_date
on public.valuation_results (
  stock_id,
  valuation_date desc
);

create index if not exists idx_risk_assessments_stock_date
on public.risk_assessments (
  stock_id,
  assessment_date desc
);

create index if not exists idx_watchlists_user_id
on public.watchlists (user_id);

create index if not exists idx_investment_journals_user_id
on public.investment_journals (user_id);

create index if not exists idx_rag_documents_module
on public.rag_documents (module);

create index if not exists idx_rag_documents_tags
on public.rag_documents using gin (tags);