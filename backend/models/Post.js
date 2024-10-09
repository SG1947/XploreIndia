const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const PostSchema = new Schema({
  title:String,
  summary:String,
  cover:
  {path:String,
  filename:String},
  author:{type:Schema.Types.ObjectId, ref:'User'},
  state:String,
  destination:String,
  fromDate:Date,
  toDate:Date ,
  travelType: {
    type: String,
    enum: ["solo", "family", "friends", "couple", "business"], 
    default:"solo",
  },
  tripHighlight: {
    type: String 
  },
  rating:Number,
  likes: {
    count: { type: Number, default: 0 }, // Count of likes
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of user IDs who liked
  }
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;