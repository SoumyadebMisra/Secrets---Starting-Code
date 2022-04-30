require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const encrypt = require('mongoose-encryption');
const mongoose = require('mongoose');
app.use(express.static(__dirname + "public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret: secret,encryptedFields:['password']});

const User = mongoose.model('user',userSchema);

app.get('/', (req,res)=>{
    res.render('home');
});

app.get('/login', (req,res)=>{
    res.render('login');
});

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((err)=>{
        if(err){
            console.log(err);
        } 
        else{
            res.render('secrets');
        }
    });
});

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const pass = req.body.password;
    User.findOne({email: username},(err,founduser)=>{
        if(err){
            console.log(err);
        } else {
            if(founduser){
                if(founduser.password === pass){
                    res.render('secrets');
                }
            } else{
                res.send('Account does not exist.')
            }
            
        }
    })
});

app.listen(3000,()=>{
    console.log('Server running on port 3000');
})