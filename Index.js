var Express = require("express");
var Mongoclient = require('mongodb').MongoClient;
var cors = require("cors");
const multer = require("multer");

var app = Express();
app.use(cors());

var Connection_string = "mongodb://localhost:27017";

var DatabaseName = "AngularDb";
var database;

app.listen(5038, () => {
    Mongoclient.connect(Connection_string,
        (error, client) => {
            database = client.db(DatabaseName);
            console.log("Mongo Connecteddd");
        })
});

//Get All
app.get('/api/user-color/get', (request, response) => {
    database.collection("userColors").find({}).toArray((error, result) => {
        response.send(result);
    });
})

//Get By Id
app.get('/api/user-color/get-by-id/:id', (request, response) => {
    const UId = request.params.id;
    database.collection("userColors").findById({UserId:UId}).toArray((error, result) => {
        response.send(result);
    });
})


// Update one value
app.patch('/api/user-color/update-partial/:id', (request, response) => {
    const UId = request.params.id;
    database.collection("userColors").updateOne({UserId:UId}).toArray((error, result) => {
        response.send(result);
    });
})

// Update 
app.put('/api/user-color/update/:id', (request, response) => {
    const UId = request.params.id;
    database.collection("userColors").update({UserId:UId},request.body).toArray((error, result) => {
        response.send(result);
    });
})

app.post('/api/user-color/add-user-color', multer().none(), (request, response) => {
    database.collection("userColors").count({}, function (error, numOfDocs) {
        database.collection("userColors").insertOne({
            UserId: (numOfDocs + 1).toString(),
            colors: request.body.payload
        });
        response.json("User color added.");
    });
})

app.delete('/api/user-color/delete-user-color', (request, response) => {
    database.collection('userColors').deleteOne({
        id: request.query.UserId
    });
    response.json("User color deleted successfully");
})

//All colors
app.get('/api/all-color/getAll', (request, response) => {
    database.collection("AvailableColors").find({}).toArray((error, result) => {
        response.send(result);
    });
})


