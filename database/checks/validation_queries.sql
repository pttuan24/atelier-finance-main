-- =========================================================
-- ATELIER FINANCE VALIDATION QUERIES
-- Dùng để kiểm tra dữ liệu sau import
-- =========================================================

-- 1. Kiểm tra số lượng cổ phiếu
select count(*) as total_stocks
from public.stocks;

-- 2. Kiểm tra mã cổ phiếu bị trùng
select ticker, count(*)
from public.stocks
group by ticker
having count(*) > 1;

-- 3. Kiểm tra giá âm
select *
from public.stock_prices
where open_price < 0
   or high_price < 0
   or low_price < 0
   or close_price < 0
   or volume < 0;

-- 4. Kiểm tra high thấp hơn low
select *
from public.stock_prices
where high_price < low_price;

-- 5. Kiểm tra trùng giá theo mã và ngày
select stock_id, trading_date, count(*)
from public.stock_prices
group by stock_id, trading_date
having count(*) > 1;

-- 6. Kiểm tra báo cáo tài chính thiếu doanh thu và lợi nhuận
select *
from public.financial_reports
where revenue is null
  and net_profit is null;

-- 7. Kiểm tra tổng tài sản, nợ phải trả, vốn chủ
select
  id,
  stock_id,
  fiscal_year,
  fiscal_quarter,
  total_assets,
  total_liabilities,
  total_equity,
  total_assets - (total_liabilities + total_equity) as difference
from public.financial_reports
where total_assets is not null
  and total_liabilities is not null
  and total_equity is not null
  and abs(total_assets - (total_liabilities + total_equity)) > 1000;

-- 8. Kiểm tra financial reports bị trùng kỳ
select
  stock_id,
  fiscal_year,
  fiscal_quarter,
  period_type,
  report_type,
  count(*)
from public.financial_reports
group by
  stock_id,
  fiscal_year,
  fiscal_quarter,
  period_type,
  report_type
having count(*) > 1;