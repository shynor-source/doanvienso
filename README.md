# 📱 Đoàn Viên Số — UI/UX Design Prototype

> **Đây là bản thiết kế giao diện (design prototype) cho ứng dụng di động Đoàn Viên Số.**
> Bản ứng dụng Android (Flutter) triển khai từ thiết kế này nằm trong dự án `doanvien_so` cùng hệ thống.

Bản thiết kế tương tác mô phỏng đầy đủ 11 màn hình của nền tảng **quản lý đoàn viên & hoạt động Đoàn TNCS Hồ Chí Minh** dành cho phường/xã và khu công nghiệp tỉnh Đồng Nai — từ điểm danh QR chống gian lận, sinh hoạt bù cho công nhân làm ca kíp, đến dashboard tổng hợp 12 chi đoàn của Đoàn phường.

✅ **Trạng thái:** hoàn tất Vòng 1 (MVP) — toàn bộ màn hình tương tác được với dữ liệu mẫu.

---

## 🧩 Vì sao thiết kế như vậy

| Quyết định thiết kế | Lý do |
|---|---|
| **Mobile-first, khung chuẩn 390×844 dp** | 100% người dùng cuối thao tác trên điện thoại (công nhân KCN, cán bộ cơ sở); tối đa 3 lần chạm đến mọi tính năng |
| **Điều hướng phân vai (RBAC) ngay từ đăng nhập** | 3 vai trò — Bí thư Chi đoàn / Đoàn viên-Công nhân KCN / Cán bộ Đoàn Phường — thấy 3 không gian làm việc khác nhau, rút ngắn đường dẫn thao tác |
| **Thanh tab dưới cố định 5 mục** | Công nhân quay ca có thể thao tác một tay |
| **Màu chủ đạo `#161891`, nền `#F5F7FB`, thẻ trắng bo góc 16px** | Giữ tính trang trọng của hệ thống chính trị, hiện đại và dễ đọc dưới ánh sáng xưởng |
| **Font Be Vietnam Pro (400–800)** | Hiển thị dấu tiếng Việt chuẩn, phân cấp thông tin rõ bằng chữ đậm |
| **Dữ liệu mẫu có ngữ cảnh thực** | Chi đoàn Khu phố 5 — P. Tam Hiệp, TP. Biên Hòa: 46 đoàn viên (31 tại chỗ / 12 đi làm xa / 3 chuyển sinh hoạt) — người xem hiểu bối cảnh ngay, không có nội dung "Lorem ipsum" |
| **Offline-first + QR động + geofence** | Đối chiếu trực tiếp 3 bài toán thực địa: quét hộ, ca kíp vắng họp, tổng hợp thủ công |

## 🗂 Cấu trúc màn hình

| # | Màn hình | Vai trò |
|---|---|---|
| 01 | Đăng nhập & chọn vai trò | Chung |
| 02 | Trang chủ Bí thư | Bí thư |
| 03 | Tạo mã QR điểm danh (QR động, geofence) | Bí thư |
| 04 | Quét QR điểm danh (camera + GPS) | Đoàn viên |
| 05 | Danh bạ & hồ sơ đoàn viên (lọc, nhập Excel) | Bí thư |
| 06 | Tổng quan Đoàn phường (xếp hạng 12 chi đoàn) | Cán bộ phường |
| 07 | Trang chủ Đoàn viên | Đoàn viên |
| 08 | Lịch hoạt động & sinh hoạt bù | Đoàn viên |
| 09 | Thi đua & khen thưởng | Đoàn viên |
| 10 | Bảng tin — mạng xã hội Đoàn | Chung |
| 11 | Tiện ích | Chung |

```
src/
├── App.jsx                  — định tuyến màn hình theo vai trò + trạng thái toàn cục
├── context/AppContext.jsx   — state tập trung (role, điểm danh, duyệt đơn, thông báo…)
├── data/mockData.js         — dữ liệu mẫu mô phỏng 1 chi đoàn thực tế (thay backend)
├── components/              — Header, BottomNav, các modal dùng chung
└── screens/                 — 11 màn hình
```

## 🛠 Công nghệ

- **React 18 + Vite** — prototype tương tác, build tĩnh triển khai nhanh
- **Tailwind CSS 3** — design token: màu, spacing, bo góc thống nhất toàn bộ màn hình
- **React Context** — quản lý vai trò đăng nhập và trạng thái nghiệp vụ
- **Mock data module** — dữ liệu mẫu tách riêng, thiết kế để sau này thay bằng API thật

> 📱 Bản triển khai mobile cùng thiết kế: **Flutter 3**  — cấu trúc màn hình và state bám 1:1 với bản design này, dùng chung toàn bộ design token.

## 🚀 Chạy bản thiết kế

```bash
npm install
npm run dev       # chạy local: http://localhost:5173

npm run build     # build tĩnh vào dist/ (deploy được mọi nơi)
```

**Đăng nhập bản demo:** chọn vai trò (Bí thư Chi đoàn / Đoàn viên / Cán bộ Đoàn phường) → bấm **Đăng nhập** — không cần OTP thật, toàn bộ dữ liệu là dữ liệu mẫu.

## 🌐 Triển khai (deploy)

Bản build là trang tĩnh, triển khai được trên GitHub Pages / Cloudflare Pages / Netlify:
1. `npm run build`
2. Trỏ dịch vụ hosting tĩnh vào thư mục `dist/` (hoặc dùng GitHub Actions build tự động khi push).

## 📄 Ghi chú

- Toàn bộ tên nhân vật, số điện thoại, mã số… trong dữ liệu mẫu là **dữ liệu hư cấu** phục vụ demo.
- Phát triển tiếp (Vòng 2): thay mock data bằng API, xác thực OTP qua Zalo, QR + geofence xác thực phía server, xuất báo cáo PDF/Word.
- Thiết kế phục vụ dự án **Đoàn Viên Số — Hackathon Đồng Nai 2026**.
