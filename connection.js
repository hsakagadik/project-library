const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DB, {useNewUrlParser: true,useUnifiedTopology: true,});
const booksSchema = require("./schema/books");
let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect()
      .then((db) => {
        console.log("Successfully connected to MongoDB");
        db.db("library").listCollections().toArray()
        .then((list) => {
          if(!list.filter(elem => elem.name === 'books').length){
            db.db("library").createCollection('books', {validator:{$jsonSchema: booksSchema}})
              .then((cBook) => {
                dbConnection = cBook;
              })
              .catch((e) => {
                return callback(e);
              })
          } else {
            dbConnection = db.db("library").collection('books');
          }
          return callback();
        })
        .catch((err) => {
          return callback(err);
        })
      })
      .catch((error) => {
        return callback(error);
      })      
    },
  getDb: function () {
    return dbConnection;
  },
};