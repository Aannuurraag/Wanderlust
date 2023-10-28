const mongoose=require("mongoose");
const InitData=require("./data.js");
const Listing=require("../models/Listing.js")

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then((res)=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}




const init= async()=>{
    await Listing.deleteMany({});
    InitData.data=InitData.data.map((obj)=>({...obj,owner:"653139c448cc6d5ea8ce2381"}))
    await Listing.insertMany(InitData.data);
    console.log("saved");
}
init()