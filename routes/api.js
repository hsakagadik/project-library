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
const ObjectId = require('mongodb').ObjectId;

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
        res.send('missing required field title');
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
      database.deleteMany({})
        .then((book) => {
          if(book.deletedCount > 0){
            res.status(200).send('complete delete successful');
          }
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      const bookId = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const database = client.getDb();
      database.findOne({"_id": ObjectId(bookId)})
        .then((book) => {
          if(book === null){
            res.status(200).send('no book exists');
          } else {
            res.status(200).send(book);            
          }
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    })
    
    .post(function(req, res){
      if (req.body.comment === undefined){
        res.send('missing required field comment');
      } else {
        const bookId = req.params.id;
        const comment = req.body.comment;
        //json res format same as .get
        const database = client.getDb();
        database.findOneAndUpdate({"_id": ObjectId(bookId)}, {$push: {comments: comment}, $inc: {commentcount: 1}},{returnDocument: 'after'})
        .then((book) => {
          if(book.value === null){
            res.status(200).send('no book exists');
          } else if (book.ok){
            res.status(200).send(book.value);            
          }
        })
        .catch((err) => {
          res.status(400).send(err);
        });
      }
    })
    
    .delete(function(req, res){
      const bookId = req.params.id;
      //if successful response will be 'delete successful'
      const database = client.getDb();
      database.deleteOne({"_id": ObjectId(bookId)})
        .then((book) => {
          if(book.deletedCount){
            res.status(200).send('delete successful');
          } else {
            res.status(200).send('no book exists');
          }
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    });
  
};
