"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchStockPrices, type StockPrice } from "@/lib/api/stocks";

type RealPriceVolumeSummaryProps = {
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

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function calculateChangePercent(latest?: StockPrice, previous?: StockPrice) {
  if (!latest?.close_price || !previous?.close_price) return null;

  return ((latest.close_price - previous.close_price) / previous.close_price) * 100;
}

export function RealPriceVolumeSummary({
  ticker,
}: RealPriceVolumeSummaryProps) {
  const [prices, setPrices] = useState<StockPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result = await fetchStockPrices(ticker);

        if (result.error) {
          setErrorMessage(result.error);
          return;
        }

        setPrices(result.data ?? []);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Không thể tải dữ liệu giá"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [ticker]);

  const latestPrice = useMemo(() => prices[0], [prices]);
  const previousPrice = useMemo(() => prices[1], [prices]);
  const changePercent = useMemo(
    () => calculateChangePercent(latestPrice, previousPrice),
    [latestPrice, previousPrice]
  );

  const averageVolume = useMemo(() => {
    const validVolumes = prices
      .map((item) => item.volume)
      .filter((volume): volume is number => typeof volume === "number");

    if (validVolumes.length === 0) return null;

    const total = validVolumes.reduce((sum, volume) => sum + volume, 0);
    return total / validVolumes.length;
  }, [prices]);

  return (
    <section className="mb-6 rounded-[4px] border-[1.5px] border-border bg-surface shadow-soft">
      <header className="border-b border-border-soft bg-surface-soft px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
          Real Price Volume Data
        </p>
        <h2 className="mt-1 font-brand text-lg font-bold text-ink">
          Giá và khối lượng thật từ Supabase - {ticker}
        </h2>
      </header>

      <div className="p-4">
        {isLoading ? (
          <p className="text-sm text-muted">Đang tải dữ liệu giá...</p>
        ) : errorMessage ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : !latestPrice ? (
          <p className="text-sm text-muted">
            Chưa có dữ liệu giá cho mã {ticker}.
          </p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[4px] border border-border bg-page p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
                  Giá đóng cửa mới nhất
                </p>
                <h3 className="mt-2 text-2xl font-bold text-ink">
                  {formatNumber(latestPrice.close_price)}
                </h3>
                <p className="mt-2 text-xs text-muted">
                  Ngày {latestPrice.trading_date}
                </p>
              </div>

              <div className="rounded-[4px] border border-border bg-page p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
                  Biến động so với phiên trước
                </p>
                <h3 className="mt-2 text-2xl font-bold text-ink">
                  {formatPercent(changePercent)}
                </h3>
                <p className="mt-2 text-xs text-muted">
                  Tính theo giá đóng cửa
                </p>
              </div>

              <div className="rounded-[4px] border border-border bg-page p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
                  Khối lượng trung bình
                </p>
                <h3 className="mt-2 text-2xl font-bold text-ink">
                  {formatNumber(averageVolume)}
                </h3>
                <p className="mt-2 text-xs text-muted">
                  Dựa trên dữ liệu đang có
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[4px] border border-border bg-page p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
                  OHLC mới nhất
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Open</span>
                    <strong className="text-right text-ink">
                      {formatNumber(latestPrice.open_price)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted">High</span>
                    <strong className="text-right text-ink">
                      {formatNumber(latestPrice.high_price)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Low</span>
                    <strong className="text-right text-ink">
                      {formatNumber(latestPrice.low_price)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Close</span>
                    <strong className="text-right text-ink">
                      {formatNumber(latestPrice.close_price)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Adjusted close</span>
                    <strong className="text-right text-ink">
                      {formatNumber(latestPrice.adjusted_close_price)}
                    </strong>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted">Volume</span>
                    <strong className="text-right text-ink">
                      {formatNumber(latestPrice.volume)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="rounded-[4px] border border-border bg-page p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
                  Nhận xét kỹ thuật
                </p>

                <p className="mt-3 text-sm leading-6 text-muted">
                  Dữ liệu này lấy trực tiếp từ bảng stock_prices trong Supabase.
                  Với dữ liệu thật đầy đủ hơn, module có thể mở rộng thành biểu
                  đồ giá, biểu đồ khối lượng, biến động theo thời gian và tín
                  hiệu kỹ thuật.
                </p>

                <div className="mt-4 rounded-[4px] border border-border bg-accent-soft p-3 text-xs leading-5 text-muted">
                  Hiện tại dữ liệu demo chỉ có vài phiên giao dịch, nên phần này
                  ưu tiên kiểm tra luồng API trước. Khi import nhiều dữ liệu giá
                  hơn, bảng lịch sử bên dưới sẽ hữu ích hơn.
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="mb-3 text-sm font-bold text-ink">
                Lịch sử giá gần nhất
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-subtle">
                      <th className="py-2 pr-3">Ngày</th>
                      <th className="py-2 pr-3 text-right">Open</th>
                      <th className="py-2 pr-3 text-right">High</th>
                      <th className="py-2 pr-3 text-right">Low</th>
                      <th className="py-2 pr-3 text-right">Close</th>
                      <th className="py-2 text-right">Volume</th>
                    </tr>
                  </thead>

                  <tbody>
                    {prices.map((item) => (
                      <tr
                        key={item.trading_date}
                        className="border-b border-border-soft"
                      >
                        <td className="py-2 pr-3">{item.trading_date}</td>
                        <td className="py-2 pr-3 text-right">
                          {formatNumber(item.open_price)}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          {formatNumber(item.high_price)}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          {formatNumber(item.low_price)}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          {formatNumber(item.close_price)}
                        </td>
                        <td className="py-2 text-right">
                          {formatNumber(item.volume)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}