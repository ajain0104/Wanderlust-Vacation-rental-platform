const express = require("express");
const app =express();
const mongoose = require("mongoose");
const path = require("path");
const listing = require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError=require('./utils/ExpressError.js')
const {listingSchema}=require('./schema.js')


app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set("view engines","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/",(req,res)=>{
    res.send("Hi,I m root");
});

app.get("/listings",wrapAsync(async (req,res)=>{
    let lists =await listing.find();
    res.render("listings/index.ejs",{lists})
}));

app.get("/listings/new",(req,res)=>{
    res.render("listings/add.ejs");
})

app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let x= await listing.findById(id);
    res.render("listings/show.ejs",{x});
}))

app.post("/listings",wrapAsync(async (req,res)=>{
    let {list} = req.body;
    const newlisting = new listing(list);
    await newlisting.save();
    res.redirect("/listings")
}))

app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let d=await listing.findById(id);
    res.render("listings/edit.ejs",{d});
}))

app.patch("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/listings/${id}`);
}))

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
    
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).send(message);
})

app.listen("8080",()=>{
    console.log("server is working");
});

