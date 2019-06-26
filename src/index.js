const express = require('express');
require('./db/mongoose');

const User = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save()
        .then((user) => {
            res.status(201).send(user);
    })
        .catch((error) => {
            console.log(error);
        })
})

app.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
})