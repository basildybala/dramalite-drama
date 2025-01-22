const express = require('express');
const app=express()
require('./db')
require('./config/redis')
require('dotenv').config()
const morgan =require('morgan')
var bodyParser = require('body-parser')
const flash=require('connect-flash')
var session=require('express-session');
var cookieParser = require('cookie-parser')
const cors =require('cors');
const path =require('path')

//ROUTES SETUP
const homeRoutes=require('./routes/home')
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user')
const celebsRoutes=require('./routes/celebs')
const movieRoutes=require('./routes/movies')
const adminRoutes=require('./routes/admin')

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
//app.use(bodyParser)
app.use(cors())
//app.use(morgan("dev"))
require("express-async-errors");
app.locals.user=null

app.set('views', path.join(__dirname, 'views'));



// set view engine
app.set("view engine", "ejs")

//Public Folder Set Up
app.use('/public', express.static('public'))
//app.use('/public',express.static('public'))
app.use(express.static('public'))
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'phot')));
app.use(session({
    secret:'secret',
    cookie:{maxAge:1900000},
    resave:true,
    saveUninitialized:true  
}))

//ROUTES LINK SETUP
app.use('/',homeRoutes)
app.use('/auth',authRoutes)
app.use('/user',userRoutes)
app.use('/celebs',celebsRoutes)
app.use('/drama',movieRoutes)
app.use('/devadmin',adminRoutes)
//app.use(session({secret:'Key',resave:true,saveUninitialized:true,cookie:{maxAge:60000000}},));
app.use(flash())





































app.listen(process.env.PORT,()=>{
    console.log(`Server running ${process.env.PORT}`)
})