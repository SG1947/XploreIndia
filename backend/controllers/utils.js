const secret =process.env.SECRET;
const jwt = require('jsonwebtoken');

// Helper function to verify the token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) {
      console.log('Token verification failed:', err.message); // Log error details
      throw new Error('Token expired or invalid');}
      else resolve(info);
    });
  });
};

// Helper function to check if the user is the author
const isUserAuthor = (postAuthorId, currentUserId) => {
  return JSON.stringify(postAuthorId) === JSON.stringify(currentUserId);
};

module.exports = {
  verifyToken,
  isUserAuthor,
};







