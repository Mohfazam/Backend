const mongoose = require("mongoose");
const schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const user = new schema({
    email: String,
    password: String,
    name: String
});


const todo = new schema({
    title: String,
    done: Boolean,
    userid: ObjectId
});