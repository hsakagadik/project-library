/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const client = require('../connection');
const Book = require('../models/book');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      const database = client.getDb();
      database.find({}).limit(50).toArray()
        .then((books) => {
          res.status(200).send(books);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      if (req.body.title === undefined){
        res.status(400).send('missing required field title');
      } else {
        const database = client.getDb();
        const book = new Book(req.body);
        database.insertOne(book)
          .then((result) => {
            res.status(200).send(book);
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      const database = client.getDb();
      database.deleteMany(listingQuery, function (err, _result) {
        if (err) {
          res.status(400).send(`Error deleting listing with id ${listingQuery.listing_id}!`);
        } else {
          console.log("1 document deleted");
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const database = client.getDb();
      database.find({}).limit(50).toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
        } else {
          res.json(result);
        }
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      const database = client.getDb();
      database.findOneAndUpdate(matchDocument, function (err, result) {
        if (err) {
          res.status(400).send("Error inserting matches!");
        } else {
          console.log(`Added a new match with id ${result.insertedId}`);
          res.status(204).send();
        }
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const database = client.getDb();
      database.deleteOne(listingQuery, function (err, _result) {
        if (err) {
          res.status(400).send(`Error deleting listing with id ${listingQuery.listing_id}!`);
        } else {
          console.log("1 document deleted");
        }
      });
    });
  
};
