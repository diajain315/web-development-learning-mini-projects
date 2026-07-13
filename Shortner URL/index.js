const express = require("express");
const { connecttomongodb } = require("./connect");
const cookieparser=require("cookie-parser");
const path=require("path");
const {checkforauthentication,restricto}=require("./middleware/auth");
const app = express();
const url = require("./models/url");
const PORT = 8001;

const urlroute = require("./routes/url");
const staticroute=require("./routes/staticrouter");
const userRoute=require("./routes/user");


connecttomongodb("mongodb://127.0.0.1:27017/short-url").then(() => {
  console.log("Mongodb connected");
});
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.get("/test",async (req,res)=>
{
  const allurls=await url.find({});
  return res.render("home",{
    urls:allurls,
  });
})
app.use(express.json());
app.use(cookieparser());
app.use(checkforauthentication);

app.use(express.urlencoded({extended:false}))

app.get("/url/:shortid", async (req, res) => {
  const shortid = req.params.shortid;
  const entry = await url.findOneAndUpdate(
    {
      shortid,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
  );
  res.redirect(entry.redirectURL);
});
app.use("/url",restricto(["normal"]), urlroute);
app.use("/",staticroute);
app.use("/user",userRoute);

app.listen(PORT, () => {
  console.log("Server running on PORT : ", PORT);
});
