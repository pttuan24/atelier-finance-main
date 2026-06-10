# DATABASE_SETUP.md

## 1. Tổng quan

Database của dự án Atelier Finance sử dụng Supabase PostgreSQL.

Database được thiết kế để lưu trữ dữ liệu phục vụ hệ thống phân tích cổ phiếu, bao gồm:

* Thông tin cổ phiếu
* Dữ liệu giá và khối lượng giao dịch
* Báo cáo tài chính
* Chỉ số tài chính
* Kết quả định giá
* Đánh giá rủi ro
* Dữ liệu người dùng
* Dữ liệu phục vụ AI/RAG trong các bước phát triển sau

---

## 2. Cấu trúc thư mục database

Các file SQL được đặt trong thư mục:

```text
database/
```

Cấu trúc chính:

```text
database/
├─ schema.sql
├─ indexes.sql
├─ views.sql
├─ rls_policies.sql
├─ seed/
│  └─ seed_demo_data.sql
└─ checks/
   └─ validation_queries.sql
```

---

## 3. Ý nghĩa các file SQL

| File                            | Mục đích                                     |
| ------------------------------- | -------------------------------------------- |
| `schema.sql`                    | Tạo các bảng chính trong database            |
| `indexes.sql`                   | Tạo index để tối ưu tốc độ truy vấn          |
| `views.sql`                     | Tạo các view phục vụ API và frontend         |
| `rls_policies.sql`              | Khai báo chính sách Row Level Security       |
| `seed/seed_demo_data.sql`       | Thêm dữ liệu demo để kiểm thử                |
| `checks/validation_queries.sql` | Các câu lệnh kiểm tra dữ liệu sau khi import |

---

## 4. Thứ tự chạy SQL trên Supabase

Vào Supabase Dashboard → SQL Editor, chạy các file theo thứ tự sau:

```text
1. database/schema.sql
2. database/indexes.sql
3. database/views.sql
4. database/seed/seed_demo_data.sql
5. database/checks/validation_queries.sql
```

File:

```text
database/rls_policies.sql
```

có thể chạy sau khi nhóm thống nhất chính sách bảo mật dữ liệu public/private cho từng bảng.

---

## 5. Các bảng chính

| Bảng                  | Chức năng                                    |
| --------------------- | -------------------------------------------- |
| `industries`          | Lưu danh mục ngành                           |
| `stocks`              | Lưu thông tin cổ phiếu                       |
| `stock_prices`        | Lưu dữ liệu giá và khối lượng giao dịch      |
| `financial_reports`   | Lưu báo cáo tài chính                        |
| `financial_ratios`    | Lưu các chỉ số tài chính                     |
| `valuation_results`   | Lưu kết quả định giá                         |
| `risk_assessments`    | Lưu đánh giá rủi ro                          |
| `macro_indicators`    | Lưu chỉ báo vĩ mô                            |
| `profiles`            | Lưu hồ sơ người dùng                         |
| `watchlists`          | Lưu danh sách theo dõi cổ phiếu              |
| `investment_journals` | Lưu nhật ký đầu tư                           |
| `simulation_trades`   | Lưu giao dịch mô phỏng                       |
| `rag_documents`       | Lưu tài liệu phục vụ RAG                     |
| `rag_chunks`          | Lưu các đoạn văn bản đã chia nhỏ phục vụ RAG |
| `rag_query_logs`      | Lưu lịch sử truy vấn RAG                     |

---

## 6. Các view chính

| View                       | Chức năng                                                                        |
| -------------------------- | -------------------------------------------------------------------------------- |
| `latest_stock_prices`      | Lấy giá mới nhất của từng mã cổ phiếu                                            |
| `latest_financial_reports` | Lấy báo cáo tài chính mới nhất của từng mã                                       |
| `stock_overview`           | Tổng hợp thông tin cổ phiếu, giá mới nhất và tài chính mới nhất cho API/frontend |

---

## 7. Dữ liệu demo

File dữ liệu demo nằm tại:

```text
database/seed/seed_demo_data.sql
```

Dữ liệu demo hiện có cho các mã:

* VCB
* FPT

Dữ liệu demo bao gồm:

* Thông tin doanh nghiệp
* Dữ liệu giá giao dịch
* Báo cáo tài chính
* Chỉ số tài chính
* Kết quả định giá
* Đánh giá rủi ro
* Chỉ báo vĩ mô

Dữ liệu này dùng để kiểm thử database, API và frontend integration. Khi nhóm có dữ liệu thật, có thể import thay thế hoặc bổ sung vào các bảng tương ứng.

---

## 8. Kiểm tra sau khi setup database

Sau khi chạy schema và seed data, có thể kiểm tra số lượng cổ phiếu:

```sql
select count(*) as total_stocks
from public.stocks;
```

Kết quả mong muốn:

```text
total_stocks >= 2
```

Kiểm tra danh sách cổ phiếu:

```sql
select ticker, company_name, exchange
from public.stocks
order by ticker;
```

Kiểm tra dữ liệu giá của VCB:

```sql
select
  s.ticker,
  p.trading_date,
  p.open_price,
  p.high_price,
  p.low_price,
  p.close_price,
  p.volume
from public.stock_prices p
join public.stocks s on s.id = p.stock_id
where s.ticker = 'VCB'
order by p.trading_date desc;
```

Kiểm tra dữ liệu báo cáo tài chính của VCB:

```sql
select
  s.ticker,
  f.fiscal_year,
  f.fiscal_quarter,
  f.period_type,
  f.revenue,
  f.net_profit,
  f.total_assets,
  f.total_equity
from public.financial_reports f
join public.stocks s on s.id = f.stock_id
where s.ticker = 'VCB'
order by f.fiscal_year desc, f.fiscal_quarter desc;
```

Kiểm tra dữ liệu định giá của VCB:

```sql
select
  s.ticker,
  v.valuation_date,
  v.method,
  v.scenario,
  v.fair_value_base,
  v.market_price,
  v.margin_of_safety
from public.valuation_results v
join public.stocks s on s.id = v.stock_id
where s.ticker = 'VCB'
order by v.valuation_date desc;
```

Kiểm tra dữ liệu rủi ro của VCB:

```sql
select
  s.ticker,
  r.assessment_date,
  r.overall_risk_score,
  r.overall_risk_level,
  r.warning_notes
from public.risk_assessments r
join public.stocks s on s.id = r.stock_id
where s.ticker = 'VCB'
order by r.assessment_date desc;
```

---

## 9. Kiểm tra view `stock_overview`

API `/api/stocks` và `/api/stocks/[ticker]` sử dụng view `stock_overview`.

Có thể kiểm tra view bằng câu lệnh:

```sql
select *
from public.stock_overview
order by ticker;
```

Kết quả mong muốn là có dữ liệu tổng hợp của VCB và FPT, bao gồm:

* ticker
* company_name
* exchange
* industry_name
* close_price
* latest_price_date
* revenue
* net_profit
* total_assets
* total_equity

---

## 10. Ghi chú về Row Level Security

Trong giai đoạn phát triển local/demo, một số bảng public market data có thể chưa bật RLS để dễ kiểm thử.

Các bảng dữ liệu người dùng như:

* `profiles`
* `watchlists`
* `investment_journals`
* `simulation_trades`

nên được bảo vệ bằng Row Level Security khi triển khai thật.

File chính sách RLS nằm tại:

```text
database/rls_policies.sql
```

---

## 11. Kết nối backend với database

Backend kết nối Supabase thông qua file:

```text
src/lib/supabase/server.ts
```

Các biến môi trường cần có trong `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

Lưu ý:

* `.env.local` chứa key thật và không được commit lên GitHub.
* `.env.example` chỉ chứa tên biến, không chứa key thật.
* `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng trong server-side API routes.

---

## 12. Kết luận

Database Supabase đã được thiết kế để phục vụ các API backend và frontend của dự án Atelier Finance. Các bảng, index, view và dữ liệu demo đã hỗ trợ kiểm thử các chức năng chính như danh sách cổ phiếu, chi tiết cổ phiếu, dữ liệu giá, báo cáo tài chính, chỉ số tài chính, định giá và rủi ro.
