"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchStockValuation,
  type ValuationResult,
} from "@/lib/api/stocks";

type RealValuationSummaryProps = {
  ticker: string;
};

function formatMoney(value: number | null | undefined) {
  if (value === null || value === undefined) return "Chưa có dữ liệu";

  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined) return "Chưa có dữ liệu";

  return `${(value * 100).toFixed(2)}%`;
}

function formatScenario(scenario: ValuationResult["scenario"]) {
  if (!scenario) return "Không xác định";

  const labels = {
    bear: "Thận trọng",
    base: "Cơ sở",
    bull: "Tích cực",
  };

  return labels[scenario];
}

function formatMethod(method: string | null | undefined) {
  if (!method) return "Không xác định";

  return method
    .split("_")
    .map((word) => word.toUpperCase())
    .join(" ");
}

export function RealValuationSummary({ ticker }: RealValuationSummaryProps) {
  const [valuations, setValuations] = useState<ValuationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result = await fetchStockValuation(ticker);

        if (result.error) {
          setErrorMessage(result.error);
          return;
        }

        setValuations(result.data ?? []);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu định giá"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [ticker]);

  const latestValuation = useMemo(() => valuations[0], [valuations]);

  return (
    <section className="mb-6 rounded-[4px] border-[1.5px] border-border bg-surface shadow-soft">
      <header className="border-b border-border-soft bg-surface-soft px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
          Real Valuation Data
        </p>
        <h2 className="mt-1 font-brand text-lg font-bold text-ink">
          Định giá thật từ Supabase - {ticker}
        </h2>
      </header>

      <div className="p-4">
        {isLoading ? (
          <p className="text-sm text-muted">Đang tải dữ liệu định giá...</p>
        ) : errorMessage ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : !latestValuation ? (
          <p className="text-sm text-muted">
            Chưa có dữ liệu định giá cho mã {ticker}.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[4px] border border-border bg-page p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
                Kết quả mới nhất
              </p>

              <h3 className="mt-1 text-base font-bold text-ink">
                {formatMethod(latestValuation.method)} -{" "}
                {formatScenario(latestValuation.scenario)}
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Ngày định giá</span>
                  <strong className="text-right text-ink">
                    {latestValuation.valuation_date}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Giá thị trường</span>
                  <strong className="text-right text-ink">
                    {formatMoney(latestValuation.market_price)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Fair value thấp</span>
                  <strong className="text-right text-ink">
                    {formatMoney(latestValuation.fair_value_low)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Fair value cơ sở</span>
                  <strong className="text-right text-ink">
                    {formatMoney(latestValuation.fair_value_base)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Fair value cao</span>
                  <strong className="text-right text-ink">
                    {formatMoney(latestValuation.fair_value_high)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Margin of Safety</span>
                  <strong className="text-right text-ink">
                    {formatPercent(latestValuation.margin_of_safety)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Độ tin cậy</span>
                  <strong className="text-right text-ink">
                    {latestValuation.confidence_level ?? "Chưa có dữ liệu"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="rounded-[4px] border border-border bg-page p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
                Giải thích
              </p>

              <p className="mt-3 text-sm leading-6 text-muted">
                {latestValuation.explanation ??
                  "Chưa có phần giải thích cho kết quả định giá này."}
              </p>

              <div className="mt-4 rounded-[4px] border border-border bg-accent-soft p-3 text-xs leading-5 text-muted">
                Định giá là vùng ước lượng, không phải một con số chắc chắn.
                Kết quả này chỉ dùng để demo kỹ thuật và không phải khuyến nghị
                mua bán.
              </div>
            </div>
          </div>
        )}

        {valuations.length > 1 ? (
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-bold text-ink">
              Các kịch bản định giá
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-subtle">
                    <th className="py-2 pr-3">Ngày</th>
                    <th className="py-2 pr-3">Phương pháp</th>
                    <th className="py-2 pr-3">Kịch bản</th>
                    <th className="py-2 pr-3 text-right">Fair value</th>
                    <th className="py-2 pr-3 text-right">Market price</th>
                    <th className="py-2 text-right">MOS</th>
                  </tr>
                </thead>

                <tbody>
                  {valuations.map((item) => (
                    <tr key={item.id} className="border-b border-border-soft">
                      <td className="py-2 pr-3">{item.valuation_date}</td>
                      <td className="py-2 pr-3">{formatMethod(item.method)}</td>
                      <td className="py-2 pr-3">
                        {formatScenario(item.scenario)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {formatMoney(item.fair_value_base)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {formatMoney(item.market_price)}
                      </td>
                      <td className="py-2 text-right">
                        {formatPercent(item.margin_of_safety)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}