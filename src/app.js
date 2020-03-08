const express = require('express');
require('./db/mongoose');
//Routers 
const userRouter = require('./router/user');
const productRouter = require('./router/product');
const validator = require('validator');
// express port config
const app = express();


app.use(express.json());
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next()
})
app.use(userRouter);
app.use(productRouter);

module.exports = app;