require('dotenv').config();


const express = require("express");
const {usermodel, todomodel} = require("./db");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const JWT_SECRET = "Hellousertodos";



mongoose.connect(process.env.MONGO_URI);

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
            id: user._id.toString()
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

function auth(req, res, next){
    const token = req.headers.token;

    const decodeddata = jwt.verify(token, JWT_SECRET);

    if(decodeddata){
        req.userid = decodeddata.id;
        next();
    }
    else{
        res.status(403).json({
            message: "Incorrect Credentials"
        });
    }
}


app.post("/todo", auth, function(req, res){

    const userid = req.userid;
    const title = req.body.title;

    todomodel.create({
        title,
        userid
    });

    res.json({
        message: "todo created"
    });
    
});

app.get("/todos", auth, async function(req, res){

    const userid = req.userid;
    const todos = await todomodel.find({
        userid: userid
    })

    res.json({
        message: "reached here",
        userid: userid
    })
});


app.listen(3000);