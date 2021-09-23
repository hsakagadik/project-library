const schema = {
    bsonType: "object",
    additionalProperties: false,
    properties: {
        _id: {
            bsonType: "objectId",
            description: "unique book id"
        },
        title:{
            bsonType: "string",
            description: "the book title is required"
        },
        comments:{
            bsonType: "array",
            description: "the book's comments"
        },
        commentcount: {
            bsonType: "number",
            description: "the book's comments count"
        }
    }
};

module.exports = schema;