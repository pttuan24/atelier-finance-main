# DEPLOYMENT_GUIDE.md

## 1. Tổng quan

Tài liệu này hướng dẫn triển khai dự án Atelier Finance lên Vercel.

Dự án sử dụng:

* Next.js
* Supabase PostgreSQL
* Next.js App Router API Routes
* Environment Variables để cấu hình kết nối Supabase

Mục tiêu deploy:

* Frontend chạy được trên Vercel
* API routes hoạt động trên domain production
* Backend API kết nối được Supabase
* Không lộ secret key trong source code

---

## 2. Chuẩn bị trước khi deploy

Trước khi deploy, cần đảm bảo các file sau đã có trong project:

* `.env.example`
* `.gitignore`
* `BACKEND_API_DOCS.md`
* `DATABASE_SETUP.md`
* `TEST_REPORT.md`
* `database/schema.sql`
* `database/indexes.sql`
* `database/views.sql`
* `database/seed/seed_demo_data.sql`
* `database/checks/validation_queries.sql`

Kiểm tra local trước khi deploy:

```bash
npm install
npm run build
```

Nếu `npm run build` bị lỗi, cần sửa lỗi local trước khi deploy lên Vercel.

---

## 3. Biến môi trường cần cấu hình trên Vercel

Khi deploy lên Vercel, cần thêm các biến môi trường sau trong:

```text
Project → Settings → Environment Variables
```

Các biến cần thêm:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

Ý nghĩa:

* `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public anon key của Supabase.
* `SUPABASE_SERVICE_ROLE_KEY`: service role key dùng trong API route phía server.
* `DATABASE_URL`: connection string database, có thể để trống nếu project chưa dùng migration tool.

Lưu ý bảo mật:

* Không commit file `.env.local` lên GitHub.
* Không đưa key thật vào `.env.example`.
* Không ghi key thật trong file `.md`.
* `SUPABASE_SERVICE_ROLE_KEY` chỉ được dùng ở server-side API routes.
* Không dùng `SUPABASE_SERVICE_ROLE_KEY` trong client component.

---

## 4. Deploy bằng GitHub và Vercel Dashboard

### Bước 1: Đẩy code lên GitHub

Trong thư mục project, chạy:

```bash
git add .
git commit -m "Complete backend database API integration"
git push
```

Nếu máy chưa có Git, cần cài Git for Windows trước.

---

### Bước 2: Import project trên Vercel

Vào Vercel Dashboard:

```text
Add New → Project
```

Sau đó:

1. Chọn GitHub repository của dự án.
2. Bấm `Import`.
3. Framework Preset chọn `Next.js`.
4. Root Directory chọn đúng thư mục có file `package.json`.
5. Thêm Environment Variables.
6. Bấm `Deploy`.

---

## 5. Cấu hình Build Settings trên Vercel

Cấu hình đúng cho project Next.js:

```text
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install hoặc để mặc định
Output Directory: để trống hoặc dùng mặc định của Next.js
Root Directory: thư mục chứa package.json
```

Không đặt Output Directory là:

```text
public
```

Vì `public` trong Next.js chỉ là thư mục chứa static assets, không phải thư mục output sau khi build.

Nếu gặp lỗi:

```text
No Output Directory named "public" found after the Build completed.
```

thì cần vào:

```text
Project → Settings → Build & Development Settings
```

và xóa cấu hình `Output Directory = public`, sau đó redeploy.

---

## 6. Redeploy sau khi sửa cấu hình hoặc thêm env

Nếu đã deploy nhưng sau đó mới thêm Environment Variables hoặc sửa Build Settings, cần redeploy:

```text
Project → Deployments → Chọn deployment mới nhất → Redeploy
```

Nếu không redeploy, Vercel có thể chưa nhận biến môi trường mới.

---

## 7. Kiểm tra sau deploy

Sau khi deployment có trạng thái `Ready`, lấy domain thật từ Vercel.

Ví dụ domain thật có dạng:

```text
https://atelier-finance-main-xxxxx.vercel.app
```

Kiểm tra các API:

```text
https://<domain-that>/api/stocks
https://<domain-that>/api/stocks/VCB
https://<domain-that>/api/stocks/VCB/prices
https://<domain-that>/api/stocks/VCB/financials
https://<domain-that>/api/stocks/VCB/ratios
https://<domain-that>/api/stocks/VCB/valuation
https://<domain-that>/api/stocks/VCB/risk
```

Kết quả mong muốn:

```json
{
  "error": null
}
```

Không sử dụng link ví dụ như:

```text
https://atelier-finance-xxx.vercel.app
```

vì đây chỉ là placeholder, không phải domain thật.

---

## 8. Lỗi thường gặp khi deploy

### 8.1. Missing NEXT_PUBLIC_SUPABASE_URL

Lỗi:

```text
Missing NEXT_PUBLIC_SUPABASE_URL
```

Nguyên nhân:

* Chưa thêm biến môi trường trên Vercel.
* Thêm env rồi nhưng chưa redeploy.

Cách xử lý:

1. Vào `Project → Settings → Environment Variables`.
2. Thêm `NEXT_PUBLIC_SUPABASE_URL`.
3. Thêm `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Thêm `SUPABASE_SERVICE_ROLE_KEY`.
5. Redeploy.

---

### 8.2. No Output Directory named "public"

Lỗi:

```text
No Output Directory named "public" found after the Build completed.
```

Nguyên nhân:

* Vercel đang cấu hình sai Output Directory.

Cách xử lý:

1. Vào `Project → Settings → Build & Development Settings`.
2. Framework Preset chọn `Next.js`.
3. Output Directory để trống.
4. Redeploy.

---

### 8.3. Deployment Not Found

Lỗi:

```text
404: NOT_FOUND
Code: DEPLOYMENT_NOT_FOUND
```

Nguyên nhân:

* Mở sai link Vercel.
* Dùng link ví dụ thay vì domain thật.
* Deployment chưa thành công.

Cách xử lý:

1. Vào Vercel Project.
2. Kiểm tra deployment mới nhất có trạng thái `Ready`.
3. Copy domain thật trong phần `Domains`.
4. Test lại API bằng domain thật.

---

### 8.4. API trả 404

Nguyên nhân có thể:

* Chưa push đủ file route lên GitHub.
* Sai vị trí file `route.ts`.
* Vercel deploy code cũ.

Cần kiểm tra các file sau có tồn tại trong GitHub:

```text
src/app/api/stocks/route.ts
src/app/api/stocks/[ticker]/route.ts
src/app/api/stocks/[ticker]/prices/route.ts
src/app/api/stocks/[ticker]/financials/route.ts
src/app/api/stocks/[ticker]/ratios/route.ts
src/app/api/stocks/[ticker]/valuation/route.ts
src/app/api/stocks/[ticker]/risk/route.ts
```

Sau đó commit, push và redeploy.

---

## 9. Trạng thái deploy hiện tại

Trạng thái hiện tại:

```text
Deploy thành công trên Vercel

Link deploy production:

```text
https://atelier-finance-main-f3z7c63i4-pttuan24s-projects.vercel.app
```
Link deployment đã kiểm thử:
```text
https://atelier-finance-main-f3z7c63i4-pttuan24s-projects.vercel.app
---

## 10. Kết luận

Project đã có cấu trúc sẵn sàng để deploy lên Vercel. Để deploy thành công, cần đảm bảo Vercel nhận đúng framework `Next.js`, không cấu hình Output Directory là `public`, thêm đầy đủ biến môi trường Supabase và redeploy sau khi thay đổi cấu hình.

Sau khi deployment có trạng thái `Ready` và các API production trả về JSON hợp lệ, có thể cập nhật trạng thái thành:

```text
Deploy thành công.
```
