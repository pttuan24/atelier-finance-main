-- =========================================================
-- ATELIER FINANCE DEMO SEED DATA
-- Dữ liệu mẫu để test API
-- Không dùng làm dữ liệu phân tích thật
-- =========================================================

-- 1. DATA SOURCE
insert into public.data_sources (
  name,
  source_type,
  url,
  description,
  is_free,
  legal_note
)
values (
  'Demo Data',
  'manual_seed',
  'local',
  'Dữ liệu mẫu do nhóm tự tạo để test API',
  true,
  'Chỉ dùng cho demo kỹ thuật, không dùng làm dữ liệu đầu tư thật'
)
on conflict do nothing;

-- 2. INDUSTRIES
insert into public.industries (
  code,
  name_vi,
  name_en,
  description
)
values
  (
    'BANK',
    'Ngân hàng',
    'Banking',
    'Nhóm ngành ngân hàng'
  ),
  (
    'TECH',
    'Công nghệ',
    'Technology',
    'Nhóm ngành công nghệ'
  )
on conflict (code) do nothing;

-- 3. STOCKS
insert into public.stocks (
  ticker,
  company_name,
  exchange,
  industry_id,
  listing_date,
  website,
  description
)
values
  (
    'VCB',
    'Ngân hàng TMCP Ngoại thương Việt Nam',
    'HOSE',
    (select id from public.industries where code = 'BANK'),
    '2009-06-30',
    'https://www.vietcombank.com.vn',
    'Dữ liệu mẫu cho mã VCB'
  ),
  (
    'FPT',
    'Công ty Cổ phần FPT',
    'HOSE',
    (select id from public.industries where code = 'TECH'),
    '2006-12-13',
    'https://fpt.com',
    'Dữ liệu mẫu cho mã FPT'
  )
on conflict (ticker) do update set
  company_name = excluded.company_name,
  exchange = excluded.exchange,
  industry_id = excluded.industry_id,
  listing_date = excluded.listing_date,
  website = excluded.website,
  description = excluded.description,
  updated_at = now();

-- 4. STOCK PRICES - VCB
insert into public.stock_prices (
  stock_id,
  trading_date,
  open_price,
  high_price,
  low_price,
  close_price,
  adjusted_close_price,
  volume
)
values
  (
    (select id from public.stocks where ticker = 'VCB'),
    '2024-12-27',
    91000,
    92500,
    90500,
    92000,
    92000,
    1200000
  ),
  (
    (select id from public.stocks where ticker = 'VCB'),
    '2024-12-26',
    90000,
    91500,
    89500,
    91000,
    91000,
    1100000
  ),
  (
    (select id from public.stocks where ticker = 'VCB'),
    '2024-12-25',
    89500,
    90500,
    89000,
    90000,
    90000,
    950000
  )
on conflict (stock_id, trading_date) do update set
  open_price = excluded.open_price,
  high_price = excluded.high_price,
  low_price = excluded.low_price,
  close_price = excluded.close_price,
  adjusted_close_price = excluded.adjusted_close_price,
  volume = excluded.volume;

-- 5. STOCK PRICES - FPT
insert into public.stock_prices (
  stock_id,
  trading_date,
  open_price,
  high_price,
  low_price,
  close_price,
  adjusted_close_price,
  volume
)
values
  (
    (select id from public.stocks where ticker = 'FPT'),
    '2024-12-27',
    148000,
    151000,
    147000,
    150000,
    150000,
    1800000
  ),
  (
    (select id from public.stocks where ticker = 'FPT'),
    '2024-12-26',
    146000,
    149000,
    145000,
    148000,
    148000,
    1700000
  )
on conflict (stock_id, trading_date) do update set
  open_price = excluded.open_price,
  high_price = excluded.high_price,
  low_price = excluded.low_price,
  close_price = excluded.close_price,
  adjusted_close_price = excluded.adjusted_close_price,
  volume = excluded.volume;

-- 6. FINANCIAL REPORTS - VCB
insert into public.financial_reports (
  stock_id,
  fiscal_year,
  fiscal_quarter,
  period_type,
  report_type,
  revenue,
  gross_profit,
  operating_profit,
  net_profit,
  eps,
  total_assets,
  total_liabilities,
  total_equity,
  cash_and_equivalents,
  short_term_debt,
  long_term_debt,
  operating_cash_flow,
  investing_cash_flow,
  financing_cash_flow,
  capital_expenditure,
  free_cash_flow,
  source_url
)
values
  (
    (select id from public.stocks where ticker = 'VCB'),
    2024,
    4,
    'quarter',
    'consolidated',
    18000000000000,
    null,
    12000000000000,
    9500000000000,
    1700,
    1900000000000000,
    1700000000000000,
    200000000000000,
    120000000000000,
    50000000000000,
    150000000000000,
    11000000000000,
    -3000000000000,
    -4000000000000,
    null,
    11000000000000,
    'local-demo'
  ),
  (
    (select id from public.stocks where ticker = 'VCB'),
    2024,
    3,
    'quarter',
    'consolidated',
    17000000000000,
    null,
    11500000000000,
    9000000000000,
    1600,
    1850000000000000,
    1660000000000000,
    190000000000000,
    115000000000000,
    48000000000000,
    145000000000000,
    10000000000000,
    -2500000000000,
    -3500000000000,
    null,
    10000000000000,
    'local-demo'
  )
on conflict (
  stock_id,
  fiscal_year,
  fiscal_quarter,
  period_type,
  report_type
) do update set
  revenue = excluded.revenue,
  gross_profit = excluded.gross_profit,
  operating_profit = excluded.operating_profit,
  net_profit = excluded.net_profit,
  eps = excluded.eps,
  total_assets = excluded.total_assets,
  total_liabilities = excluded.total_liabilities,
  total_equity = excluded.total_equity,
  cash_and_equivalents = excluded.cash_and_equivalents,
  short_term_debt = excluded.short_term_debt,
  long_term_debt = excluded.long_term_debt,
  operating_cash_flow = excluded.operating_cash_flow,
  investing_cash_flow = excluded.investing_cash_flow,
  financing_cash_flow = excluded.financing_cash_flow,
  capital_expenditure = excluded.capital_expenditure,
  free_cash_flow = excluded.free_cash_flow,
  source_url = excluded.source_url,
  updated_at = now();

-- 7. FINANCIAL RATIOS - VCB
insert into public.financial_ratios (
  stock_id,
  fiscal_year,
  fiscal_quarter,
  period_type,

  revenue_growth,
  net_profit_growth,
  eps_growth,

  gross_margin,
  operating_margin,
  net_margin,
  roa,
  roe,
  roic,

  debt_to_equity,
  liabilities_to_assets,
  current_ratio,
  quick_ratio,
  interest_coverage,
  cash_to_debt,

  cfo_to_net_profit,
  fcf_margin,
  operating_cash_flow_margin,

  pe_ratio,
  pb_ratio,
  ps_ratio,
  earnings_yield,
  dividend_yield
)
values
  (
    (select id from public.stocks where ticker = 'VCB'),
    2024,
    4,
    'quarter',

    0.08,
    0.06,
    0.05,

    null,
    0.67,
    0.53,
    0.012,
    0.18,
    null,

    1.0,
    0.89,
    null,
    null,
    null,
    0.60,

    1.16,
    0.61,
    0.61,

    13.5,
    2.4,
    4.1,
    0.074,
    null
  )
on conflict (
  stock_id,
  fiscal_year,
  fiscal_quarter,
  period_type
) do update set
  revenue_growth = excluded.revenue_growth,
  net_profit_growth = excluded.net_profit_growth,
  eps_growth = excluded.eps_growth,
  gross_margin = excluded.gross_margin,
  operating_margin = excluded.operating_margin,
  net_margin = excluded.net_margin,
  roa = excluded.roa,
  roe = excluded.roe,
  roic = excluded.roic,
  debt_to_equity = excluded.debt_to_equity,
  liabilities_to_assets = excluded.liabilities_to_assets,
  current_ratio = excluded.current_ratio,
  quick_ratio = excluded.quick_ratio,
  interest_coverage = excluded.interest_coverage,
  cash_to_debt = excluded.cash_to_debt,
  cfo_to_net_profit = excluded.cfo_to_net_profit,
  fcf_margin = excluded.fcf_margin,
  operating_cash_flow_margin = excluded.operating_cash_flow_margin,
  pe_ratio = excluded.pe_ratio,
  pb_ratio = excluded.pb_ratio,
  ps_ratio = excluded.ps_ratio,
  earnings_yield = excluded.earnings_yield,
  dividend_yield = excluded.dividend_yield,
  calculated_at = now();

-- 8. VALUATION RESULTS - VCB
insert into public.valuation_results (
  stock_id,
  valuation_date,
  method,
  scenario,
  fair_value_low,
  fair_value_base,
  fair_value_high,
  market_price,
  margin_of_safety,
  confidence_level,
  explanation
)
values
  (
    (select id from public.stocks where ticker = 'VCB'),
    '2024-12-27',
    'pe_historical',
    'base',
    85000,
    95000,
    105000,
    92000,
    0.0326,
    'medium',
    'Dữ liệu mẫu: định giá theo P/E lịch sử, chỉ dùng để test API.'
  ),
  (
    (select id from public.stocks where ticker = 'VCB'),
    '2024-12-27',
    'pb_historical',
    'bear',
    76000,
    82000,
    90000,
    92000,
    -0.1219,
    'low',
    'Dữ liệu mẫu: kịch bản thận trọng, không phải khuyến nghị đầu tư.'
  )
on conflict (
  stock_id,
  valuation_date,
  method,
  scenario
) do update set
  fair_value_low = excluded.fair_value_low,
  fair_value_base = excluded.fair_value_base,
  fair_value_high = excluded.fair_value_high,
  market_price = excluded.market_price,
  margin_of_safety = excluded.margin_of_safety,
  confidence_level = excluded.confidence_level,
  explanation = excluded.explanation;

-- 9. RISK ASSESSMENTS - VCB
insert into public.risk_assessments (
  stock_id,
  assessment_date,

  financial_risk_score,
  debt_risk_score,
  earnings_quality_risk_score,
  valuation_risk_score,
  liquidity_risk_score,
  business_risk_score,
  transparency_risk_score,
  data_quality_risk_score,

  overall_risk_score,
  overall_risk_level,

  warning_notes,
  explanation
)
values
  (
    (select id from public.stocks where ticker = 'VCB'),
    '2024-12-27',

    35,
    40,
    30,
    45,
    25,
    30,
    20,
    50,

    35,
    'medium',

    'Dữ liệu mẫu: cần kiểm tra thêm chất lượng lợi nhuận, nợ và nguồn dữ liệu.',
    'Mức rủi ro trung bình trong dữ liệu demo, không phải đánh giá đầu tư thật.'
  )
on conflict (
  stock_id,
  assessment_date
) do update set
  financial_risk_score = excluded.financial_risk_score,
  debt_risk_score = excluded.debt_risk_score,
  earnings_quality_risk_score = excluded.earnings_quality_risk_score,
  valuation_risk_score = excluded.valuation_risk_score,
  liquidity_risk_score = excluded.liquidity_risk_score,
  business_risk_score = excluded.business_risk_score,
  transparency_risk_score = excluded.transparency_risk_score,
  data_quality_risk_score = excluded.data_quality_risk_score,
  overall_risk_score = excluded.overall_risk_score,
  overall_risk_level = excluded.overall_risk_level,
  warning_notes = excluded.warning_notes,
  explanation = excluded.explanation;

-- 10. MACRO INDICATORS
insert into public.macro_indicators (
  indicator_code,
  indicator_name,
  value,
  unit,
  period_date,
  period_type,
  country,
  source_url
)
values
  (
    'GDP_GROWTH',
    'Tăng trưởng GDP',
    6.5,
    'percent',
    '2024-12-31',
    'year',
    'Vietnam',
    'local-demo'
  ),
  (
    'CPI',
    'Chỉ số giá tiêu dùng',
    3.8,
    'percent',
    '2024-12-31',
    'year',
    'Vietnam',
    'local-demo'
  )
on conflict (
  indicator_code,
  period_date,
  country
) do update set
  value = excluded.value,
  unit = excluded.unit,
  period_type = excluded.period_type,
  source_url = excluded.source_url;