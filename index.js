const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const data = require("./data.js");
main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(data);
    console.log("database initialised");
}

initDB();