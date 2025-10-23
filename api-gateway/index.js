const express = require("express");
const httpProxy = require("http-proxy");
const morgan = require('morgan');//this logs requests so you can easily troubleshoot
const proxy = httpProxy.createProxyServer();
const app = express();

app.use(morgan('tiny')); // use morgan to log requests

// Route requests to the auth service
app.use("/auth", (req, res) => {
  proxy.web(req, res, { target: "http://danh_auth_service:3000" });
});

// Route requests to the product service
app.use("/products", (req, res) => {
  proxy.web(req, res, { target: "http://danh_product_service:3001" });
});

// Route requests to the order service
app.use("/orders", (req, res) => {
  proxy.web(req, res, { target: "http://danh_order_service:3002" });
});

// app.use()

// Start the server
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
