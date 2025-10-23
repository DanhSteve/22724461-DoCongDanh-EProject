# 🐳 Hướng dẫn Docker & Docker Compose

> **Tài liệu đầy đủ về các lệnh Docker, troubleshooting và best practices**

---

## 🚀 Quick Start Commands

### Khởi động toàn bộ hệ thống
```bash
docker compose up -d
```
- Chạy 6 containers (API Gateway, Auth, Product, Order, MongoDB, RabbitMQ)
- `-d`: chế độ detached (chạy nền)

### Dừng toàn bộ containers
```bash
docker compose down
```

### Xem logs real-time
```bash
docker compose logs -f
```

### Xem logs của service cụ thể
```bash
docker compose logs -f danh_auth_service
docker compose logs -f danh_product_service
```

---

## 📦 Quản lý containers

### Xem trạng thái containers
```bash
docker compose ps
```

### Restart 1 service
```bash
docker compose restart danh_auth_service
```

### Stop 1 service
```bash
docker compose stop danh_product_service
```

### Start lại service đã stop
```bash
docker compose start danh_product_service
```

---

## 🔍 Debugging & Troubleshooting

### Vào shell của container
```bash
docker exec -it danh_auth_service sh
```

### Chạy lệnh trong container
```bash
docker exec danh_auth_service npm test
docker exec danh_product_service node --version
```

### Xem logs chi tiết (100 dòng cuối)
```bash
docker compose logs --tail=100 danh_order_service
```

### Xem tài nguyên sử dụng
```bash
docker stats
```

### Xóa toàn bộ containers và volumes
```bash
docker compose down -v
```
⚠️ **CẢNH BÁO:** Lệnh này sẽ **XÓA DỮ LIỆU MONGODB**!

---

## 🛠️ Build & Rebuild

### Build lại 1 service
```bash
docker compose build danh_auth_service
```

### Build lại toàn bộ
```bash
docker compose build
```

### Build và start ngay
```bash
docker compose up -d --build
```

### Force rebuild (không dùng cache)
```bash
docker compose build --no-cache
docker compose up -d
```

---

## 🔧 MongoDB Management

### Kết nối MongoDB shell
```bash
docker exec -it danh_mongodb mongosh -u docongdanh -p mongodb123 --authenticationDatabase admin
```

**Trong mongosh:**
```javascript
// Xem databases
show dbs

// Chọn database
use AuthService

// Xem collections
show collections

// Query users
db.users.find().pretty()

// Đếm số users
db.users.countDocuments()
```

## 🔍 Kiểm tra health của services

### Ping API Gateway
```bash
curl http://localhost:3003/health
```

### Ping từng service
```bash
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # Product
curl http://localhost:3004/health  # Order
```

### Kiểm tra MongoDB
```bash
curl http://localhost:27018
```

---

## 🧹 Dọn dẹp hệ thống

### Xóa containers dừng
```bash
docker container prune
```

### Xóa images không dùng
```bash
docker image prune -a
```

### Xóa volumes không dùng
```bash
docker volume prune
```

### Dọn toàn bộ (NGUY HIỂM!)
```bash
docker system prune -a --volumes
```

---

## 📂 Cấu trúc Docker Compose
**File:** `docker-compose.yml`


**Networks:**
- `danh-ecommerce`: Internal network cho các services

**Volumes:**
- `danh-mongodb-data`: Persistent MongoDB data

---

## ⚠️ Lỗi thường gặp

### Lỗi: Port already in use
```bash
Error: bind: address already in use
```
**Giải pháp:**
1. Tìm process đang dùng port:
   ```bash
   netstat -ano | findstr :3003
   ```
2. Kill process:
   ```bash
   taskkill /PID <PID> /F
   ```

### Lỗi: Container unhealthy
```bash
docker compose ps
# danh_auth_service   unhealthy
```
**Giải pháp:**
```bash
docker compose logs danh_auth_service
docker compose restart danh_auth_service
```

### Lỗi: MongoDB connection refused
**Kiểm tra:**
1. MongoDB container running?
   ```bash
   docker compose ps danh_mongodb
   ```
2. Xem logs:
   ```bash
   docker compose logs danh_mongodb
   ```
3. Restart:
   ```bash
   docker compose restart danh_mongodb
   ```

### Lỗi: RabbitMQ connection failed
**Giải pháp:**
```bash
# Restart RabbitMQ
docker compose restart danh_rabbitmq

# Xem logs
docker compose logs danh_rabbitmq

# Kiểm tra queues
docker exec danh_rabbitmq rabbitmqctl list_queues
```

---

## 💡 Best Practices

### 1. Kiểm tra trước khi start
```bash
# Kiểm tra syntax docker-compose.yml
docker compose config
```

### 2. Luôn xem logs khi có lỗi
```bash
docker compose logs -f --tail=50
```

### 3. Restart theo thứ tự
```bash
# 1. MongoDB & RabbitMQ trước
docker compose restart danh_mongodb danh_rabbitmq
sleep 5

# 2. Services sau
docker compose restart danh_auth_service danh_product_service danh_order_service
sleep 3

# 3. API Gateway cuối
docker compose restart danh_api_gateway
```

### 4. Backup dữ liệu định kỳ
```bash
# Tạo backup folder
mkdir backup

# Backup MongoDB
docker exec danh_mongodb mongodump --uri="mongodb://docongdanh:mongodb123@localhost:27017/?authSource=admin" --archive=/backup/backup-$(date +%Y%m%d).gz --gzip
```

---

## 🔗 Tài liệu tham khảo

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [RabbitMQ Docker Hub](https://hub.docker.com/_/rabbitmq)

---

🧑‍💻 **Tác giả:** ĐỖ CÔNG DANH 
📅 **Updated:** 2025-10-23
