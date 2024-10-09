const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}



const UserRouter=require("./routes/UserRoute.js");
const PostRouter=require("./routes/PostRoute.js");

app.use(cors({credentials:true,origin:'http://localhost:5173'}));
app.use(express.json());
app.use(cookieParser());


const MONGO_URL=process.env.MONGO_URL;
main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.use("/",UserRouter);
app.use("/post",PostRouter);

app.listen(8000,(req,res)=>{
   console.log("Listening to port 8000")
});