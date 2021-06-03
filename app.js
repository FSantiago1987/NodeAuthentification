//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
//const encrypt = require('mongoose-encryption');
//const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


/*userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});*/

const User = new mongoose.model("User", userSchema);

app.get('/', function(req, res){
    res.render("home");
});

app.get('/login', function(req, res){
    res.render("login");
});

app.get('/register', function(req, res){
    res.render("register");
});

app.post('/register', function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            email: req.body.username,
            //password: req.body.password
            //password: md5(req.body.password)
            password: hash
        });
    
        newUser.save(function(err){
            if(!err){
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    });
})

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    //const password = md5(req.body.password);

    User.findOne({email: username}, function(err, foundUser){
        if(!err){
            bcrypt.compare(password, foundUser.password, function(err, result){
                if(result === true){
                    res.render('secrets');
                } else {
                    console.log("Wrong Password");
                }
            });
        } else {
            console.log(err);
        }
    })
})

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});