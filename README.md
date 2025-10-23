# 🐇 Case Study: Microservices với RabbitMQ, API Gateway & JWT

Dự án minh họa cách xây dựng hệ thống **Microservices** trong Node.js, sử dụng:
- 🐳 **Docker** để container hóa  
- 🐇 **RabbitMQ** để giao tiếp giữa các service  
- 🔐 **JWT** để xác thực người dùng  
- 🚪 **API Gateway** để định tuyến yêu cầu  

---

## ⚡ QUICK START - CÁC LỆNH THƯỜNG DÙNG

```bash
# 🚀 Chạy dự án lần đầu
docker compose up --build

# ▶️ Khởi động (đã build rồi)
docker compose start

# ⏸️ Tạm dừng
docker compose stop

# 🔄 Khởi động lại
docker compose restart

# 🛠️ Sau khi sửa code - Rebuild
docker compose up --build -d

# 🔄 Restart 1 service cụ thể (VD: sau khi sửa product controller)
docker compose restart danh_product_service

# 📊 Xem logs
docker compose logs -f
docker-compose ps
# 🛑 Dừng và xóa hết (bao gồm data)
docker compose down -v
```

**📍 Endpoints:**
- API Gateway: http://localhost:3003
- Product Service: http://localhost:3001 (có endpoint GET /id mới)
- Auth Service: http://localhost:3000
- RabbitMQ UI: http://localhost:15672 (guest/guest)

---

## 📤 GIT/GITHUB - CÁC LỆNH THƯỜNG DÙNG

### 🎯 Khởi tạo Git lần đầu (nếu chưa có .git)

```bash
# 1. Khởi tạo Git repository
git init

# 2. Thêm tất cả file vào staging
git add .

# 3. Commit lần đầu
git commit -m "Initial commit"

# 4. Đổi tên branch thành main (nếu cần)
git branch -M main

# 5. Thêm remote repository (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 6. Push lần đầu lên GitHub
git push -u origin main
```

### 📋 Các lệnh Git cơ bản

```bash
# 📋 Kiểm tra trạng thái file thay đổi
git status

# ➕ Thêm tất cả file đã thay đổi
git add .

# ➕ Thêm file cụ thể
git add productController.js
git add README.md

# 💾 Commit với message
git commit -m "Add GET /id endpoint to product service"

# 📤 Push lên GitHub (lần đầu)
git push -u origin main

# 📤 Push lên GitHub (lần sau)
git push

# 🔄 Pull code mới nhất từ GitHub
git pull

# 🌿 Tạo branch mới
git checkout -b feature/add-product-by-id

# 🔀 Chuyển branch
git checkout main

# 📜 Xem lịch sử commit
git log --oneline

# ↩️ Hủy thay đổi chưa commit
git restore .

# 🔄 Cập nhật remote repository
git remote -v
```

**💡 Workflow thường dùng:**
```bash
# 1. Sau khi sửa code
git status                                    # Xem file nào đã thay đổi
git add .                                     # Thêm tất cả file
git commit -m "Update product controller"    # Commit với message rõ ràng
git push                                      # Push lên GitHub

# 2. Trước khi bắt đầu code (lấy code mới nhất)
git pull                                      # Kéo code mới từ GitHub
```

---

## 🚀 HƯỚNG DẪN CHI TIẾT

### Yêu cầu:
- Docker Desktop đã cài đặt và đang chạy
- File `.env` đã được cấu hình (có sẵn trong dự án)

### 1️⃣ Chạy toàn bộ hệ thống lần đầu:
```bash
docker compose up --build
```

**Hoặc chạy ở chế độ background:**
```bash
docker compose up --build -d
```

### 2️⃣ Dừng hệ thống:
```bash
docker compose down
```

**Dừng và xóa toàn bộ data (volumes):**
```bash
docker compose down -v
```

### 3️⃣ Xem logs:
```bash
# Xem tất cả logs
docker compose logs -f

# Xem log của service cụ thể
docker compose logs -f danh_product_service
docker compose logs -f danh_auth_service
```

### 4️⃣ Kiểm tra trạng thái services:
```bash
docker compose ps
```

### 📍 Các endpoint sau khi chạy:
- **API Gateway**: http://localhost:3003
- **Auth Service**: http://localhost:3000
- **Product Service**: http://localhost:3001
- **Order Service**: http://localhost:3002
- **RabbitMQ Management UI**: http://localhost:15672 (guest/guest)
- **MongoDB**: localhost:27018

---

## 🔧 CÁC LỆNH THƯỜNG DÙNG KHI PHÁT TRIỂN

### ▶️ Khởi động hệ thống (đã build rồi):
```bash
docker compose start
```

### ⏸️ Tạm dừng (không xóa containers):
```bash
docker compose stop
```

### 🔄 Khởi động lại toàn bộ:
```bash
docker compose restart
```

### 🔄 Khởi động lại 1 service cụ thể:
```bash
docker compose restart danh_product_service
```

### 🛠️ Sau khi sửa code - Rebuild và chạy lại:
```bash
# Rebuild tất cả services
docker compose up --build -d

# Hoặc rebuild chỉ 1 service cụ thể
docker compose up --build -d danh_product_service
```

### 🔍 Vào bên trong container để debug:
```bash
# Vào container product service
docker compose exec danh_product_service sh

# Vào container auth service
docker compose exec danh_auth_service sh
```

### 🧹 Dọn dẹp toàn bộ (containers, networks, volumes):
```bash
docker compose down -v
docker system prune -a
```

### 📊 Xem resource usage:
```bash
docker stats
```

### 💡 TIP: Sau khi sửa code JavaScript/Node.js
Nếu dùng volumes mount (đã cấu hình), code sẽ tự động reload. Nếu không:
```bash
docker compose restart danh_product_service
```

---

## ⚙️ Cài đặt RabbitMQ trên Docker (Tùy chọn - nếu chạy riêng lẻ)

Sử dụng lệnh này để khởi chạy RabbitMQ (đã tích hợp trong docker-compose.yml):

```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
```

> 🖥️ Giao diện quản lý: [http://localhost:15672](http://localhost:15672)  
> 👤 Tài khoản mặc định: `guest` / `guest`

📸 *Ảnh minh họa:*  
![RabbitMQ Setup](public/1.png)

---

## 🌐 Cấu hình lại API Gateway

Cập nhật đường dẫn định tuyến để API Gateway điều hướng đúng đến các service (User, Product, Order,...)

📸 *Ảnh minh họa:*  
![Chỉnh đường dẫn Gateway](public/2_chinh_duong_dan.png)

---

## 🔑 Thêm thông tin đăng nhập & ký JWT

Cập nhật phần logic đăng nhập để tạo **token JWT** giúp xác thực người dùng.

📸 *Ảnh minh họa:*  
![Thêm JWT Sign](public/3.png)

---

## 🧩 Bổ sung các đoạn code phục vụ cho Case Study

Thêm các chức năng hỗ trợ liên quan đến microservices, giao tiếp RabbitMQ, v.v.

📸 *Ảnh minh họa:*  
![Thêm Code Case Study](public/4_them_cac_code_phuc_vu_cho_case_study.png)

---

## 🧪 Kiểm thử API với Postman

### 🧍‍♂️ Đăng ký tài khoản
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`

📸  
![Test Register API](public/5_register_post_man.png)

---

### 🔐 Đăng nhập tài khoản
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`

📸  
![Test Login API](public/6_login_post_man.png)

---

### 🛒 Thêm sản phẩm
- **Method:** `POST`
- **Endpoint:** `/api/products`

📸  
![Test Add Product](public/7_add_product.png)

---

### 📦 Xem danh sách sản phẩm
- **Method:** `GET`
- **Endpoint:** `/api/products`

📸  
![Get All Products](public/8_get_more_product.png)

---

### 🧾 Tạo đơn hàng
- **Method:** `POST`
- **Endpoint:** `/api/orders`

📸  
![Create Order](public/9_create_order.png)

---

---

## � 6. CÁC LỆNH QUẢN LÝ DỰ ÁN

### 🟢 Khởi động dự án (Start)

```bash
# Khởi động tất cả containers (chạy ở background)
docker-compose up -d

# Khởi động và rebuild lại images (nếu có thay đổi code)
docker-compose up --build -d

# Khởi động và xem logs trực tiếp (không chạy background)
docker-compose up
```

---

### 🔄 Khởi động lại dự án (Restart)

```bash
# Restart tất cả containers
docker-compose restart

# Restart một container cụ thể
docker-compose restart danh_auth_service
docker-compose restart danh_product_service
docker-compose restart danh_order_service
docker-compose restart danh_api_gateway
```

---

### 🔴 Dừng dự án (Stop)

```bash
# Dừng tất cả containers (giữ lại data)
docker-compose stop

# Dừng và xóa containers (giữ lại volumes/data)
docker-compose down

# Dừng, xóa containers VÀ xóa cả volumes/data
docker-compose down -v
```

---

### 📊 Kiểm tra trạng thái

```bash
# Xem danh sách containers đang chạy
docker ps

# Xem logs của tất cả services
docker-compose logs

# Xem logs của một service cụ thể
docker logs danh_auth_service
docker logs danh_product_service -f    # -f để theo dõi real-time

# Xem logs với số dòng giới hạn
docker logs --tail 100 danh_api_gateway
```

---

### 🛠️ Các lệnh hữu ích khác

```bash
# Xem resource usage (CPU, RAM)
docker stats

# Vào bên trong container
docker exec -it danh_auth_service sh

# Xóa tất cả containers và images không sử dụng
docker system prune -a

# Rebuild một service cụ thể
docker-compose up --build danh_auth_service
```

---

## �📮 7. HƯỚNG DẪN TEST POSTMAN CHI TIẾT

### 🔧 Cấu hình ban đầu

**Base URL (API Gateway):** `http://localhost:3003`

**Các Service và Port:**
- 🌐 API Gateway: `http://localhost:3003`
- 🔐 Auth Service: `http://localhost:3000` (qua Gateway)
- 📦 Product Service: `http://localhost:3001` (qua Gateway)
- 🛒 Order Service: `http://localhost:3002` (qua Gateway)
- 🗄️ MongoDB: `localhost:27018`
- 🐰 RabbitMQ Management: `http://localhost:15672`

---

### 📋 BƯỚC 1: Tạo tài khoản người dùng (Register) ✅

```
Method: POST
URL: http://localhost:3003/auth/api/v1/register
Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "username": "danhtest",
  "password": "123456"
}

Response Success (200):
{
  "_id": "...",
  "username": "danhtest"
}

Response Error (400):
{
  "message": "Username already taken"
}
```

---

### 📋 BƯỚC 2: Đăng nhập thành công (Login) ✅

**Tài khoản test có sẵn:** `testuser / 123456`

```
Method: POST
URL: http://localhost:3003/auth/api/v1/login
Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "username": "testuser",
  "password": "123456"
}

Hoặc dùng tài khoản vừa đăng ký:
{
  "username": "danhtest",
  "password": "123456"
}

Response Success (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ QUAN TRỌNG:** Sao chép token này để sử dụng cho các API tiếp theo!

---

### 📋 BƯỚC 2.1: Xem thông tin Dashboard/Profile

```
Method: GET
URL: http://localhost:3003/auth/api/v1/dashboard
Headers:
  Content-Type: application/json
  Authorization: Bearer <YOUR_TOKEN_HERE>

Response Success (200):
{
  "username": "testuser",
  "orders": [...]
}
```

### 📋 BƯỚC 3: Tạo thông tin sản phẩm mới (Add Product) ✅

```
Method: POST
URL: http://localhost:3003/products/api/v1/add
Headers:
  Content-Type: application/json
  Authorization: Bearer <YOUR_TOKEN_HERE>

Body (raw JSON):
{
  "name": "iPhone 15 Pro Max",
  "description": "Điện thoại cao cấp của Apple",
  "price": 30000000,
  "quantity": 50
}

Response Success (201):
{
  "_id": "6718abc123def456...",
  "name": "iPhone 15 Pro Max",
  "description": "Điện thoại cao cấp của Apple",
  "price": 30000000,
  "quantity": 50,
  "createdAt": "2025-10-21T10:30:00.000Z",
  "updatedAt": "2025-10-21T10:30:00.000Z"
}

Response Error (401):
{
  "message": "Unauthorized"
}
```

**Thêm nhiều sản phẩm để test:**

```json
// Sản phẩm 2
{
  "name": "Samsung Galaxy S24 Ultra",
  "description": "Flagship Samsung với S-Pen",
  "price": 25000000,
  "quantity": 30
}

// Sản phẩm 3
{
  "name": "MacBook Pro M3",
  "description": "Laptop cao cấp cho developers",
  "price": 45000000,
  "quantity": 20
}
```

**⚠️ Sao chép các `_id` của sản phẩm để dùng cho việc tạo đơn hàng!**

---

### 📋 BƯỚC 4: Thực hiện thao tác đặt hàng (Buy/Create Order) ✅

```
Method: POST
URL: http://localhost:3003/products/api/v1/buy
Headers:
  Content-Type: application/json
  Authorization: Bearer <YOUR_TOKEN_HERE>

Body (raw JSON):
{
  "ids": [
    {
      "id": "68f77e77af79991a17eca433",
      "quantity": 2
    },
    {
      "id": "68f77e95af79991a17eca435",
      "quantity": 1
    }
  ]
}

Response Success (200):
{
  "message": "Order created successfully"
}

Response Error (400):
{
  "message": "Insufficient product quantity"
}
```

**Lưu ý về Business Logic:**
- ✅ Mỗi user chỉ được đặt tối đa **5 đơn hàng trong 1 ngày**
- ✅ Đơn hàng quá **24 giờ** sẽ không được xử lý
- ✅ Số lượng sản phẩm phải đủ trong kho

---

### 📋 BƯỚC BỔ SUNG: Các API khác

#### 📦 Lấy danh sách tất cả sản phẩm

```
Method: GET
URL: http://localhost:3003/products/api/v1
Headers:
  Content-Type: application/json
  Authorization: Bearer <YOUR_TOKEN_HERE>

Response Success (200):
[
  {
    "_id": "6718abc123def456...",
    "name": "iPhone 15 Pro Max",
    "price": 30000000,
    "quantity": 50
  }
]
```

---

#### 📦 **MỚI: Lấy thông tin sản phẩm theo ID** ✨

```
Method: GET
URL: http://localhost:3003/products/api/v1/:id
Headers:
  Content-Type: application/json
  Authorization: Bearer <YOUR_TOKEN_HERE>

Example:
URL: http://localhost:3003/products/api/v1/6718abc123def456

Response Success (200):
{
  "_id": "6718abc123def456...",
  "name": "iPhone 15 Pro Max",
  "description": "Điện thoại cao cấp của Apple",
  "price": 30000000,
  "quantity": 50,
  "createdAt": "2025-10-21T10:30:00.000Z",
  "updatedAt": "2025-10-21T10:30:00.000Z"
}

Response Error (404):
{
  "message": "Product not found"
}
```

**💡 Tip:** Sao chép `_id` từ danh sách sản phẩm (GET /products/api/v1) để test endpoint này.

---

#### 📦 Lấy danh sách đơn hàng

```
Method: GET
URL: http://localhost:3003/orders/api/v1
Headers:
  Content-Type: application/json

Response Success (200):
[
  {
    "_id": "6718order123...",
    "username": "testuser",
    "products": [...],
    "totalPrice": 60000000,
    "status": "completed"
  }
]
```

---

#### ❌ Hủy đơn hàng

```
Method: PUT
URL: http://localhost:3003/orders/api/v1/cancle/<ORDER_ID>
Headers:
  Content-Type: application/json

Example:
URL: http://localhost:3003/orders/api/v1/cancle/6718order123...

Response Success (200):
{
  "message": "Đã Hủy Đơn Hàng"
}
```

---

#### � Xem thông tin profile

```
Method: GET
URL: http://localhost:3003/auth/api/v1/dashboard
Headers:
  Content-Type: application/json
  Authorization: Bearer <YOUR_TOKEN_HERE>

Response Success (200):
{
  "username": "testuser",
  "orders": [...]
}
```

---

### 🔄 WORKFLOW ĐẦY ĐỦ (Test E2E)

```
1. 🔐 Register
   POST /auth/api/v1/register
   Body: {"username": "danhtest", "password": "123456"}

2. 🔐 Login
   POST /auth/api/v1/login
   Body: {"username": "danhtest", "password": "123456"}
   → Lấy token

3. ➕ Thêm sản phẩm
   POST /products/api/v1/add (với Authorization header)
   → Ghi nhận product ID

4. 📋 Xem danh sách sản phẩm
   GET /products/api/v1
   → Verify các sản phẩm đã thêm

5. 🛒 Tạo đơn hàng
   POST /products/api/v1/buy
   Body: {"ids": [{"id": "...", "quantity": 2}]}
   → Đợi RabbitMQ xử lý (vài giây)

6. 📦 Kiểm tra đơn hàng
   GET /orders/api/v1
   → Verify đơn hàng đã được tạo

7. 👤 Xem profile
   GET /auth/api/v1/dashboard
   → Verify đơn hàng xuất hiện trong profile
```

---

### 🛠️ Khởi động hệ thống

```bash
# 1. Start tất cả services
docker-compose up -d

# 2. Kiểm tra containers đang chạy
docker ps

# 3. Xem logs nếu có lỗi
docker logs danh_api_gateway
docker logs danh_auth_service
docker logs danh_product_service
docker logs danh_order_service
```

---

### ⚠️ Lỗi thường gặp

1. **401 Unauthorized**
   - Kiểm tra token đã được thêm vào header `Authorization: Bearer <token>`
   - Token có thể hết hạn, login lại để lấy token mới

2. **500 Server Error**
   - Kiểm tra MongoDB và RabbitMQ đã khởi động chưa
   - Xem logs: `docker logs <container_name>`

3. **Đơn hàng không được tạo**
   - Đợi 20-30 giây để RabbitMQ khởi động
   - Kiểm tra RabbitMQ UI: `http://localhost:15672` (guest/guest)

---

##  8. Kết luận

Hệ thống đã được thiết lập thành công:
- RabbitMQ hoạt động để giao tiếp giữa các service  
- JWT đảm bảo xác thực người dùng  
- API Gateway định tuyến chính xác  
- Tất cả API hoạt động ổn định qua Postman ✅

**📊 Các bước test đã hoàn thành:**
- ✅ Tạo tài khoản người dùng (0.5 điểm)
- ✅ Đăng nhập thành công (0.5 điểm)
- ✅ Tạo thông tin sản phẩm mới (0.5 điểm)
- ✅ Thực hiện thao tác đặt hàng (0.5 điểm)

---

🧑‍💻 **Tác giả:** ĐỖ CÔNG DANH 
📅 **Cập nhật lần cuối:** 2025-10-21
