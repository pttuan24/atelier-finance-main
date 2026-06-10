# TEST_REPORT.md

## 1. Mục tiêu kiểm thử

Tài liệu này ghi lại kết quả kiểm thử backend, database, API và frontend integration của dự án Atelier Finance.

Người thực hiện: Backend, Database & Deployment Lead.

---

## 2. Môi trường kiểm thử

- Framework: Next.js
- Database: Supabase PostgreSQL
- Backend API: Next.js App Router API Routes
- Local URL: http://localhost:3000
- File môi trường local: .env.local

---

## 3. Kết quả kiểm thử API

| API | Mục đích | Kết quả |
|---|---|---|
| GET /api/stocks | Lấy danh sách cổ phiếu | Đạt |
| GET /api/stocks/VCB | Lấy chi tiết cổ phiếu | Đạt |
| GET /api/stocks/VCB/prices | Lấy dữ liệu giá | Đạt |
| GET /api/stocks/VCB/financials | Lấy báo cáo tài chính | Đạt |
| GET /api/stocks/VCB/ratios | Lấy chỉ số tài chính | Đạt |
| GET /api/stocks/VCB/valuation | Lấy kết quả định giá | Đạt |
| GET /api/stocks/VCB/risk | Lấy dữ liệu rủi ro | Đạt |

---

## 4. Kết quả kiểm thử database

| Nội dung kiểm thử | Kết quả |
|---|---|
| Bảng `stocks` có dữ liệu VCB, FPT | Đạt |
| Bảng `stock_prices` có dữ liệu giá | Đạt |
| Bảng `financial_reports` có dữ liệu báo cáo tài chính | Đạt |
| Bảng `financial_ratios` có dữ liệu chỉ số tài chính | Đạt |
| Bảng `valuation_results` có dữ liệu định giá | Đạt |
| Bảng `risk_assessments` có dữ liệu rủi ro | Đạt |
| View `stock_overview` hoạt động | Đạt |

---

## 5. Kết quả kiểm thử frontend integration

| Module | API sử dụng | Kết quả |
|---|---|---|
| Stock selector | `/api/stocks` | Đạt |
| Stock detail preview | `/api/stocks/[ticker]` | Đạt |
| Price-Volume-Time | `/api/stocks/[ticker]/prices` | Đạt |
| Báo cáo tài chính | `/api/stocks/[ticker]/financials`, `/ratios` | Đạt |
| Định giá | `/api/stocks/[ticker]/valuation` | Đạt |
| Rủi ro & minh bạch | `/api/stocks/[ticker]/risk` | Đạt |

---

## 6. Các lỗi đã xử lý

- Sửa lỗi route 404 do sai vị trí hoặc thiếu `route.ts`.
- Sửa lỗi dynamic route params trong Next.js App Router.
- Sửa lỗi workspace root do có nhiều `package-lock.json`.
- Sửa lỗi hydration warning bằng `suppressHydrationWarning`.
- Thay một phần dữ liệu mock bằng dữ liệu lấy từ Supabase API.

---

## 7. Ghi chú về dữ liệu

Dữ liệu hiện tại bao gồm dữ liệu demo kỹ thuật phục vụ kiểm thử cho các mã VCB và FPT. Khi nhóm có nguồn dữ liệu thật đầy đủ hơn, có thể import bổ sung vào các bảng tương ứng mà không cần thay đổi lớn ở API.

---

## 8. Kết luận

Backend, database, API và frontend integration đã hoạt động trong môi trường local. Các API chính trả về JSON hợp lệ và frontend có thể lấy dữ liệu từ Supabase thông qua API routes.
---

## 9. Kết quả build

Lệnh kiểm thử:

```bash
npm run build
Kết quả:
Build thành công
Kết luận: project có thể build production ở môi trường local.