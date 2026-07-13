const {Router}=require("express");
const multer=require("multer");
const path=require("path");
const User=require("../models/user");
const Blog=require("../models/blog");
const { createTokenForUser } = require("../services/authentication");
const router=Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./public/uploads/"));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

function requireUser(req,res,next){
    if(!req.user){
        return res.redirect("/user/signin");
    }
    return next();
}

router.get("/signin",(req,res)=>{
    return res.render("signin");
})
router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.get("/profile",requireUser,async(req,res)=>{
    const dbUser=await User.findById(req.user._id);
    if(!dbUser){
        return res.clearCookie("token").redirect("/user/signin");
    }
    res.locals.user=dbUser;
    const blogs=await Blog.find({createdBy:req.user._id}).sort({createdAt:-1});
    return res.render("profile",{
        user:dbUser,
        blogs,
    });
})

router.post("/profile",requireUser,upload.single("profileImage"),async(req,res)=>{
    const dbUser=await User.findById(req.user._id);
    if(!dbUser){
        return res.clearCookie("token").redirect("/user/signin");
    }
    dbUser.fullName=req.body.fullName;
    if(req.file){
        dbUser.profileImageURL=`/uploads/${req.file.filename}`;
    }
    await dbUser.save();
    const token=createTokenForUser(dbUser);
    return res.cookie("token",token).redirect("/user/profile");
})

router.post("/signin",async(req,res)=>{
   const{email,password}=req.body;
   try{
   const token=await User.matchedPasswordAndGenerateToken(email,password);
   return res.cookie("token",token).redirect("/");
   }catch(error){
    return res.render("signin",{
        error:"Incorrect Email or Password",
    });
   }
})

router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})

router.post("/signup",async(req,res)=>{
    const{fullName,email,password}=req.body;
    try{
        await User.create({
            fullName,
            email,
            password,
        });
        return res.redirect("/user/signin");
    }catch(error){
        return res.render("signup",{
            error:"Account already exists or details are invalid",
        });
    }
})

module.exports=router;
