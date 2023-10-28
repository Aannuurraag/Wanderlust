const express=require("express");
const router=express.Router({mergeParams:true})
const WrapAsync=require("../utils/Wrapasync.js")
const Listing = require("../models/Listing.js");
const Review=require("../models/Review.js")
const{Validatereview, isloggedin,isreviewAuthor}=require("../middleware.js")
const reviewrouter=require("../controller/review.js")


 

//post route
//review
router.post("/",Validatereview,isloggedin,WrapAsync(reviewrouter.createreview))
//delete review route
router.delete("/:reviewID",isloggedin,isreviewAuthor,WrapAsync(reviewrouter.destroyreview))

module.exports=router;