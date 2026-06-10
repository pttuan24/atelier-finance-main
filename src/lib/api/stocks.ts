export type ApiResponse<T> = {
  data: T;
  error: string | null;
  meta?: Record<string, unknown>;
};

export type StockOverview = {
  stock_id?: string;
  id?: string;
  ticker: string;
  company_name: string;
  exchange?: string | null;
  industry_name?: string | null;
  close_price?: number | null;
  latest_price_date?: string | null;
  revenue?: number | null;
  net_profit?: number | null;
  total_assets?: number | null;
  total_equity?: number | null;
};

export type FinancialReport = {
  id: string;
  fiscal_year: number;
  fiscal_quarter: number | null;
  period_type: "quarter" | "year" | "ttm";
  report_type: string | null;

  revenue: number | null;
  gross_profit: number | null;
  operating_profit: number | null;
  net_profit: number | null;
  eps: number | null;

  total_assets: number | null;
  total_liabilities: number | null;
  total_equity: number | null;
  cash_and_equivalents: number | null;
  short_term_debt: number | null;
  long_term_debt: number | null;

  operating_cash_flow: number | null;
  investing_cash_flow: number | null;
  financing_cash_flow: number | null;
  capital_expenditure: number | null;
  free_cash_flow: number | null;

  source_url: string | null;
  created_at: string;
  updated_at: string;
};

export type FinancialRatio = {
  id: string;
  fiscal_year: number;
  fiscal_quarter: number | null;
  period_type: "quarter" | "year" | "ttm";

  revenue_growth: number | null;
  net_profit_growth: number | null;
  eps_growth: number | null;

  gross_margin: number | null;
  operating_margin: number | null;
  net_margin: number | null;
  roa: number | null;
  roe: number | null;
  roic: number | null;

  debt_to_equity: number | null;
  liabilities_to_assets: number | null;
  current_ratio: number | null;
  quick_ratio: number | null;
  interest_coverage: number | null;
  cash_to_debt: number | null;

  cfo_to_net_profit: number | null;
  fcf_margin: number | null;
  operating_cash_flow_margin: number | null;

  pe_ratio: number | null;
  pb_ratio: number | null;
  ps_ratio: number | null;
  earnings_yield: number | null;
  dividend_yield: number | null;

  calculated_at: string;
};

export type ValuationResult = {
  id: string;
  valuation_date: string;
  method: string;
  scenario: "bear" | "base" | "bull" | null;

  fair_value_low: number | null;
  fair_value_base: number | null;
  fair_value_high: number | null;
  market_price: number | null;
  margin_of_safety: number | null;
  confidence_level: string | null;

  explanation: string | null;
  created_at: string;
};

export type RiskAssessment = {
  id: string;
  assessment_date: string;

  price_volatility_score: number | null;
  liquidity_risk_score: number | null;
  leverage_risk_score: number | null;
  profitability_risk_score: number | null;
  cash_flow_risk_score: number | null;
  governance_risk_score: number | null;
  disclosure_risk_score: number | null;

  overall_risk_score: number | null;
  overall_risk_level: "low" | "medium" | "high" | "unknown" | null;

  warning_notes: string | null;
  explanation: string | null;
  created_at: string;
};

export type StockPrice = {
  trading_date: string;
  open_price: number | null;
  high_price: number | null;
  low_price: number | null;
  close_price: number | null;
  adjusted_close_price: number | null;
  volume: number | null;
};

export async function fetchStocks() {
  const response = await fetch("/api/stocks");

  if (!response.ok) {
    throw new Error("Không thể tải danh sách cổ phiếu");
  }

  return response.json() as Promise<ApiResponse<StockOverview[]>>;
}

export async function fetchStockDetail(ticker: string) {
  const response = await fetch(`/api/stocks/${ticker}`);

  if (!response.ok) {
    throw new Error(`Không thể tải thông tin mã ${ticker}`);
  }

  return response.json() as Promise<ApiResponse<StockOverview>>;
}

export async function fetchStockPrices(ticker: string) {
  const response = await fetch(`/api/stocks/${ticker}/prices`);

  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu giá của ${ticker}`);
  }

  return response.json() as Promise<ApiResponse<StockPrice[]>>;
}

export async function fetchStockFinancials(ticker: string) {
  const response = await fetch(`/api/stocks/${ticker}/financials`);

  if (!response.ok) {
    throw new Error(`Không thể tải báo cáo tài chính của ${ticker}`);
  }

  return response.json() as Promise<ApiResponse<FinancialReport[]>>;
}

export async function fetchStockRatios(ticker: string) {
  const response = await fetch(`/api/stocks/${ticker}/ratios`);

  if (!response.ok) {
    throw new Error(`Không thể tải chỉ số tài chính của ${ticker}`);
  }

  return response.json() as Promise<ApiResponse<FinancialRatio[]>>;
}

export async function fetchStockValuation(ticker: string) {
  const response = await fetch(`/api/stocks/${ticker}/valuation`);

  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu định giá của ${ticker}`);
  }

  return response.json() as Promise<ApiResponse<ValuationResult[]>>;
}

export async function fetchStockRisk(ticker: string) {
  const response = await fetch(`/api/stocks/${ticker}/risk`);

  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu rủi ro của ${ticker}`);
  }

  return response.json() as Promise<ApiResponse<RiskAssessment[]>>;
}