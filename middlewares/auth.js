const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/helper");
const User = require("../models/User");

exports.isAuth = async (req, res, next) => {
  //const token = req.headers?.authorization;
  const token = req.cookies?.dltoken
  if (!token) return res.redirect('/auth/login')
  // const jwtToken = token.split("Bearer ")[1];

  // if (!jwtToken) return sendError(res, "Invalid token!");
      try {
        var decode = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.redirect('/auth/login')
      }
 // const decode = jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = decode;

  const user = await User.findById(userId);

  if (user.isBlocked.status) return res.render('utils/err-handle-page', { error: { msg: "Sorry your account is blocked pleas contact to admin", link: '/contact' } })
  // if (!user) return sendError(res, "unauthorized access!");
  if (!user) return res.redirect('/auth/login')
 
  req.user = user;

  next();
};

exports.isAdmin = async (req, res, next) => {
  const { user } = req;
  console.log(user)
  if (user.role !== "admin")  return res.redirect('/auth/login')
  next();
};

exports.isUser = async (req, res, next) => {
  const token = req.cookies?.dltoken

  if (token){
    // const decode = jwt.verify(token, process.env.JWT_SECRET);
    try {
      var decode = jwt.verify(token, process.env.JWT_SECRET);
      
    } catch (error) {
      req.user = null; 
      return next()
    }
    const { userId } = decode;
    const user = await User.findById(userId);
    if(user){
      req.user = user;
      next();
    }else{
      req.user = null;
      next()
    }

  }else{
    req.user = null;
    next();
  }
};

exports.ajaxIsAuth = async (req, res, next) => {
  //const token = req.headers?.authorization;
  const token = req.cookies?.dltoken
  if (!token) return res.send({ auth: true, msg: "Please login first !" })
  // const jwtToken = token.split("Bearer ")[1];

  // if (!jwtToken) return sendError(res, "Invalid token!");
      try {
        var decode = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.send({ auth: true, msg: "Please login first !" })
      }
 // const decode = jwt.verify(token, process.env.JWT_SECRET);
  const { userId } = decode;

  const user = await User.findById(userId);

  if (user.isBlocked.status) return res.render('utils/err-handle-page', { error: { msg: "Sorry your account is blocked pleas contact to admin", link: '/contact' } })
  // if (!user) return sendError(res, "unauthorized access!");
  if (!user) return res.send({ auth: true, msg: "Please login first !" })
 
  req.user = user;

  next();
};

exports.loginUrl = async (req, res, next) => {
  req.session.reqUrl = req.headers.referer
  next();
};

exports.alreadyVerified = async (req, res, next) => {
  let userId= req.params.userId
  let user =await User.findById(userId);
  if(user.isVerified)  return res.redirect('/user/my-profile')
  next();
};