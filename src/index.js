const app = require('./app');

// express port config
const port = process.env.PORT;

// Listener
app.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});