const User=require("../models/user");

module.exports.rendersigninform=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signin=async(req,res)=>{
    let{username,email,password}=req.body;
    let newuser=new User({username,email});
    let registereduser= await User.register(newuser,password)
    console.log(registereduser);
    req.login(registereduser,(err)=>{
        if(err){
            next(err)
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/Listings")
    })
    }

    module.exports.renderloginform=(req,res)=>{
        res.render("users/login.ejs")
    }

    module.exports.login=async(req,res)=>{
        req.flash("success","welcome back to wanderlust");
        let redirecturll=res.locals.redirectUrl || "/Listings";
        res.redirect(redirecturll)
        }

        module.exports.logout=(req,res,next)=>{
            req.logOut((err)=>{
                if(err){
                    next(err)
                }
                req.flash("success","you are logged out");
                res.redirect("/Listings")
            })
        }