const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DB, {useNewUrlParser: true,useUnifiedTopology: true,});
const booksSchema = require("./schema/books");
let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect()
      .then((db) => {
        dbConnection = db.db("library");
        console.log("Successfully connected to MongoDB");
        return dbConnection.listCollections().toArray();
      })
      .then((list) => {
        if(!list.filter(elem => elem.name === 'books').length){
          return dbConnection.createCollection('books', {validator:{$jsonSchema: booksSchema}})
        } else {
          return dbConnection.collection('books');
        }
      })
      .then((collection) => {
        dbConnection = collection;
        return callback();
      })
      .catch((error) => {
        return callback(error);
      })      
    },
  getDb: function () {
    return dbConnection;
  },
};