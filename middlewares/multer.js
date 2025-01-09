const multer = require("multer");
let shortid = require('shortid');
const path = require('path');
var slugify = require('slugify');
var fs = require('fs');
const { generateOTP } = require("../utils/mail");

// const Actorstorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log("first",file)
//     if(file.fieldname==='profilePic') return cb(null, `public/images/actor/profilePic/`)
//     if(file.fieldname==='images') return cb(null, `public/images/actor/images/`)

//     return cb(null, `/public/images/`)
//   },
//   filename: function (req, file, cb) {
//     let ext = path.extname(file.originalname)
//     cb(null, shortid.generate() + '-' + file.originalname)
//   }
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.fieldname==='moviePoster') return cb(null, `public/images/movies/poster/`)
    if(file.fieldname==='movieImages') return cb(null, `public/images/movies/images/`)
    if(file.fieldname==='userProfilePic') return cb(null, `public/images/user/profilePic/`)
    if(file.fieldname==='actorProfilePic') return cb(null, `public/images/actor/profilePic/`)
    if(file.fieldname==='actorImages') return cb(null, `public/images/actor/images/`)
    if(file.fieldname==='platformPic') return cb(null, `public/images/ott/`)
    return cb(null, `public/images/`)
  },
  filename: function (req, file, cb) {
    if(file.fieldname==='userProfilePic') {
      let ext = path.extname(file.originalname)
      return cb(null, shortid.generate() + '-' + Date.now())
    } 
    let ext = path.extname(file.originalname)
    //cb(null, shortid.generate() + '-' + file.originalname )
    let num = generateOTP(4);
    // Use name from req.body and append the file extension
    if (req.body.name) {
      cb(null, `${req.body.name}-${num}${ext}`);
    } else if(req.body.actorname){
      cb(null, `${req.body.actorname}-${num}${ext}`);
    }else{
      // Fallback if 'name' is not provided in body
      cb(null, `${shortid.generate()}-${Date.now()}${ext}`);
    }
  }
});


const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    cb("Supported only image files!", false);
  }
  cb(null, true);
};

const videoFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("video")) {
    cb("Supported only image files!", false);
  }
  cb(null, true);
};

exports.uploadImage = multer({ storage, fileFilter: imageFileFilter });

// exports.uploadActorImage = multer({ Actorstorage, fileFilter: imageFileFilter });

// exports.userImage = multer({ storage, fileFilter: imageFileFilter });

exports.uploadVideo = multer({ storage, fileFilter: videoFileFilter });

