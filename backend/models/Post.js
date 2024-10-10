const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const PostSchema = new Schema({
  title:{type:String,required:true},
  summary:{type:String,required:true},
  cover:
  {path:String,
  filename:String},
  author:{type:Schema.Types.ObjectId, ref:'User'},
  state:{type:String,required:true},
  destination:{type:String,required:true},
  fromDate:{type:Date,required:true},
  toDate:{type:Date,required:true} ,
  travelType: {
    type: String,
    enum: ["solo", "family", "friends", "couple", "business"], 
    default:"solo",
    required:true
  },
  tripHighlight: {
    type: String 
  },
  rating:Number,
  likes: {
    count: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of user IDs who liked
  }
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;