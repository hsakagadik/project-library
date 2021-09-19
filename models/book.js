const ObjectId = require('mongodb').ObjectId;

module.exports = function Book(obj){
    this._id = new ObjectId();
    this.title = obj.title;
    this.comments = obj.comments || [];
    this.commentcount = obj.commentcount || 0;
}