const app = require('./app');

// express port config
const port = process.env.PORT;

// Listener
app.listen(port, (err) => {
    console.log(`App is up and running on ${port}`);
});