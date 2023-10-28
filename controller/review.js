const Review=require("../models/Review");
const Listing=require("../models/Listing")


module.exports.createreview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);
    newreview.author=req.user._id

    listing.reviews.push(newreview);
    console.log(newreview);

    await newreview.save()
    await listing.save()
    req.flash("success","new Review added")
    res.redirect(`/Listings/${listing._id}`)
}

module.exports.destroyreview=async(req,res)=>{
    let {id,reviewID}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}})
    await Review.findByIdAndDelete(reviewID)
    req.flash("success","Review deleted")
    res.redirect(`/Listings/${id}`)
}