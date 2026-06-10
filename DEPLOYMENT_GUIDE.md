# DEPLOYMENT_GUIDE.md

## 1. Tổng quan

Tài liệu này hướng dẫn triển khai dự án Atelier Finance lên Vercel.

Dự án sử dụng:

- Next.js
- Supabase PostgreSQL
- Next.js API Routes
- Environment Variables cho cấu hình Supabase

---

## 2. Chuẩn bị trước khi deploy

Cần đảm bảo các file sau đã có:

- `.env.example`
- `BACKEND_API_DOCS.md`
- `DATABASE_SETUP.md`
- `TEST_REPORT.md`
- `database/schema.sql`
- `database/indexes.sql`
- `database/views.sql`
- `database/seed/seed_demo_data.sql`

Kiểm tra local trước khi deploy:

```bash
npm install
npm run build