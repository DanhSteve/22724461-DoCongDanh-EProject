# Sử dụng Node.js phiên bản nhẹ
FROM node:22.14.0-alpine

# Chỉ định thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép file package.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép source code
COPY . .

# Lệnh chạy app
CMD [ "npx" , "nodemon" , "-L", "index.js"]
