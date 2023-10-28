const express=require("express");
const router=express.Router()
const WrapAsync=require("../utils/Wrapasync.js")
const Listing=require("../models/Listing.js")
const {isloggedin,ownerid,Validatelisting}=require("../middleware.js")
const listingrouter=require("../controller/listing.js")
const multer=require("multer");
const {storage}=require("../cloudconfig.js")
const upload=multer({storage})

 



router
.route("/")
.get(WrapAsync(listingrouter.index))
.post(   isloggedin, 
         upload.single("listing[image]"),
         Validatelisting,
         WrapAsync(listingrouter.createlisting))


router.get("/new",isloggedin,WrapAsync(listingrouter.rendernewlisting))


router
.route("/:id")
.get(isloggedin,WrapAsync(listingrouter.showlisting))
.put(isloggedin,ownerid, upload.single("listing[image]"),Validatelisting,WrapAsync(listingrouter.updatelisting))
.delete(isloggedin,ownerid,WrapAsync(listingrouter.deletelisting))

//edit route
router.get("/:id/edit",isloggedin,ownerid,WrapAsync(listingrouter.rendereditlisting))


module.exports=router;