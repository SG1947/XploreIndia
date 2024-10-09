
const express=require("express");
const router=express.Router();

const Users=require( "../controllers/UserController.js");

router.route("/register").post(Users.register)
router.route("/login").post(Users.login)
router.route("/profile").get(Users.profile)
router.route("/logout").post(Users.logout)

module.exports=router;