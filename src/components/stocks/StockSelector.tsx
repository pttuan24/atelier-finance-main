"use client";

import { useEffect, useState } from "react";
import { fetchStocks, type StockOverview } from "@/lib/api/stocks";

type StockSelectorProps = {
  selectedTicker: string;
  onChange: (ticker: string) => void;
};

export function StockSelector({
  selectedTicker,
  onChange,
}: StockSelectorProps) {
  const [stocks, setStocks] = useState<StockOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadStocks() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result = await fetchStocks();

        if (result.error) {
          setErrorMessage(result.error);
          return;
        }

        setStocks(result.data ?? []);

        if (!selectedTicker && result.data?.[0]?.ticker) {
          onChange(result.data[0].ticker);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách cổ phiếu"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadStocks();
  }, [onChange, selectedTicker]);

  return (
    <section className="mb-5 rounded-[4px] border-[1.5px] border-border bg-surface p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
            Real Data Connection
          </p>
          <h2 className="mt-1 font-brand text-base font-bold text-ink">
            Chọn mã cổ phiếu từ Supabase
          </h2>
        </div>

        <span className="rounded-[3px] border border-border bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-accent">
          API
        </span>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Đang tải danh sách cổ phiếu...</p>
      ) : errorMessage ? (
        <p className="text-sm text-danger">{errorMessage}</p>
      ) : stocks.length === 0 ? (
        <p className="text-sm text-muted">
          Chưa có dữ liệu cổ phiếu. Hãy chạy seed_demo_data.sql trước.
        </p>
      ) : (
        <select
          className="w-full rounded-[4px] border border-border bg-surface-soft px-3 py-2 text-sm font-medium text-ink outline-none"
          value={selectedTicker}
          onChange={(event) => onChange(event.target.value)}
        >
          {stocks.map((stock) => (
            <option key={stock.ticker} value={stock.ticker}>
              {stock.ticker} - {stock.company_name}
            </option>
          ))}
        </select>
      )}
    </section>
  );
}