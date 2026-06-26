# Hệ thống quản lý & cho thuê nhà trọ (RoomHub)

Đồ án tốt nghiệp — SVTH: **Lại Xuân Chính** · MSV: **0182166**

Hệ thống gồm 2 phần:
- **`be_nest/`** — Backend API bằng **NestJS** + **MongoDB** (Mongoose).
- **`fe_next/`** — Frontend bằng **Next.js 14** (React, TypeScript, Tailwind CSS, Ant Design).

** Cấu trúc đồ án được lấy cảm hứng từ khóa học 
[FULL] Thực Hành FullStack Next.js/Nest.js (Typescript) Dự Án JWT | Tự Học Coding với Hỏi Dân IT có đường link là https://www.youtube.com/watch?v=fthiw89XG4s&list=PLncHg6Kn2JT5009M5nlo_un6wlIHM-0HS

---

## 1. Yêu cầu môi trường

| Phần mềm | Phiên bản khuyến nghị | Ghi chú |
|----------|----------------------|---------|
| **Node.js** | ≥ 18 (khuyến nghị 20 LTS) | Tải tại https://nodejs.org |
| **npm** | ≥ 9 | Đi kèm Node.js |
| **Docker Desktop** | mới nhất | Dùng để chạy MongoDB nhanh (khuyến nghị) |
| **MongoDB** | 6/7 | Nếu không dùng Docker thì cài MongoDB thủ công |
| **Git** | mới nhất | Tải mã nguồn |

> Kiểm tra: `node -v` · `npm -v` · `docker -v`

---

## 2. Lấy mã nguồn

```bash
git clone <đường-dẫn-repo>
cd DATN2026-2_CNTT_CN_0182166_LaiXuanChinh_Baocao_20260611_v1
```

Dự án có 2 thư mục con `be_nest` và `fe_next` — cần cài đặt **cả hai**.

---

## 3. Cài đặt Backend (`be_nest`)

### 3.1. Khởi động MongoDB bằng Docker (khuyến nghị)
Trong thư mục `be_nest` đã có sẵn `docker-compose.yml` (MongoDB chạy ở cổng **27018**):

```bash
cd be_nest
docker compose up -d
```
> Lệnh này tạo MongoDB với tài khoản `root` / mật khẩu `123456`, ánh xạ cổng `27018` (host) → `27017` (container).
> Kiểm tra container đang chạy: `docker ps`.

*(Nếu không dùng Docker:* tự cài MongoDB và sửa lại `MONGODB_URI` trong file `.env` cho khớp.)*

### 3.2. Tạo file cấu hình `.env`
Tạo file `be_nest/.env` với nội dung:

```env
PORT=8080
MONGODB_URI=mongodb://root:123456@localhost:27018/roomhub?authSource=admin
JWT_SECRET=<chuoi-bi-mat-tuy-y>
JWT_ACCESS_TOKEN_EXPIRED=7d
MAIL_USER=<email-gmail-cua-ban>
MAIL_PASSWORD=<mat-khau-ung-dung-gmail>
```

> **Lưu ý về email** (dùng để gửi mã kích hoạt tài khoản):
> - `MAIL_USER`: địa chỉ Gmail của bạn.
> - `MAIL_PASSWORD`: **App Password** (mật khẩu ứng dụng 16 ký tự), KHÔNG phải mật khẩu đăng nhập Gmail. Tạo tại: Google Account → Security → 2-Step Verification → App passwords.

### 3.3. Cài thư viện & chạy
```bash
npm install
npm run dev        # chạy chế độ watch (tự reload khi sửa code)
```
- Backend chạy tại: **http://localhost:8080**
- Tất cả API có tiền tố `/api` (ví dụ: `http://localhost:8080/api/auth/login`).

Các lệnh khác:
```bash
npm run start:prod   # chạy bản build production (cần npm run build trước)
npm run build        # biên dịch sang thư mục dist/
```

---

## 4. Cài đặt Frontend (`fe_next`)

### 4.1. Tạo file cấu hình `.env`
Tạo file `fe_next/.env`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXTAUTH_SECRET=<chuoi-bi-mat-tuy-y>
NEXTAUTH_URL=http://localhost:3000
NODE_OPTIONS=--max-old-space-size=4096
```
> `NEXT_PUBLIC_BACKEND_URL` phải trỏ đúng tới backend (mục 3). `NEXTAUTH_SECRET` là chuỗi ngẫu nhiên bất kỳ (ví dụ một UUID).

### 4.2. Cài thư viện & chạy
```bash
cd fe_next
npm install
npm run dev
```
- Frontend chạy tại: **http://localhost:3000**
- Trang quản trị: **http://localhost:3000/dashboard**

Các lệnh khác:
```bash
npm run build      # build production
npm run start      # chạy bản production sau khi build
```

---

## 5. Thứ tự khởi động (tóm tắt nhanh)

Mở **2 cửa sổ terminal**:

```bash
# Terminal 1 — Backend
cd be_nest
docker compose up -d      # bật MongoDB (chỉ cần lần đầu / khi chưa chạy)
npm install               # chỉ cần lần đầu
npm run dev

# Terminal 2 — Frontend
cd fe_next
npm install               # chỉ cần lần đầu
npm run dev
```

Sau đó mở trình duyệt: **http://localhost:3000**

---

## 6. Cổng (port) sử dụng

| Dịch vụ | Cổng |
|---------|------|
| Frontend (Next.js) | 3000 |
| Backend (NestJS) | 8080 |
| MongoDB (Docker) | 27018 |

---

## 7. Xử lý lỗi thường gặp

- **Frontend không gọi được API / lỗi mạng** → kiểm tra backend đã chạy ở cổng 8080 chưa và `NEXT_PUBLIC_BACKEND_URL` trong `fe_next/.env` có đúng không.
- **Backend báo lỗi kết nối MongoDB** → kiểm tra Docker MongoDB đã chạy (`docker ps`) và `MONGODB_URI` đúng cổng `27018`.
- **Cổng bị chiếm (EADDRINUSE)** → đổi `PORT` trong `.env` (backend) hoặc chạy `npm run dev -- -p 3001` (frontend).
- **Không gửi được email kích hoạt** → kiểm tra `MAIL_USER` / `MAIL_PASSWORD` (phải là App Password của Gmail, đã bật xác minh 2 bước).
- **Cài `npm install` lỗi** → xóa `node_modules` và `package-lock.json` rồi cài lại; đảm bảo Node ≥ 18.

---

## 8. Công nghệ chính

**Backend:** NestJS 11, Mongoose 8, Passport (JWT + Local), bcrypt, Nodemailer.
**Frontend:** Next.js 14, React 18, Ant Design 5, Tailwind CSS 3, Recharts, Leaflet (bản đồ).
