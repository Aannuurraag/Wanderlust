const Listing = require("./models/Listing");
const ExpressError=require("./utils/ExpressError.js");
const{reviewSchema}=require("./schema.js");
const{listingSchema}=require("./schema.js");
const Review = require("./models/Review");
const Wrapasync = require("./utils/Wrapasync");


module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl);
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in")
        return res.redirect("/login")
    }
    next()
}

module.exports.redirecturl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
        console.log(res.locals.redirectUrl);
    }
    next()
}
module.exports.ownerid= async(req,res,next)=>{
    let{id}=req.params
    let listing= await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.Curruser._id)){
     req.flash("error","you dont have permission to edit");
     res.redirect(`/Listings/${id}`)
    }
    next()
}
module.exports.Validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
    if(error){
     throw new ExpressError(400,error)
    }
    else{
        next()
    }
}

module.exports.Validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
     throw new ExpressError(400,error)
    }
    else{
        next()
    }
}

module.exports.isreviewAuthor= async(req,res,next)=>{
    let{id,reviewID}=req.params
    let review= await Review.findById(reviewID)
    console.log(review);
    if(!review.author._id.equals(res.locals.Curruser._id)){
     req.flash("error","you dont have permission to delete");
     res.redirect(`/Listings/${id}`)
    }
    next()
}