const User = require("../models/User.js");
const Post = require("../models/Post.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const salt = bcrypt.genSaltSync(10);
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const secret = process.env.SECRET;

module.exports.register = async (req, res) => {
  const { username, email, password, favouriteDestination, socialLinks } =
    req.body;
  try {
    const userDoc = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, salt),
      favouriteDestination,
      socialLinks,
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    return res.status(404).json({ message: "User not found" });
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign(
      { username, id: userDoc._id },
      secret,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, {
            maxAge: 3600000, // 1 hour
            httpOnly: true, // Ensures the cookie is only accessible via HTTP (not JavaScript)
            secure: true, // Cookie is sent only over HTTPS (this must be `true` in production)
            sameSite: "None", // Required for cross-origin requests (for allowing credentials)
          })
          .json({
            id: userDoc._id,
            username,
          });
      }
    );
  } else {
    res.status(400).json("wrong credentials");
  }
};

module.exports.profile = (req, res) => {
  const { token } = req.cookies;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verify the token
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      // Respond with an appropriate error message
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    // Send back user information if verification succeeds
    res.json(info);
  });
};
module.exports.account = (req, res) => {
  const { token } = req.cookies;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verify the token
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      // Respond with an appropriate error message
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    const userDoc = await User.findById(info.id);
    console.log(userDoc);
    res.json({
      username: userDoc.username,
      email: userDoc.email,
      favouriteDestination: userDoc.favouriteDestination,
      socialLinks: userDoc.socialLinks,
    });
  });
};

module.exports.editaccount = async (req, res) => {
  const { token } = req.cookies;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verify the token
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      // Respond with an appropriate error message if the token is invalid
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Extract the user ID from the token (info.id contains the user ID)
    const userId = info.id;

    try {
      const { username, email, password, favouriteDestination, socialLinks } =
        req.body;

      const user = await User.findById(userId); // Find the user by their ID

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if a password was provided, and hash it if needed
      const hashedPassword = password
        ? bcrypt.hashSync(password, 10)
        : user.password;

      // Update the user document with the new values or keep existing ones
      user.username = username || user.username;
      user.email = email || user.email;
      user.password = hashedPassword;
      user.favouriteDestination =
        favouriteDestination || user.favouriteDestination;
      user.socialLinks = socialLinks || user.socialLinks;

      // Save the updated user information to the database
      await user.save();

      // Respond with the updated user information
      res.json({
        username: user.username,
        email: user.email,
        favouriteDestination: user.favouriteDestination,
        socialLinks: user.socialLinks,
      });
    } catch (e) {
      console.error("Error updating account:", e);
      res.status(400).json({ error: "Failed to update account" });
    }
  });
};
module.exports.deleteAccount = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Verify the token
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const userId = info.id;

    try {
      // Find and delete all posts created by the user
      await Post.deleteMany({ author: userId });

      // Remove user ID from liked posts' "likedBy" array
      await Post.updateMany(
        { "likes.likedBy": userId },
        { $pull: { "likes.likedBy": userId } }
      );

      // Delete the user account
      await User.findByIdAndDelete(userId);
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), // Expire the cookie immediately
        path: "/",
        // secure: true,      // Cookie is sent only over HTTPS (this must be `true` in production)
        // sameSite: 'None'   // Ensure the path matches where it was set
      });
      res.json({ message: "Account and associated posts deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error deleting account and posts" });
    }
  });
};
module.exports.logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
    path: "/",
    // secure: true,      // Cookie is sent only over HTTPS (this must be `true` in production)
    // sameSite: 'None'// Ensure the path matches where it was set// Only set `secure` in production
  });
  res.json("ok");
};
