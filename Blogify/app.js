require("dotenv").config();
const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");

const Blog=require("./models/blog");

const userRoute=require("./routes/user");
const blogRoute=require("./routes/blog");

const {checkforauthenticationCookie} = require("./middleware/authentication");

const app=express();
const PORT=process.env.PORT ||8000;

mongoose
    .connect(process.env.MONGO_URL)
    .then(e=>console.log("MongDB connected"));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkforauthenticationCookie());
app.use(express.static(path.resolve("./public")));

app.get("/",async(req,res)=>{
    const allblogs=await Blog.find({}).populate("createdBy").sort({createdAt:-1});
    res.render("home",{
        user:req.user,
        blogs:allblogs,
    });
})

app.use("/user",userRoute);
app.use("/blog",blogRoute);



app.listen(PORT,(req,res)=>{
    console.log("Server Started Learning At :",PORT);
})
