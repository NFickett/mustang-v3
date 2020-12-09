
const express = require("express");
const server = express();
var path = require('path');
const ObjectId =require('mongodb').ObjectId;
server.use(express.static(__dirname + '/public'))
const body_parser = require("body-parser");

// parse JSON (application/json content-type)
server.use(body_parser.json());

const port = process.env.PORT || 3000


server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + './index.html'));
})
 
// << db setup >>
const db = require("./db");
const dbName = "mustangv3";
const collectionName = "Students/Heros";

db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
  // get all items
  dbCollection.find().toArray(function(err, result) {
      if (err) throw err;
        console.log(result);
  });

  // << db CRUD routes >> add new item
server.post("/items", (request, response) => {
    const item = request.body;
    
    dbCollection.insertOne(item, (error, result) => { // callback of insertOne
        if (error) throw error;
        // return updated list
        dbCollection.find().toArray((_error, _result) => { // callback of find
            if (_error) throw _error;
            response.json(_result);
        });
    });
});
server.get("/items/:id", (request, response) => {
  const itemId = new ObjectId(request.params.id);

  dbCollection.findOne({ _id: itemId }, (error, result) => {
      if (error) throw error;
      // return item
      response.json(result);
  });
});
server.get("/items", (request, response) => {
  // return updated list
  dbCollection.find().toArray((error, result) => {
      if (error) throw error;
      response.json(result);
  });
});

}, function(err) { // failureCallback
  throw (err);
});


server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});


  