import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    ticker: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { ticker: rawTicker } = await context.params;
    const ticker = rawTicker?.trim().toUpperCase();

    if (!ticker) {
      return NextResponse.json(
        {
          data: null,
          error: "Ticker is required",
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);

    const periodType = searchParams.get("period_type");
    const yearParam = searchParams.get("year");
    const limitParam = searchParams.get("limit");

    const limit = limitParam ? Number(limitParam) : 20;
    const year = yearParam ? Number(yearParam) : null;

    if (Number.isNaN(limit) || limit <= 0 || limit > 100) {
      return NextResponse.json(
        {
          data: null,
          error: "Limit must be a number between 1 and 100",
        },
        { status: 400 }
      );
    }

    if (yearParam && (Number.isNaN(year) || year! < 2000 || year! > 2100)) {
      return NextResponse.json(
        {
          data: null,
          error: "Year must be a valid number",
        },
        { status: 400 }
      );
    }

    if (periodType && !["quarter", "year", "ttm"].includes(periodType)) {
      return NextResponse.json(
        {
          data: null,
          error: "period_type must be quarter, year, or ttm",
        },
        { status: 400 }
      );
    }

    const { data: stock, error: stockError } = await supabaseAdmin
      .from("stocks")
      .select("id, ticker, company_name")
      .eq("ticker", ticker)
      .maybeSingle();

    if (stockError) {
      return NextResponse.json(
        {
          data: null,
          error: stockError.message,
        },
        { status: 500 }
      );
    }

    if (!stock) {
      return NextResponse.json(
        {
          data: null,
          error: "Stock not found",
        },
        { status: 404 }
      );
    }

    let query = supabaseAdmin
      .from("financial_ratios")
      .select(
        `
        id,
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
        dividend_yield,

        calculated_at
      `
      )
      .eq("stock_id", stock.id)
      .order("fiscal_year", { ascending: false })
      .order("fiscal_quarter", { ascending: false })
      .limit(limit);

    if (periodType) {
      query = query.eq("period_type", periodType);
    }

    if (year !== null) {
      query = query.eq("fiscal_year", year);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          data: null,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      error: null,
      meta: {
        ticker: stock.ticker,
        company_name: stock.company_name,
        period_type: periodType,
        year,
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}