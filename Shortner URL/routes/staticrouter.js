const express = require("express");
const router = express.Router();
const url = require("../models/url");
const { restricto } = require("../middleware/auth");

router.get("/admin/urls",restricto(["admin"]),async(req,res)=>{

    
    const allurls=await url.find({});
    return res.render("home",{
        urls:allurls,
    });

})
router.get("/",restricto(["normal","admin"]),async(req,res)=>
{
   
    const allurls=await url.find({createdBy:req.users?._id});
    return res.render("home",{
        urls:allurls,
    });
});


router.get("/signup",(req,res)=>{
    return res.render("signup");
})
router.get("/login",(req,res)=>{
    return res.render("login");
})
module.exports = router;
