const express = require('express');
require('./db/mongoose');

//Routers 
const userRouter = require('./router/user');
const taskRouter = require('./router/task');


// express port config
const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Listener
app.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});