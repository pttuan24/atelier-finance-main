"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchStockFinancials,
  fetchStockRatios,
  type FinancialRatio,
  type FinancialReport,
} from "@/lib/api/stocks";

type RealFinancialsSummaryProps = {
  ticker: string;
};

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "Chưa có dữ liệu";

  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined) return "Chưa có dữ liệu";

  return `${(value * 100).toFixed(2)}%`;
}

function formatRatio(value: number | null | undefined) {
  if (value === null || value === undefined) return "Chưa có dữ liệu";

  return value.toFixed(2);
}

export function RealFinancialsSummary({ ticker }: RealFinancialsSummaryProps) {
  const [financials, setFinancials] = useState<FinancialReport[]>([]);
  const [ratios, setRatios] = useState<FinancialRatio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [financialsResult, ratiosResult] = await Promise.all([
          fetchStockFinancials(ticker),
          fetchStockRatios(ticker),
        ]);

        if (financialsResult.error) {
          setErrorMessage(financialsResult.error);
          return;
        }

        if (ratiosResult.error) {
          setErrorMessage(ratiosResult.error);
          return;
        }

        setFinancials(financialsResult.data ?? []);
        setRatios(ratiosResult.data ?? []);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu báo cáo tài chính"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [ticker]);

  const latestFinancial = useMemo(() => financials[0], [financials]);
  const latestRatio = useMemo(() => ratios[0], [ratios]);

  return (
    <section className="mb-6 rounded-[4px] border-[1.5px] border-border bg-surface shadow-soft">
      <header className="border-b border-border-soft bg-surface-soft px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
          Real Financial Data
        </p>
        <h2 className="mt-1 font-brand text-lg font-bold text-ink">
          Báo cáo tài chính thật từ Supabase - {ticker}
        </h2>
      </header>

      <div className="p-4">
        {isLoading ? (
          <p className="text-sm text-muted">Đang tải dữ liệu tài chính...</p>
        ) : errorMessage ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : !latestFinancial ? (
          <p className="text-sm text-muted">
            Chưa có dữ liệu báo cáo tài chính cho mã {ticker}.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[4px] border border-border bg-page p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
                Kỳ báo cáo
              </p>
              <h3 className="mt-1 text-base font-bold text-ink">
                Năm {latestFinancial.fiscal_year}
                {latestFinancial.fiscal_quarter
                  ? ` - Quý ${latestFinancial.fiscal_quarter}`
                  : ""}
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Doanh thu</span>
                  <strong className="text-right text-ink">
                    {formatNumber(latestFinancial.revenue)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Lợi nhuận sau thuế</span>
                  <strong className="text-right text-ink">
                    {formatNumber(latestFinancial.net_profit)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">EPS</span>
                  <strong className="text-right text-ink">
                    {formatNumber(latestFinancial.eps)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Tổng tài sản</span>
                  <strong className="text-right text-ink">
                    {formatNumber(latestFinancial.total_assets)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Vốn chủ sở hữu</span>
                  <strong className="text-right text-ink">
                    {formatNumber(latestFinancial.total_equity)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="rounded-[4px] border border-border bg-page p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
                Chỉ số tài chính
              </p>
              <h3 className="mt-1 text-base font-bold text-ink">
                Ratios mới nhất
              </h3>

              {!latestRatio ? (
                <p className="mt-4 text-sm text-muted">
                  Chưa có dữ liệu chỉ số tài chính.
                </p>
              ) : (
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Tăng trưởng doanh thu</span>
                    <strong className="text-right text-ink">
                      {formatPercent(latestRatio.revenue_growth)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Biên lợi nhuận ròng</span>
                    <strong className="text-right text-ink">
                      {formatPercent(latestRatio.net_margin)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted">ROA</span>
                    <strong className="text-right text-ink">
                      {formatPercent(latestRatio.roa)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted">ROE</span>
                    <strong className="text-right text-ink">
                      {formatPercent(latestRatio.roe)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted">P/E</span>
                    <strong className="text-right text-ink">
                      {formatRatio(latestRatio.pe_ratio)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted">P/B</span>
                    <strong className="text-right text-ink">
                      {formatRatio(latestRatio.pb_ratio)}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="mt-4 rounded-[4px] border border-border bg-accent-soft p-3 text-xs leading-5 text-muted">
          Lưu ý: dữ liệu hiện tại là dữ liệu demo kỹ thuật để kiểm tra kết nối
          API. Khi Người 2 cung cấp dữ liệu thật, bảng này sẽ hiển thị dữ liệu
          thật đã import vào Supabase.
        </p>
      </div>
    </section>
  );
}