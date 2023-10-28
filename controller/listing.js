const Listing=require("../models/Listing.js")
module.exports.index=async (req,res)=>{
    let AllListing=await Listing.find({});
    res.render("listing/index.ejs",{AllListing})
      
}
module.exports.rendernewlisting= async (req,res)=>{
    res.render("listing/new.ejs")
}

module.exports.showlisting=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
     populate:{path:"author"},
    })
    .populate("owner");
    if(!listing){
        req.flash("error","The listing you requested does not exist")
        res.redirect("/Listings")
    }
    res.render("listing/show.ejs",{listing})
}
module.exports.createlisting=async (req,res,next)=>{
    let url=req.file.path
    let filename=req.file.filename
    let newlisting=new Listing(req.body.listing)
    newlisting.image={url,filename}
    newlisting.owner=req.user._id

   await newlisting.save()
   req.flash("success","new Listing added")
   res.redirect("/Listings")


}

module.exports.rendereditlisting=async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id)
    console.log(listing);
    if(!listing){
        req.flash("error","The listing you requested doesn not exist")
        res.redirect("/Listings")
    }
    let originalimage=listing.image.url
   originalimage = originalimage.replace("/upload","/upload/w_250")

    res.render("listing/edit.ejs",{listing,originalimage})
}

module.exports.updatelisting=async (req,res)=>{
    let{id}=req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){
    let url=req.file.path
    let filename=req.file.filename
     listing.image={url,filename}
    await listing.save()
    }
    req.flash("success"," Listing updated")
   res.redirect(`/Listings/${id}`)
}

module.exports.deletelisting=async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted")
   res.redirect(`/Listings`)
}