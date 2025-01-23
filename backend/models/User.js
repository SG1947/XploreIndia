const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
  username: {type: String, required: true, min: 4, unique: true},
  email: {type:String, unique:true},
  password: {type: String, required: true},
  favouriteDestination:{type: String},
  socialLinks:{
    facebook:{type:String},
    instagram:{type:String}
  }
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;