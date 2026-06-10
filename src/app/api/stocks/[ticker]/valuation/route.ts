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

    const method = searchParams.get("method");
    const scenario = searchParams.get("scenario");
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

    if (scenario && !["bear", "base", "bull"].includes(scenario)) {
      return NextResponse.json(
        {
          data: null,
          error: "scenario must be bear, base, or bull",
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
      .from("valuation_results")
      .select(
        `
        id,
        valuation_date,
        method,
        scenario,
        fair_value_low,
        fair_value_base,
        fair_value_high,
        market_price,
        margin_of_safety,
        confidence_level,
        explanation,
        created_at
      `
      )
      .eq("stock_id", stock.id)
      .order("valuation_date", { ascending: false })
      .limit(limit);

    if (method) {
      query = query.eq("method", method);
    }

    if (scenario) {
      query = query.eq("scenario", scenario);
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
        method,
        scenario,
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