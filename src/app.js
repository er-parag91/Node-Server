const mongoClient = require('mongodb').MongoClient;


mongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('error occured while connecting');
    }
    console.log('Connected Successfully');
    const db = client.db('Task-Manager');

    db.collection('users').insertOne({
        name: 'Parag',
        age: 25
    }, (err, result) => {
        if (err) {
            return console.log('err occured while inserting document')
        }

        console.log(result.ops)
    })

    db.collection('users').insertMany([
        {
            name: 'Pragnesh',
            age: 27
        },
        {
            name: 'Gilchrist Alec',
            age: 31
        },
        {
            name: 'Sankait',
            age: 26
        }
    ], (err, result) => {
        if (err) {
            return console.log('err occured while inserting documents')
        }

        console.log(result.ops)
    });

    db.collection('tasks').insertMany([
        {
            description: 'Buy grocery',
            completed: true
        },
        {
            description: 'Clean house',
            completed: false
        },
        {
            description: 'finish car inspection',
            completed: true
        }
    ], (err, result) => {
        if (err) {
            return console.log('err occured while inserting tasks documents')
        }

        console.log(result.ops)
    });

});