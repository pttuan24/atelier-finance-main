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

    const riskLevel = searchParams.get("risk_level");
    const limitParam = searchParams.get("limit");

    const limit = limitParam ? Number(limitParam) : 20;

    if (Number.isNaN(limit) || limit <= 0 || limit > 100) {
      return NextResponse.json(
        {
          data: null,
          error: "Limit must be a number between 1 and 100",
        },
        { status: 400 }
      );
    }

    if (
      riskLevel &&
      !["low", "medium", "high", "unknown"].includes(riskLevel)
    ) {
      return NextResponse.json(
        {
          data: null,
          error: "risk_level must be low, medium, high, or unknown",
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
      .from("risk_assessments")
      .select(
        `
        id,
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
        explanation,
        created_at
      `
      )
      .eq("stock_id", stock.id)
      .order("assessment_date", { ascending: false })
      .limit(limit);

    if (riskLevel) {
      query = query.eq("overall_risk_level", riskLevel);
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
        risk_level: riskLevel,
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