
const express=require("express");
const router=express.Router();

const Users=require( "../controllers/UserController.js");

router.route("/register").post(Users.register)
router.route("/login").post(Users.login)
router.route("/profile").get(Users.profile)
router.route("/account")
  .get(Users.account)
router.route("/account/edit").put(Users.editaccount)
router.route("/account/delete").delete(Users.deleteAccount)
router.route("/logout").post(Users.logout)

module.exports=router;