"use client";

import { useEffect, useState } from "react";
import {
  fetchStockDetail,
  fetchStockFinancials,
  fetchStockPrices,
  fetchStockRatios,
  fetchStockRisk,
  fetchStockValuation,
} from "@/lib/api/stocks";

type StockApiPreviewProps = {
  ticker: string;
};

type ApiState = {
  detail: unknown;
  prices: unknown;
  financials: unknown;
  ratios: unknown;
  valuation: unknown;
  risk: unknown;
};

export function StockApiPreview({ ticker }: StockApiPreviewProps) {
  const [data, setData] = useState<ApiState | null>(null);
  const [activeTab, setActiveTab] = useState<keyof ApiState>("detail");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    async function loadStockData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [
          detail,
          prices,
          financials,
          ratios,
          valuation,
          risk,
        ] = await Promise.all([
          fetchStockDetail(ticker),
          fetchStockPrices(ticker),
          fetchStockFinancials(ticker),
          fetchStockRatios(ticker),
          fetchStockValuation(ticker),
          fetchStockRisk(ticker),
        ]);

        setData({
          detail,
          prices,
          financials,
          ratios,
          valuation,
          risk,
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu cổ phiếu"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadStockData();
  }, [ticker]);

  const tabs: Array<{ key: keyof ApiState; label: string }> = [
    { key: "detail", label: "Chi tiết" },
    { key: "prices", label: "Giá" },
    { key: "financials", label: "BCTC" },
    { key: "ratios", label: "Ratios" },
    { key: "valuation", label: "Định giá" },
    { key: "risk", label: "Rủi ro" },
  ];

  return (
    <section className="mb-6 rounded-[4px] border-[1.5px] border-border bg-surface shadow-soft">
      <header className="border-b border-border-soft bg-surface-soft px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
          API Preview
        </p>
        <h2 className="mt-1 font-brand text-base font-bold text-ink">
          Dữ liệu thật từ API cho mã {ticker || "chưa chọn"}
        </h2>
      </header>

      <div className="border-b border-border-soft px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                className={
                  isActive
                    ? "rounded-[3px] border border-accent bg-accent-soft px-3 py-1.5 text-xs font-bold text-accent"
                    : "rounded-[3px] border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted"
                }
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <p className="text-sm text-muted">Đang tải dữ liệu từ API...</p>
        ) : errorMessage ? (
          <p className="text-sm text-danger">{errorMessage}</p>
        ) : !data ? (
          <p className="text-sm text-muted">Chưa có dữ liệu để hiển thị.</p>
        ) : (
          <pre className="max-h-[360px] overflow-auto rounded-[4px] border border-border bg-page p-4 text-xs leading-6 text-ink">
            {JSON.stringify(data[activeTab], null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
}