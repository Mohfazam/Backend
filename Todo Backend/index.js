const express = require("express");
const {usermodel, todomodel} = require("./db");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const JWT_SECRET = "Hellousertodos";



mongoose.connect("mongodb+srv://mohfazam:wPlvY91k1HgmrD13@cluster0.f8f0e.mongodb.net/todo-sarwar-2")

const app = express();

app.use(express.json());

app.post("/signup", async function(req, res){

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await usermodel.create({
        email: email,
        password: password,
        name: name
    });

    res.json({
        message: "Your are Signed Up"
    });

});

app.post("/signin", async function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await usermodel.findOne({
        email: email,
        password: password
    });

    if(user){

        const token = jwt.sign({
            id: user._id
        },JWT_SECRET);
        res.json({
            token: token
        });
    }
    else{
        res.status(401).json({
            message: "Incorrect Credentials"
        });
    }
});

app.post("/todo", function(req, res){
    
});

app.get("/todos", function(req, res){
    
});


app.listen(3000);