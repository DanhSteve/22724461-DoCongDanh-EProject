const chai = require("chai");
const chaiHttp = require("chai-http");
const App = require("../app");
const expect = chai.expect;
require("dotenv").config();

chai.use(chaiHttp);

// Sử dụng biến môi trường để linh hoạt giữa local và CI/CD
const API_BASE_URL = process.env.TEST_API_URL || "http://danh_api_gateway:3003";

// Helper function để retry requests - tối ưu cho CI/CD
async function retryRequest(requestFn, maxRetries = 2, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

describe("Products", function() {
  // let app;
  let authToken;
  let listProduct;
  
  // Tăng timeout cho CI/CD environment
  this.timeout(120000); // 2 minutes
  
  before(async function() {

    const authRes = await retryRequest(() => 
      chai
        .request(API_BASE_URL)
        .post("/auth/api/v1/login")
        .timeout(15000)
        .send({ username: "testuser", password: "123456" })
    );
    // console.log(authRes.body, '  my token');
    authToken = authRes.body?.token || '';

    // thêm trước 1 product
    await retryRequest(() =>
      chai
        .request(API_BASE_URL)
        .post("/products/api/v1/add")
        .timeout(15000)
        .set("authorization", `Bearer ${authToken}`)
        .send({
          name: "Product 8989",
          price: 100000,
          description: "Description of Product 8989",
          quantity: 100
        })
    );

    await retryRequest(() =>
      chai
        .request(API_BASE_URL)
        .post("/products/api/v1/add")
        .timeout(15000)
        .set("authorization", `Bearer ${authToken}`)
        .send({
          name: "Product 9898",
          price: 100000,
          description: "Description of Product 9898",
          quantity: 100
        })
    );

    // lay cac product co san de test !!!
    listProduct = await retryRequest(() =>
      chai
        .request(API_BASE_URL)
        .get("/products/api/v1")
        .timeout(15000)
        .set("authorization", `Bearer ${authToken}`)
    );
  });

  after(async function() {
    console.log('complete !!!!')
  });

  // done
  describe("POST /products", function() {
    it("should create a new product", async function() {
      const product = {
        name: "Product 1",
        description: "Description of Product 1",
        price: 10,
        quantity: 100
      };
      const res = await chai
        .request(API_BASE_URL)
        .post("/products/api/v1/add")
        .set("authorization", `Bearer ${authToken}`)
        .send({
          name: "Product 1",
          price: 10,
          description: "Description of Product 1",
          quantity: 100
        });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");
      expect(res.body).to.have.property("name", product.name);
      expect(res.body).to.have.property("description", product.description);
      expect(res.body).to.have.property("price", product.price);
      expect(res.body).to.have.property("quantity", product.quantity);
    });

    it("should return an error if name is missing", async function() {
      const product = {
        description: "Description of Product 1",
        price: 10.99,
      };
      const res = await chai
        .request(API_BASE_URL)
        .post("/products/api/v1/add")
        .set("authorization", `Bearer ${authToken}`)
        .send(product);

      expect(res).to.have.status(400);
    });

  });

  // done
  describe("GET /products", function() {
    it("get all product", async function() {
      const res = await chai
        .request(API_BASE_URL)
        .get("/products/api/v1")
        .set("authorization", `Bearer ${authToken}`)


      expect(res).to.have.status(200);

      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.greaterThan(0);

      const firstProduct = res.body[0];
      expect(firstProduct).to.have.property("_id");
      expect(firstProduct).to.have.property("name").that.is.a("string");
      expect(firstProduct).to.have.property("description").that.is.a("string");
      expect(firstProduct).to.have.property("price").that.is.a("number");
      expect(firstProduct).to.have.property("quantity").that.is.a("number");
    });
  })

  describe("POST /order", function() {
    it("save orders success", async function() {

      console.log(listProduct.body)

      const res = await chai
        .request(API_BASE_URL)
        .post("/products/api/v1/buy")
        .set("authorization", `Bearer ${authToken}`)
        .send(
          {
            "ids": [
              { "id": listProduct.body[0]._id, "quantity": 12 },
              { "id": listProduct.body[1]._id, "quantity": 28 }
            ]
          }
        )


      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message", 'Đã cập nhật đơn hàng thành công !!');
    });

    it("save orders but miss quantity", async () => {

    })
  })
});

