# Fashionista-s_Haven - Backend

Đây là mã nguồn Backend cho website bán quần áo, được xây dựng bằng **Node.js, Express và PostgreSQL**.

## 🚀 Cách chạy Server

### 1. Cài đặt môi trường
Đảm bảo bạn đã cài đặt:
- [Node.js](https://nodejs.org/) (phiên bản 18 trở lên)
- [PostgreSQL](https://www.postgresql.org/)

### 2. Cài đặt thư viện
Mở terminal tại thư mục gốc của dự án (`e:\Fashionista-s_Haven`) và chạy lệnh:
```bash
npm install
```

### 3. Cấu hình biến môi trường (`.env`)
Kiểm tra file `.env` của bạn và đảm bảo các thông số sau đã đầy đủ:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASS=123456
DB_NAME=clothing_shop
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PAYMENT_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Khởi tạo cơ sở dữ liệu
Nếu bạn chưa chạy script SQL, bạn có thể sử dụng file `database_schema.sql` để tạo cấu trúc bảng trong PostgreSQL của mình.

### 5. Chạy Server
Dành cho môi trường phát triển (tự động restart khi sửa code):
```bash
npm run dev
```

Dành cho môi trường production:
```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

---
*Xem chi tiết các API tại [api_docs.md](file:///C:/Users/Admin/.gemini/antigravity/brain/ce3b279f-80ff-467d-8ebb-05602002b73a/api_docs.md)*