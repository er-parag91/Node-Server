const { MongoClient, ObjectId } = require('mongodb');


MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('error occured while connecting');
    }
    console.log('Connected Successfully');
    const db = client.db('Task-Manager');

    // Insert one document
    db.collection('users').insertOne({
        name: 'Parag',
        age: 25
    }, (err, result) => {
        if (err) {
            return console.log('err occured while inserting document')
        }

        console.log(result.ops)
    })


    // insert many documents
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


    // insert many documents
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

    // find one document based on query
    db.collection('users').findOne({
        name: 'Parag'
    }, (error, result) => {
        if (error) {
            console.log('Unable to fetch')
        }

        console.log(result)
    })
    
    // find one document based on query
    db.collection('tasks').findOne({
        _id: new ObjectId("5d12ad0f3feb51061215e025")
    }, (error, result) => {
        if (error) {
            console.log('Unable to fetch')
        }

        console.log(result)
    })

});