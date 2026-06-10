import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    ticker: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
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

    const { data, error } = await supabaseAdmin
      .from("stock_overview")
      .select("*")
      .eq("ticker", ticker)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          data: null,
          error: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          data: null,
          error: "Stock not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data,
      error: null,
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