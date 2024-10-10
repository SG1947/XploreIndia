if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const secret = process.env.SECRET;
const Post = require("../models/Post.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

module.exports.createPost = async (req, res) => {
  try {
    // Ensure req.file exists before destructuring
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { path, filename } = req.file;
    const { token } = req.cookies;

    // Verify the JWT token
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.log('Token verification failed:', err.message); // Log error details
        return res.status(401).json({ message: 'Token expired or invalid' }); // Return error response
      }

      // Extract fields from the request body
      const { title, summary, state, destination, fromDate, toDate, travelType, tripHighlight, rating } = req.body;

      // Check if required fields are present
      if (!title || !summary || !state || !destination) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create the post document
      const postDoc = await Post.create({
        title,
        summary,
        cover: { path, filename },
        author: info.id,
        state,
        destination,
        fromDate,
        toDate,
        travelType,
        tripHighlight,
        rating
      });

      console.log('Post created successfully:', postDoc);
      res.status(201).json(postDoc); // Respond with 201 Created status
    });
  } catch (error) {
    console.error('Error creating post:', error.message); // Log the error
    res.status(500).json({ message: 'Internal Server Error' }); // Respond with a generic error message
  }
};

module.exports.editPost=async (req,res) => {
    // console.log(req.file);
    let newimg = null;
    if(req.file){
      const {path,filename} = req.file;
      newimg={path,filename}
    }
    // const {path,filename} = req.file;

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,state,destination,fromDate,toDate,travelType,tripHighlight,rating} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      console.log(postDoc);
      await Post.findByIdAndUpdate(id,{
        title,
        summary,
        cover: newimg ? newimg : postDoc.cover,
        state,destination,fromDate,toDate,travelType,tripHighlight,rating
      });

      res.json(postDoc);
    });

  }
module.exports.allPost=async (req,res) => {
    res.json(
      await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
  }
module.exports.showPost=async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
}
module.exports.deletePost=async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' }); // Return unauthorized if token is invalid
        }
        const postDoc = await Post.findById(id);
        if (!postDoc) {
            return res.status(404).json({ message: 'Post not found' }); // Return not found if post doesn't exist
        }

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(401).json({ message: 'You are not the author' }); // Return forbidden if not the author
        }
        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: 'Post deleted successfully' }); // Return success message
    });
  }
module.exports.likePost= async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' }); // Return unauthorized if token is invalid
      }

      try {
        const post = await Post.findById(id);

        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }

        const userId = info.id; // Get user ID from token info
        // console.log(post.likes.[likedBy]);
        // Check if the user has already liked the post
        if (post.likes.likedBy.includes(userId)) {
          return res.status(400).json({ message: 'You have already liked this post' });
        }

        // Update the likes count and add user ID to likedBy array
        post.likes.count += 1;
        post.likes.likedBy.push(userId);

        await post.save();
        res.status(200).json(post); // Return the updated post
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
  }
// module.exports.createPost = async (req, res) => {
//   try {
//     const { path, filename } = req.file;
//     const { token } = req.cookies;
//     const info = await verifyToken(token);

//     const {
//       title,
//       summary,
//       state,
//       destination,
//       fromDate,
//       toDate,
//       travelType,
//       tripHighlight,
//       rating,
//     } = req.body;
//     const postDoc = await Post.create({
//       title,
//       summary,
//       cover: { path, filename },
//       author: info.id,
//       state,
//       destination,
//       fromDate,
//       toDate,
//       travelType,
//       tripHighlight,
//       rating,
//     });
//     res.json(postDoc);
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports.editPost = async (req, res) => {
//   try {
//     let newimg = null;
//     if (req.file) {
//       const { path, filename } = req.file;
//       newimg = { path, filename };
//     }
//     const { token } = req.cookies;
//     const info = await verifyToken(token);

//     const {
//       id,
//       title,
//       summary,
//       state,
//       destination,
//       fromDate,
//       toDate,
//       travelType,
//       tripHighlight,
//       rating,
//     } = req.body;
//     const postDoc = await Post.findById(id);

//     if (!isUserAuthor(postDoc.author, info.id)) {
//       return res.status(400).json("You are not the author");
//     }

//     await Post.findByIdAndUpdate(id, {
//       title,
//       summary,
//       cover: newimg ? newimg : postDoc.cover,
//       state,
//       destination,
//       fromDate,
//       toDate,
//       travelType,
//       tripHighlight,
//       rating,
//     });

//     res.json(postDoc);
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports.allPost = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("author", ["username"])
//       .sort({ createdAt: -1 })
//       .limit(20);
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports.showPost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const postDoc = await Post.findById(id).populate("author", ["username"]);
//     res.json(postDoc);
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports.deletePost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { token } = req.cookies;
//     const info = await verifyToken(token);

//     const postDoc = await Post.findById(id);
//     if (!postDoc) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     if (!isUserAuthor(postDoc.author, info.id)) {
//       return res.status(401).json({ message: "You are not the author" });
//     }

//     await Post.findByIdAndDelete(id);
//     res.status(200).json({ message: "Post deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports.likePost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { token } = req.cookies;
//     const info = await verifyToken(token);

//     const post = await Post.findById(id);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const userId = info.id; // Get user ID from token info
//     if (post.likes.likedBy.includes(userId)) {
//       return res
//         .status(400)
//         .json({ message: "You have already liked this post" });
//     }

//     // Update the likes count and add user ID to likedBy array
//     post.likes.count += 1;
//     post.likes.likedBy.push(userId);

//     await post.save();
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
