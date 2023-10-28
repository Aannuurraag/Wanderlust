if(process.env.NODE_ENV !="production"){
require('dotenv').config()
}


const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const MethodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session")
const MongoStore = require('connect-mongo');
const Listingsrouter=require("./routes/listing.js")
const reviewrouter=require("./routes/review.js")
const userrouter=require("./routes/user.js")
const flash=require("connect-flash");
const passport=require("passport")
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")
const { register } = require("module");
const { log } = require('console');



//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

let ATLASDB=process.env.ATLASDB_URL

main().then((res)=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(ATLASDB);
}



app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))
app.use(MethodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate)

// app.get("/",(req,res)=>{
//     res.send("root directory working")
// })
const store=MongoStore.create({
    mongoUrl:ATLASDB,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24 * 3600,
})
store.on("error",()=>{
    console.log("SOME ERROR IN SESSION STORE",err);
})

const sessionoption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        HttpOnly:true,
    }
}



app.use(session(sessionoption))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.Curruser=req.user
    next()
})

app.get("/demouser",async (req,res)=>{
   let fakeuser= new User({
    email:"student@gmail.com",
    username:"delta-student",
   })
   let newuser=await User.register(fakeuser,"helloworld")
   res.send(newuser);
})


app.use("/Listings",Listingsrouter)
app.use("/Listings/:id/reviews",reviewrouter)
app.use("/",userrouter)





app.all("*",(req,res,next)=>{
    next(new ExpressError("404","page not found"))
 })
app.use((err,req,res,next)=>{
    let{statuscode=500,message="Some error"}=err;
    res.status(statuscode).render("error.ejs",{message})
    //res.status(statuscode).send(message)
})






app.listen(8080,()=>{
    console.log("listening at port 8080");
})