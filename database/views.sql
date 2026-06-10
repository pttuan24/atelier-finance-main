-- =========================================================
-- ATELIER FINANCE DATABASE VIEWS
-- =========================================================

create or replace view public.latest_stock_prices as
select distinct on (sp.stock_id)
  sp.stock_id,
  s.ticker,
  s.company_name,
  sp.trading_date,
  sp.close_price,
  sp.volume
from public.stock_prices sp
join public.stocks s on s.id = sp.stock_id
order by sp.stock_id, sp.trading_date desc;

create or replace view public.latest_financial_reports as
select distinct on (fr.stock_id)
  fr.stock_id,
  s.ticker,
  s.company_name,
  fr.fiscal_year,
  fr.fiscal_quarter,
  fr.period_type,
  fr.revenue,
  fr.net_profit,
  fr.total_assets,
  fr.total_liabilities,
  fr.total_equity,
  fr.operating_cash_flow,
  fr.free_cash_flow
from public.financial_reports fr
join public.stocks s on s.id = fr.stock_id
order by fr.stock_id, fr.fiscal_year desc, fr.fiscal_quarter desc;

create or replace view public.stock_overview as
select
  s.id as stock_id,
  s.ticker,
  s.company_name,
  s.exchange,
  i.name_vi as industry_name,
  lsp.close_price,
  lsp.trading_date as latest_price_date,
  lfr.revenue,
  lfr.net_profit,
  lfr.total_assets,
  lfr.total_equity
from public.stocks s
left join public.industries i on i.id = s.industry_id
left join public.latest_stock_prices lsp on lsp.stock_id = s.id
left join public.latest_financial_reports lfr on lfr.stock_id = s.id;