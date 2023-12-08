var Express = require("express");
var Mongoclient = require('mongodb').MongoClient;
var cors = require("cors");
const multer = require("multer");
const bodyParser = require('body-parser')
var app = Express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
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
    database.collection("userColors").findOne({ "UserId": Number(UId) }, function(err,res){
        response.send(res);
    });
})

// Update one value
app.patch('/api/user-color/update-partial/:id', (request, response) => {
    const UId = request.params.id;
    database.collection("userColors").updateOne({ UserId: UId }).toArray((error, result) => {
        response.send(result);
    });
})

// Update 
app.put('/api/user-color/update/:id', (request, response) => {
    const UId = request.params.id;
    database.collection("userColors").update({ UserId: UId }, request.body).toArray((error, result) => {
        response.send(result);
    });
})

app.post('/api/user-color/save-user-color', multer().none(), (request, response) => {
    database.collection("userColors").count({}, function (error, numOfDocs) {
        database.collection("userColors").insertOne({
            UserId: request.body.UserId,
            colors: request.body.colors
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

//Get All Users
app.get('/api/all-user/get', (request, response) => {
    database.collection("users").find({}).toArray((error, result) => {
        response.send(result);
    });
})

// Add User
app.post('/api/all-user/add-user', multer().none(), async (request, response) => {
    // let collection = await database.collection("users");
    // console.log('BODY',request.body);
    // let newUser = request.body;
    // let result = await collection.insertOne(newUser);
    // response.send(result);
    database.collection("users").count({}, function (error, numOfDocs) {
        database.collection("users").insertOne({
            UserId: request.body.UserId,
            UserType: request.body.UserType
        });
        response.json("User added.");
    });
})

//GetByUserID
app.get('/api/all-user/get-by-id/:id', (req, resp) => {
    const userId = req.params.id;
    console.log('User ka ID: ', userId);
    database.collection("users").findOne({ "UserId": Number(userId) }, function (err, user) {
        console.log(user);
        resp.send(user);
    })

})

