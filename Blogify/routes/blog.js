const {Router}=require("express");
const multer=require("multer");
const path=require("path");

const Blog=require("../models/blog");
const Comment=require("../models/comment");

const router=Router();

function requireUser(req,res,next){
  if(!req.user){
    return res.redirect("/user/signin");
  }
  return next();
}

function canManageBlog(user,blog){
  if(!user || !blog) return false;
  return String(blog.createdBy)===String(user._id);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    const fileName=`${Date.now()}-${file.originalname}`;
    cb(null,fileName);
  },
});

const upload = multer({ storage: storage })

router.get("/add-new",requireUser,(req,res)=>{
    return res.render("addBlog",{
        user:req.user,
    });
});

router.post("/",requireUser,upload.single('coverImage'),async(req,res)=>{
    const{title,body}=req.body;
    const blog=await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImageURL:req.file ? `/uploads/${req.file.filename}` : "/images/default.png"
    });
    return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id/edit",requireUser,async(req,res)=>{
  const blog=await Blog.findById(req.params.id);
  if(!blog) return res.redirect("/");
  if(!canManageBlog(req.user,blog)) return res.redirect(`/blog/${blog._id}`);
  return res.render("editBlog",{
    user:req.user,
    blog,
  });
});

router.post("/:id/edit",requireUser,upload.single('coverImage'),async(req,res)=>{
  const blog=await Blog.findById(req.params.id);
  if(!blog) return res.redirect("/");
  if(!canManageBlog(req.user,blog)) return res.redirect(`/blog/${blog._id}`);

  blog.title=req.body.title;
  blog.body=req.body.body;
  if(req.file){
    blog.coverImageURL=`/uploads/${req.file.filename}`;
  }
  await blog.save();
  return res.redirect(`/blog/${blog._id}`);
});

router.post("/:id/delete",requireUser,async(req,res)=>{
  const blog=await Blog.findById(req.params.id);
  if(!blog) return res.redirect("/");
  if(!canManageBlog(req.user,blog)) return res.redirect(`/blog/${blog._id}`);

  await Comment.deleteMany({blogId:blog._id});
  await Blog.findByIdAndDelete(blog._id);
  return res.redirect("/");
});

router.get("/:id",async(req,res)=>{
  const blog=await Blog.findById(req.params.id).populate('createdBy');
  if(!blog) return res.redirect("/");
  const comments=await Comment.find({blogId:req.params.id}).populate('createdBy');
  return res.render("blog",{
    user:req.user,
    blog,
    comments,
  })
})

router.post("/comment/:blogId",requireUser,async(req,res)=>{
  await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id,
  })
  return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports=router;
