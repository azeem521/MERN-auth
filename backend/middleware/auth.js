const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

exports.isAuthenticate = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(402).json({
        success: false,
        message: "Please Login to access these resources",
      });
    }
    const decodeData = jwt.decode(token, "secrete");
    req.user = await User.find({email:decodeData.Email});
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.autherizedRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user[0].role)) {
      res.status(400).json({
        success: false,
        message: "You can not access these resources",
      });
    }
    next();
  };
};
