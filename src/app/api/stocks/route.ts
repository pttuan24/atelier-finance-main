import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("stock_overview")
      .select("*")
      .order("ticker", { ascending: true });

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