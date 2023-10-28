const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./Review.js")

const ListingSchema=new Schema({
    title:{
        type:String,
       
    },
    description:{
        type:String,
        
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        
    },
    country:{
        type:String,
        
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
       
})
ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing=mongoose.model("Listing",ListingSchema);

module.exports=Listing;