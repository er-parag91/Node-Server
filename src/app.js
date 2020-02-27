// this file will be used for testing and everything will be exported to main index.js file where routes will be listened

const express = require('express');
require('./db/mongoose');

//Routers 
const userRouter = require('./router/user');
const taskRouter = require('./router/task');
const orderRouter = require('./router/orders');
const productRouter = require('./router/product-config');

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
app.use(taskRouter);
app.use(orderRouter);
app.use(productRouter);

module.exports = app;