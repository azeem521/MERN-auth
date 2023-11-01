const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const isExistEmail = await User.find({ email });
    if (isExistEmail && isExistEmail[0]) {
      return res
        .status(400)
        .json({ success: false, message: "email already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = jwt.sign({ name, email }, "secrete", {
      expiresIn: "2d",
    });
    // options for cookies
    const options = {
      expires: new Date(Date.now() + 39000000),
      httpOnly: true,
    };
    res
      .status(201)
      .cookie("token", token, options)
      .json({ success: true, user, token });
  } catch (error) {
    console.log(error,'<----------');
    res.status(401).json({ message: "cann't create" });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(401).json({ message: "not found" });
    }

    const isPassMatched = await bcrypt.compare(password, isUser.password);
    if (!isPassMatched) {
      return res
        .status(401)
        .json({ message: "Email or password is not matched" });
    }
    const token = jwt.sign(
      { name: isUser.name, Email: isUser.email },
      "secrete",
      {
        expiresIn: "2d",
      }
    );
    // options for cookies
    const options = {
      expires: new Date(Date.now() + 39000000),
    };
    res
      .status(201)
      .cookie("token", token, options)
      .json({ success: true, isUser, token });
  } catch (error) {
    res.status(401).json({ message: "something went wrong" });
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const newData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
    const user = await User.findByIdAndUpdate(req.params.id, newData, {
      new: true,
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "something went wrong" });
    }
    res.status(200).json({
      success: true,
      message: "Role has been updated",
      user,
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "something went wrong" });
  }
};

// forgot password

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      return res.status(402).json({
        success: false,
        message: "Email is invalid",
      });
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPassUrl = `http\\:127.0.0.1:/auth/password/forgot/${resetToken}`;
    const message = `Your password recovry url is ${resetPassUrl}`;
    // await sendMail({
    //   email: user.email,
    //   subject: "Password recovery",
    //   message,
    // });
    console.log(resetToken);
    res.status(200).json({
      success: true,
      message: "check console",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(402).json({
      success: false,
      error,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
      return res.status(402).json({
        success: false,
        message: "Token is expired",
      });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password chaged succeessfull",
    });
  } catch (error) {
    // user.resetPasswordToken = undefined;
    // user.resetPasswordExpire = undefined;
    return res.status(402).json({
      success: false,
      error,
    });
  }
};

// update password
exports.updatePassword = async (req,res,next)=>{
  try {
    console.log(req.user[0].email);
    const user = await User.findById(req.user[0]._id).select("+password");
    console.log(user,'<-----------');
    const isPassMatched = await bcrypt.compare(req.body.password,user.password);
    if(!isPassMatched){
      res.status(400).json({
        success:false,
        message:"password not matched"
      })
    }
    const hash = await bcrypt.hash(req.body.new,10);
    user.password = hash;
    user.save({validateBeforeSave:false});
    res.status(400).json({
      success:true,
      message:"Changed" 
    })
  } catch (error) {
    res.status(400).json({
      success:false,
      message:"not found"
    })
  }
},
//  get All users to show on dashboard
exports.getAllUsers = async (req,res,next)=>{
  try {
    const allUsers = await User.find();
    res.status(200).json({message:'success',allUsers})
  } catch (error) {
    res.status(200).json({message:'fail',error})
  }
}