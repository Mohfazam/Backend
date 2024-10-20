const mongoose = require("mongoose");
const schema = mongoose.Schema;


const ObjectId = mongoose.ObjectId;

const user = new schema({
    email: {type: String, unique: true},
    password: String,
    name: String
});


const todo = new schema({
    title: String,
    done: Boolean,
    userid: ObjectId
});

const usermodel = mongoose.model("Users", user);
const todomodel = mongoose.model("Todos", todo);


module.exports = {
    usermodel: usermodel,
    todomodel: todomodel
}