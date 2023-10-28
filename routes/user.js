const express=require("express");
const router=express.Router()
const User=require("../models/user");
const Wrapasync = require("../utils/Wrapasync");
const passport=require("passport");
const { redirecturl } = require("../middleware.js");
const usercontroller=require("../controller/user")

router
.route("/signup")
.get(usercontroller.rendersigninform)
.post(Wrapasync(usercontroller.signin))


router
    .route("/login")
    .get(usercontroller.renderloginform)
    .post(redirecturl,
    passport.authenticate("local",
    {failureRedirect:"/login",
    failureFlash:true}),
    usercontroller.login)

    

    router.get("/logout",usercontroller.logout)

module.exports=router;