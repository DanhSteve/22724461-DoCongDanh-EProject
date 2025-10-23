# 📮 Hướng dẫn Test API với Postman

> **Tài liệu hướng dẫn test đầy đủ các API endpoints của hệ thống Microservices**

---

## 🔧 Cấu hình ban đầu

**Base URL (API Gateway):** `http://localhost:3003`

**Các Service và Port:**
- 🌐 API Gateway: `http://localhost:3003`
- 🔐 Auth Service: `http://localhost:3003/auth/api/v1`
- 📦 Product Service: `http://localhost:3003/products/api/v1`
- 🛒 Order Service: `http://localhost:3003/orders/api/v1`

**Yêu cầu:**
- Docker containers đang chạy (`docker compose up -d`)
- Postman đã cài đặt

---

### Lệnh push lên github
```bash
git add .

git commit -m " "

git push
```

## 📋 BƯỚC 1: Đăng ký tài khoản (Register)

```http
POST http://localhost:3003/auth/api/v1/register
Content-Type: application/json

{
  "username": "danhtest",
  "password": "123456"
}
```

**Response Success (200):**
```json
{
  "_id": "...",
  "username": "danhtest"
}
```

**Response Error (400):**
```json
{
  "message": "Username already taken"
}
```

---

## 📋 BƯỚC 2: Đăng nhập (Login)

```http
POST http://localhost:3003/auth/api/v1/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

**Response Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

⚠️ **QUAN TRỌNG:** Sao chép token để dùng cho các request tiếp theo!

---

## 📋 BƯỚC 3: Xem Dashboard/Profile

```http
GET http://localhost:3003/auth/api/v1/dashboard
Content-Type: application/json
Authorization: Bearer <YOUR_TOKEN>
```

**Response Success (200):**
```json
{
  "username": "testuser",
  "orders": [...]
}
```

---

## 📋 BƯỚC 4: Thêm sản phẩm mới

```http
POST http://localhost:3003/products/api/v1/add
Content-Type: application/json
Authorization: Bearer <YOUR_TOKEN>

{
  "name": "iPhone 15 Pro Max",
  "description": "Điện thoại cao cấp",
  "price": 30000000,
  "quantity": 50
}
```

**Response Success (201):**
```json
{
  "_id": "6718abc123...",
  "name": "iPhone 15 Pro Max",
  "price": 30000000,
  "quantity": 50
}
```

⚠️ **Lưu lại `_id`** để dùng cho việc tạo đơn hàng!

---

## 📋 BƯỚC 5: Lấy danh sách sản phẩm

```http
GET http://localhost:3003/products/api/v1
Authorization: Bearer <YOUR_TOKEN>
```

**Response Success (200):**
```json
[
  {
    "_id": "6718abc123...",
    "name": "iPhone 15 Pro Max",
    "price": 30000000,
    "quantity": 50
  }
]
```

---

## 📋 BƯỚC 6: Lấy sản phẩm theo ID

```http
GET http://localhost:3003/products/api/v1/id?id=6718abc123...
Authorization: Bearer <YOUR_TOKEN>
```

**Response Success (200):**
```json
{
  "_id": "6718abc123...",
  "name": "iPhone 15 Pro Max",
  "description": "Điện thoại cao cấp",
  "price": 30000000,
  "quantity": 50
}
```

---

## 📋 BƯỚC 7: Tạo đơn hàng

```http
POST http://localhost:3003/products/api/v1/buy
Content-Type: application/json
Authorization: Bearer <YOUR_TOKEN>

{
  "ids": [
    {
      "id": "6718abc123...",
      "quantity": 2
    }
  ]
}
```

**Response Success (200):**
```json
{
  "message": "Order created successfully"
}
```

**Business Logic:**
- Mỗi user tối đa 5 đơn/ngày
- Đơn hàng > 24h sẽ không xử lý
- Phải đủ số lượng trong kho

---

## 📋 BƯỚC 8: Lấy danh sách đơn hàng

```http
GET http://localhost:3003/orders/api/v1
```

**Response Success (200):**
```json
[
  {
    "_id": "6718order...",
    "username": "testuser",
    "products": [...],
    "totalPrice": 60000000,
    "status": "completed"
  }
]
```

---

## 📋 BƯỚC 9: Hủy đơn hàng

```http
PUT http://localhost:3003/orders/api/v1/cancle/<ORDER_ID>
```

**Response Success (200):**
```json
{
  "message": "Đã Hủy Đơn Hàng"
}
```

---

## 🔄 WORKFLOW ĐẦY ĐỦ (E2E Test)

```
1. Register    → Tạo account
2. Login       → Lấy JWT token
3. Dashboard   → Xem profile
4. Add Product → Tạo sản phẩm (lưu ID)
5. Get Products→ Xem danh sách
6. Get by ID   → Xem chi tiết 1 sp
7. Create Order→ Đặt hàng (dùng product ID)
8. Get Orders  → Xem đơn hàng
9. Cancel Order→ Hủy đơn (nếu cần)
```

---

## ⚠️ Lỗi thường gặp

### 401 Unauthorized
- ❌ Thiếu header `Authorization: Bearer <token>`
- ❌ Token hết hạn → Login lại

### 404 Not Found
- ❌ URL sai
- ❌ Service chưa chạy → `docker compose ps`

### 500 Server Error
- ❌ MongoDB/RabbitMQ chưa khởi động
- ❌ Xem logs: `docker compose logs -f`

---

## 💡 Tips

**Dùng Postman Environment:**
```javascript
// Lưu token tự động sau khi login
pm.environment.set("TOKEN", pm.response.json().token);
```

**Biến môi trường:**
- `BASE_URL` = `http://localhost:3003`
- `TOKEN` = `<JWT_TOKEN>`

**Collection Structure:**
- 📁 Auth (Register, Login, Dashboard)
- 📁 Product (Add, List, Get by ID)
- 📁 Order (Create, List, Cancel)

---

🧑‍💻 **Tác giả:** ĐỖ CÔNG DANH   
📅 **Updated:** 2025-10-23
