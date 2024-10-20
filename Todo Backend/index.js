require('dotenv').config();

const bcrypt = require("bcrypt");
const express = require("express");
const {usermodel, todomodel} = require("./db");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
// const  z  = require("zod");



const JWT_SECRET = "Hellousertodos";



mongoose.connect(process.env.MONGO_URI);

const app = express();

app.use(express.json());

app.post("/signup", async function(req, res){

    const requiredbody = z.object({
        email: z.string().min(3).max(100).email(),
        name: z.string().min(3).max(100),
        password: z.string().min(3).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        })
    });

    // const parseddata = requiredbody.parse(req.body);
    const parseddatawithsuccess = requiredbody.safeParse(req.body);

    if(!parseddatawithsuccess.success){
        res.json({
            message:"Incorrect Format",
            Error: parseddatawithsuccess.error
        });
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    let errorthrown = false;

    try{
    const hashedpassword = await bcrypt.hash(password, 5);
    console.log(hashedpassword);

    await usermodel.create({
        email: email,
        password: hashedpassword,
        name: name
    });
    } catch(e){
        res.json({
            message: "User Already Exists"
        });
        errorthrown = true;
        
    }

    if(!errorthrown){
        res.json({
            message: "Your are Signed Up"
        });
    }

    

});

app.post("/signin", async function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const response = await usermodel.findOne({
        email: email
    });

    if(!response){
        res.status(403).json({
            message: "User does not exist in our database"
        });
    }

    const passwordmatch = await bcrypt.compare(password, response.password);

    if(passwordmatch){

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