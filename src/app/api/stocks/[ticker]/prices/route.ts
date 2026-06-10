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
        { data: null, error: "Ticker is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 250;

    if (Number.isNaN(limit) || limit <= 0 || limit > 1000) {
      return NextResponse.json(
        { data: null, error: "Limit must be a number between 1 and 1000" },
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
        { data: null, error: stockError.message },
        { status: 500 }
      );
    }

    if (!stock) {
      return NextResponse.json(
        { data: null, error: "Stock not found" },
        { status: 404 }
      );
    }

    let query = supabaseAdmin
      .from("stock_prices")
      .select(
        `
        trading_date,
        open_price,
        high_price,
        low_price,
        close_price,
        adjusted_close_price,
        volume
      `
      )
      .eq("stock_id", stock.id)
      .order("trading_date", { ascending: false })
      .limit(limit);

    if (from) {
      query = query.gte("trading_date", from);
    }

    if (to) {
      query = query.lte("trading_date", to);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { data: null, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      error: null,
      meta: {
        ticker: stock.ticker,
        company_name: stock.company_name,
        limit,
        from,
        to,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}