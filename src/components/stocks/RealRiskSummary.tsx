"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchStockRisk, type RiskAssessment } from "@/lib/api/stocks";

type RealRiskSummaryProps = {
  ticker: string;
};

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined) return "Chưa có dữ liệu";

  return `${value}/100`;
}

function formatRiskLevel(level: RiskAssessment["overall_risk_level"]) {
  if (!level) return "Không xác định";

  const labels = {
    low: "Thấp",
    medium: "Trung bình",
    high: "Cao",
    unknown: "Không xác định",
  };

  return labels[level];
}

function getRiskComment(level: RiskAssessment["overall_risk_level"]) {
  if (level === "low") {
    return "Rủi ro tổng thể thấp. Doanh nghiệp tương đối ổn định trong bộ dữ liệu hiện tại.";
  }

  if (level === "medium") {
    return "Rủi ro tổng thể ở mức trung bình. Cần theo dõi thêm biến động giá, nợ vay và dòng tiền.";
  }

  if (level === "high") {
    return "Rủi ro tổng thể cao. Cần kiểm tra kỹ trước khi đưa ra quyết định đầu tư.";
  }

  return "Chưa đủ dữ liệu để kết luận mức rủi ro.";
}

export function RealRiskSummary({ ticker }: RealRiskSummaryProps) {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result = await fetchStockRisk(ticker);

        if (result.error) {
          setErrorMessage(result.error);
          return;
        }

        setRisks(result.data ?? []);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu rủi ro"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [ticker]);

  const latestRisk = useMemo(() => risks[0], [risks]);

  return (
    <section className="mb-6 rounded-[4px] border-[1.5px] border-border bg-surface shadow-soft">
      <header className="border-b border-border-soft bg-surface-soft px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
          Real Risk Data
        </p>
        <h2 className="mt-1 font-brand text-lg font-bold text-ink">
          Rủi ro thật từ Supabase - {ticker}
        </h2>
      </header>

      <div className="p-4">
        {isLoading ? (
          <p className="text-sm text-muted">Đang tải dữ liệu rủi ro...</p>
        ) : errorMessage ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : !latestRisk ? (
          <p className="text-sm text-muted">
            Chưa có dữ liệu rủi ro cho mã {ticker}.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[4px] border border-border bg-page p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
                Kết quả rủi ro mới nhất
              </p>

              <h3 className="mt-1 text-base font-bold text-ink">
                Mức rủi ro: {formatRiskLevel(latestRisk.overall_risk_level)}
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Ngày đánh giá</span>
                  <strong className="text-right text-ink">
                    {latestRisk.assessment_date}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Điểm rủi ro tổng thể</span>
                  <strong className="text-right text-ink">
                    {formatScore(latestRisk.overall_risk_score)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Biến động giá</span>
                  <strong className="text-right text-ink">
                    {formatScore(latestRisk.price_volatility_score)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Thanh khoản</span>
                  <strong className="text-right text-ink">
                    {formatScore(latestRisk.liquidity_risk_score)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Đòn bẩy tài chính</span>
                  <strong className="text-right text-ink">
                    {formatScore(latestRisk.leverage_risk_score)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Khả năng sinh lời</span>
                  <strong className="text-right text-ink">
                    {formatScore(latestRisk.profitability_risk_score)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Dòng tiền</span>
                  <strong className="text-right text-ink">
                    {formatScore(latestRisk.cash_flow_risk_score)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="rounded-[4px] border border-border bg-page p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-subtle">
                Minh bạch & cảnh báo
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Quản trị</span>
                  <strong className="text-right text-ink">
                    {formatScore(latestRisk.governance_risk_score)}
                  </strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Công bố thông tin</span>
                  <strong className="text-right text-ink">
                    {formatScore(latestRisk.disclosure_risk_score)}
                  </strong>
                </div>
              </div>

              <div className="mt-4 rounded-[4px] border border-border bg-accent-soft p-3 text-xs leading-5 text-muted">
                {getRiskComment(latestRisk.overall_risk_level)}
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.04em] text-subtle">
                  Ghi chú cảnh báo
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {latestRisk.warning_notes ??
                    "Chưa có ghi chú cảnh báo cho mã này."}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.04em] text-subtle">
                  Giải thích
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {latestRisk.explanation ??
                    "Chưa có phần giải thích rủi ro cho mã này."}
                </p>
              </div>
            </div>
          </div>
        )}

        {risks.length > 1 ? (
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-bold text-ink">
              Lịch sử đánh giá rủi ro
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-subtle">
                    <th className="py-2 pr-3">Ngày</th>
                    <th className="py-2 pr-3 text-right">Tổng điểm</th>
                    <th className="py-2 pr-3">Mức rủi ro</th>
                    <th className="py-2 pr-3 text-right">Biến động giá</th>
                    <th className="py-2 text-right">Dòng tiền</th>
                  </tr>
                </thead>

                <tbody>
                  {risks.map((item) => (
                    <tr key={item.id} className="border-b border-border-soft">
                      <td className="py-2 pr-3">{item.assessment_date}</td>
                      <td className="py-2 pr-3 text-right">
                        {formatScore(item.overall_risk_score)}
                      </td>
                      <td className="py-2 pr-3">
                        {formatRiskLevel(item.overall_risk_level)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {formatScore(item.price_volatility_score)}
                      </td>
                      <td className="py-2 text-right">
                        {formatScore(item.cash_flow_risk_score)}
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