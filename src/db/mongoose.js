const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})