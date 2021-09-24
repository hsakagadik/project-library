/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../models/book')

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {
    let validBook;

    suite('POST /api/books with title => create book object/expect book object', function() {
      const request = {title: "Faux Book 1"};
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send(request)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'commentcount', 'Book should contain commentcount');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          validBook = res.body;
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/5f665eb46e296f6b9b6a504d')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${validBook._id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body, 'title', 'Books in array should contain title');
          assert.property(res.body, '_id', 'Books in array should contain _id');
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const comment = {comment: "someString"};
        chai.request(server)
        .post(`/api/books/${validBook._id}`)
        .send(comment)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.isArray(res.body.comments, 'comments should be an array');
          assert.property(res.body, 'commentcount', 'Book should contain commentcount');
          assert.property(res.body, 'comments', 'Book should contain commentcount');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post(`/api/books/${validBook._id}`)
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const comment = {comment: "someString"};
        chai.request(server)
        .post('/api/books/5f665eb46e296f6b9b6a504d')
        .send(comment)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete(`/api/books/${validBook._id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        chai.request(server)
        .delete('/api/books/5f665eb46e296f6b9b6a504d')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });

    });

  });

});
