# Giải Thích Chi Tiết CI/CD với GitHub Actions và Docker

## 1️⃣ **Thao tác với GitHub Actions: Thực hiện CI/CD với dự án**

### **CI/CD là gì?**
- **CI (Continuous Integration)**: Tích hợp liên tục - Tự động kiểm tra code mỗi khi có thay đổi
- **CD (Continuous Deployment)**: Triển khai liên tục - Tự động đưa code lên production

### **GitHub Actions hoạt động như thế nào trong dự án?**

#### **Khi nào workflow chạy?**
```yaml
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
```
- Mỗi khi push code lên nhánh `main` → GitHub Actions tự động chạy
- Mỗi khi tạo Pull Request → Tự động kiểm tra trước khi merge

#### **Job 1: build-and-run (CI - Kiểm Tra Chất Lượng)**
**Mục đích:** Đảm bảo code mới không làm hỏng hệ thống

**Các bước thực hiện:**
1. **Checkout code**: Lấy code mới nhất từ GitHub
2. **Build Docker images**: Biên dịch 4 microservices thành Docker images
   - API Gateway
   - Auth Service  
   - Product Service
   - Order Service
3. **Generate .env file**: Tạo file cấu hình môi trường test
4. **Start containers**: Khởi động tất cả services (app + MongoDB + RabbitMQ)
5. **Wait & Setup MongoDB**: Đợi services khởi động + tạo database test
6. **Run tests**: Chạy automated tests (kiểm tra API hoạt động đúng)
7. **Stop containers**: Dọn dẹp sau khi test xong

**Kết quả:** ✅ PASS → Code tốt, tiếp tục bước tiếp theo | ❌ FAIL → Có lỗi, không deploy

#### **Job 2: deploys (CD - Triển Khai)**
**Mục đích:** Đưa code đã test thành công lên Docker Hub để sẵn sàng deploy

**Các bước thực hiện:**
1. **Checkout code**: Lấy code
2. **Build images**: Build lại Docker images cho production
3. **Login to Docker Hub**: Đăng nhập Docker Hub bằng credentials
4. **Tag images**: Gắn tag cho images (vd: `danhsteve/product-service:latest`)
5. **Push to Docker Hub**: Đẩy 4 images lên Docker Hub registry

**Kết quả:** Images được lưu trên Docker Hub, ai cũng có thể pull về dùng

---

## 2️⃣ **CI/CD liên kết với Docker**

### **Tại sao dùng Docker trong CI/CD?**

#### **Vấn đề truyền thống:**
- "Code chạy được trên máy tôi nhưng không chạy trên máy khác" 
- Khó khăn khi cài đặt môi trường: Node.js, MongoDB, RabbitMQ...
- Mỗi service cần cấu hình riêng

#### **Giải pháp với Docker:**
- **Container hóa**: Mỗi service chạy trong container độc lập
- **Tính nhất quán**: Code chạy giống nhau ở mọi nơi (dev, test, production)
- **Dễ quản lý**: 1 lệnh `docker compose up` → khởi động cả hệ thống

### **Cách Docker được tích hợp vào CI/CD:**

#### **A. Dockerfile - Định nghĩa từng service**
Mỗi microservice có Dockerfile riêng:

```dockerfile
# product/Dockerfile
FROM node:22.14.0-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
CMD ["nodemon", "index.js"]
```

**Giải thích:**
- `FROM node:22.14.0-alpine`: Sử dụng Node.js image nhẹ
- `COPY + RUN npm install`: Cài đặt dependencies
- `CMD`: Lệnh chạy khi container khởi động

#### **B. docker-compose.yml - Quản lý toàn bộ hệ thống**

```yaml
services:
  danh_mongodb:       # Database
  danh_rabbitmq:      # Message broker
  danh_auth_service:  # Microservice 1
  danh_product_service: # Microservice 2
  danh_order_service:  # Microservice 3
  danh_api_gateway:    # API Gateway
```

**Lợi ích:**
- 1 lệnh khởi động 6 services cùng lúc
- Tự động kết nối network giữa các services
- Quản lý ports, volumes, environment variables

#### **C. CI/CD Workflow với Docker**

**Trong Job 1 (Test):**
```bash
docker compose build --parallel  # Build 4 services song song
docker compose up -d              # Khởi động containers
docker exec danh_product_service npm test  # Test trong container
docker compose down               # Dọn dẹp
```

**Trong Job 2 (Deploy):**
```bash
docker compose build --parallel   # Build production images
docker tag danh_product_service danhsteve/product-service:latest
docker push danhsteve/product-service:latest  # Push lên Docker Hub
```

### **Docker Hub - Container Registry**

**Vai trò:**
- Giống như GitHub cho code, Docker Hub lưu trữ Docker images
- Người khác có thể pull images về dùng ngay

**Workflow:**
1. GitHub Actions build images → Push lên Docker Hub
2. Server production → Pull images từ Docker Hub
3. Chạy `docker compose up` → Deploy xong!

---

## **Tóm Tắt Luồng Hoàn Chỉnh:**

```
Developer Push Code (GitHub)
         ↓
GitHub Actions Trigger
         ↓
[Job 1: CI - Kiểm Tra]
  ├─ Build Docker images
  ├─ Start containers  
  ├─ Run tests trong containers
  └─ ✅ PASS / ❌ FAIL
         ↓
[Job 2: CD - Triển Khai]
  ├─ Build production images
  ├─ Login Docker Hub
  └─ Push images lên Docker Hub
         ↓
Docker Hub (Lưu trữ images)
         ↓
Production Server
  ├─ Pull images từ Docker Hub
  └─ docker compose up → Deploy!
```

---

## **Lợi Ích Của Hệ Thống:**

✅ **Tự động hóa 100%**: Push code → Test → Deploy (không cần thao tác thủ công)

✅ **Phát hiện lỗi sớm**: Test ngay khi push, không để lỗi lên production

✅ **Môi trường nhất quán**: Docker đảm bảo code chạy giống nhau ở mọi nơi

✅ **Dễ rollback**: Lỗi → Pull image cũ từ Docker Hub → Deploy lại

✅ **Microservices ready**: Mỗi service độc lập, dễ scale và maintain

✅ **Thời gian deploy nhanh**: 1m33s từ push code đến có images trên Docker Hub

---

## **Kết Quả Thực Tế Trong Dự Án:**

### **Hiệu Suất CI/CD Pipeline:**
- **Job 1 (build-and-run)**: 56 giây
  - Build: 13s
  - Start containers: 11s
  - Wait & Setup: 23s
  - Test: 2s
  
- **Job 2 (deploys)**: 37 giây
  - Build: 15s
  - Login: 1s
  - Push to Docker Hub: 13s

- **Tổng thời gian**: ~1 phút 33 giây

### **Tối Ưu Hóa Đã Thực Hiện:**
1. ✅ Build parallel với `--parallel` flag
2. ✅ Sử dụng DOCKER_BUILDKIT=1 cho build nhanh hơn
3. ✅ Push images song song với background jobs
4. ✅ Loại bỏ các bước không cần thiết (Docker Buildx, Cache layers)
5. ✅ Sleep time tối ưu 22s để cân bằng tốc độ và độ ổn định

### **Docker Images trên Docker Hub:**
- `danhsteve/api-gateway:latest`
- `danhsteve/auth-service:latest`
- `danhsteve/product-service:latest`
- `danhsteve/order-service:latest`

---

## **Hướng Dẫn Sử Dụng:**

### **1. Setup GitHub Secrets:**
Thêm vào repository Settings → Secrets and variables → Actions:
- `DOCKER_USERNAME`: Username Docker Hub
- `DOCKER_PASSWORD`: Password hoặc Access Token

### **2. Trigger CI/CD:**
```bash
git add .
git commit -m "Update code"
git push origin main
```
→ GitHub Actions tự động chạy!

### **3. Xem kết quả:**
- Vào GitHub repository → Actions tab
- Xem logs chi tiết của từng job
- Kiểm tra images trên Docker Hub

### **4. Deploy trên server:**
```bash
docker pull danhsteve/api-gateway:latest
docker pull danhsteve/auth-service:latest
docker pull danhsteve/product-service:latest
docker pull danhsteve/order-service:latest
docker compose up -d
```

---

**Tác giả:** Đỗ Công Danh - 22724461  
**Dự án:** EProject - Microservices với CI/CD và Docker  
**Ngày cập nhật:** 2025-10-22
