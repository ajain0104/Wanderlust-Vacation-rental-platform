const mongoose=require("mongoose");

const listingSchema = mongoose.Schema({
    title :{
        type:String,
        required:true,
    },
    description :{
        type:String,
    },
    price :{
        type:Number,
        required:true,
    },
    location :{
        type:String,
        required:true,
    },
    country :{
        type:String,
        required:true,
    },
    image :{
        type:String,
        set : (v)=>v==="" ? "default link":v,
    },
})

const listing = new mongoose.model("listing",listingSchema);

module.exports = listing;