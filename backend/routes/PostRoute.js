
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const uploads=multer({storage});
const express=require("express");
const router=express.Router();
const Posts=require( "../controllers/PostController");

router.route("/").post(uploads.single('file'),Posts.createPost)
.put(uploads.single('file'),Posts.editPost)
.get(Posts.allPost);

router.route("/:id")
.get(Posts.showPost)
.delete(Posts.deletePost);

router.route("/:id/like").post(Posts.likePost);
module.exports=router;