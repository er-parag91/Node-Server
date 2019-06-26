const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

app.post('/users', (req, res) => {
    res.send('Accessed Users route')
})

app.listen(port, () => console.log(`Server is up and running on ${port}`));