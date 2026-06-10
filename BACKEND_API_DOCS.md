# BACKEND_API_DOCS.md

## 1. Tổng quan

Backend của dự án Atelier Finance được xây dựng bằng Next.js App Router API Routes và kết nối với Supabase PostgreSQL.

Các API backend cung cấp dữ liệu cho frontend, bao gồm:

* Danh sách cổ phiếu
* Chi tiết cổ phiếu
* Dữ liệu giá và khối lượng
* Báo cáo tài chính
* Chỉ số tài chính
* Kết quả định giá
* Đánh giá rủi ro

Base URL khi chạy local:

```text
http://localhost:3000
```

---

## 2. Cấu hình môi trường

Ứng dụng sử dụng các biến môi trường sau:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

Trong đó:

* `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public anon key của Supabase.
* `SUPABASE_SERVICE_ROLE_KEY`: service role key dùng trong server-side API routes.
* `DATABASE_URL`: connection string database, có thể để trống nếu chưa dùng migration tool.

Lưu ý:

* Không commit file `.env.local` lên GitHub.
* Không đưa key thật vào `.env.example`.
* Không dùng `SUPABASE_SERVICE_ROLE_KEY` trong frontend client component.
* Service role key chỉ được dùng trong API routes phía server.

---

## 3. Danh sách API

### 3.1. GET /api/stocks

Lấy danh sách cổ phiếu từ view `stock_overview`.

Ví dụ:

```text
GET http://localhost:3000/api/stocks
```

Response mẫu:

```json
{
  "data": [
    {
      "ticker": "VCB",
      "company_name": "Ngân hàng TMCP Ngoại thương Việt Nam",
      "exchange": "HOSE",
      "industry_name": "Ngân hàng",
      "close_price": 92000,
      "latest_price_date": "2024-12-27"
    }
  ],
  "error": null
}
```

---

### 3.2. GET /api/stocks/[ticker]

Lấy thông tin tổng quan của một mã cổ phiếu.

Ví dụ:

```text
GET http://localhost:3000/api/stocks/VCB
```

Response mẫu:

```json
{
  "data": {
    "ticker": "VCB",
    "company_name": "Ngân hàng TMCP Ngoại thương Việt Nam",
    "exchange": "HOSE",
    "industry_name": "Ngân hàng",
    "close_price": 92000,
    "latest_price_date": "2024-12-27",
    "revenue": 180000000000,
    "net_profit": 95000000000
  },
  "error": null
}
```

---

### 3.3. GET /api/stocks/[ticker]/prices

Lấy dữ liệu giá và khối lượng giao dịch.

Ví dụ:

```text
GET http://localhost:3000/api/stocks/VCB/prices
```

Query params hỗ trợ:

| Param | Ý nghĩa                |
| ----- | ---------------------- |
| from  | Lọc từ ngày giao dịch  |
| to    | Lọc đến ngày giao dịch |
| limit | Giới hạn số bản ghi    |

Response mẫu:

```json
{
  "data": [
    {
      "trading_date": "2024-12-27",
      "open_price": 91000,
      "high_price": 92500,
      "low_price": 90500,
      "close_price": 92000,
      "adjusted_close_price": 92000,
      "volume": 1200000
    }
  ],
  "error": null
}
```

---

### 3.4. GET /api/stocks/[ticker]/financials

Lấy báo cáo tài chính của một mã cổ phiếu.

Ví dụ:

```text
GET http://localhost:3000/api/stocks/VCB/financials
```

Query params hỗ trợ:

| Param       | Ý nghĩa                       |
| ----------- | ----------------------------- |
| period_type | `quarter`, `year`, hoặc `ttm` |
| year        | Năm tài chính                 |
| limit       | Giới hạn số bản ghi           |

Response mẫu:

```json
{
  "data": [
    {
      "fiscal_year": 2024,
      "fiscal_quarter": 4,
      "period_type": "quarter",
      "revenue": 180000000000,
      "net_profit": 95000000000,
      "eps": 5200,
      "total_assets": 1900000000000000,
      "total_equity": 200000000000000
    }
  ],
  "error": null
}
```

---

### 3.5. GET /api/stocks/[ticker]/ratios

Lấy các chỉ số tài chính của một mã cổ phiếu.

Ví dụ:

```text
GET http://localhost:3000/api/stocks/VCB/ratios
```

Response mẫu:

```json
{
  "data": [
    {
      "fiscal_year": 2024,
      "fiscal_quarter": 4,
      "period_type": "quarter",
      "revenue_growth": 0.12,
      "net_profit_growth": 0.15,
      "net_margin": 0.53,
      "roa": 0.012,
      "roe": 0.18,
      "pe_ratio": 12.5,
      "pb_ratio": 2.1
    }
  ],
  "error": null
}
```

---

### 3.6. GET /api/stocks/[ticker]/valuation

Lấy kết quả định giá của một mã cổ phiếu.

Ví dụ:

```text
GET http://localhost:3000/api/stocks/VCB/valuation
```

Query params hỗ trợ:

| Param    | Ý nghĩa                     |
| -------- | --------------------------- |
| method   | Phương pháp định giá        |
| scenario | `bear`, `base`, hoặc `bull` |
| limit    | Giới hạn số bản ghi         |

Response mẫu:

```json
{
  "data": [
    {
      "valuation_date": "2024-12-27",
      "method": "pe_historical",
      "scenario": "base",
      "fair_value_low": 85000,
      "fair_value_base": 95000,
      "fair_value_high": 105000,
      "market_price": 92000,
      "margin_of_safety": 0.0326,
      "confidence_level": "medium",
      "explanation": "Dữ liệu mẫu dùng để kiểm thử API định giá."
    }
  ],
  "error": null
}
```

---

### 3.7. GET /api/stocks/[ticker]/risk

Lấy dữ liệu đánh giá rủi ro và minh bạch.

Ví dụ:

```text
GET http://localhost:3000/api/stocks/VCB/risk
```

Query params hỗ trợ:

| Param      | Ý nghĩa                                 |
| ---------- | --------------------------------------- |
| risk_level | `low`, `medium`, `high`, hoặc `unknown` |
| limit      | Giới hạn số bản ghi                     |

Response mẫu:

```json
{
  "data": [
    {
      "assessment_date": "2024-12-27",
      "overall_risk_score": 55,
      "overall_risk_level": "medium",
      "price_volatility_score": 45,
      "liquidity_risk_score": 35,
      "leverage_risk_score": 60,
      "profitability_risk_score": 40,
      "cash_flow_risk_score": 50,
      "governance_risk_score": 55,
      "disclosure_risk_score": 45,
      "warning_notes": "Cần theo dõi thêm biến động giá và dòng tiền.",
      "explanation": "Dữ liệu mẫu phục vụ kiểm thử API rủi ro."
    }
  ],
  "error": null
}
```

---

## 4. Quy ước response

API thành công thường trả về:

```json
{
  "data": [],
  "error": null
}
```

hoặc:

```json
{
  "data": {},
  "error": null
}
```

API lỗi thường trả về:

```json
{
  "data": null,
  "error": "Error message"
}
```

Một số API có thêm trường `meta` để mô tả mã cổ phiếu, tên công ty, giới hạn bản ghi hoặc bộ lọc đang dùng.

---

## 5. Ghi chú bảo mật

* API server sử dụng `SUPABASE_SERVICE_ROLE_KEY`.
* Không được expose `SUPABASE_SERVICE_ROLE_KEY` ra frontend.
* File `.env.local` không được commit lên GitHub.
* File `.env.example` chỉ chứa tên biến, không chứa key thật.
* Các API route nằm trong `src/app/api` và chạy ở phía server.

---

## 6. Kết luận

Các API backend đã cung cấp lớp dữ liệu cơ bản để frontend sử dụng dữ liệu từ Supabase thay vì dữ liệu mock. Hệ thống hiện hỗ trợ danh sách cổ phiếu, chi tiết cổ phiếu, dữ liệu giá, báo cáo tài chính, chỉ số tài chính, định giá và rủi ro.
