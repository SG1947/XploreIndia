const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const secret = process.env.SECRET;

module.exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
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
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id}, secret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.cookie("token", token,{maxAge: 3600000})
      .json({
        id: userDoc._id,
        username
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
};

module.exports.profile = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
};
module.exports.logout = (req, res) => {
  res.cookie("token", "").json("ok");
};
