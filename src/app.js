const { MongoClient, ObjectId } = require('mongodb');


MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('error occured while connecting');
    }
    console.log('Connected Successfully');
    const db = client.db('Task-Manager');
    // deleteMany document
    db.collection('tasks').deleteMany({
        completed: false
    }).then(result => {
        console.log(result.deletedCount)
    }).catch(error => {
        console.log(error)
    })
});