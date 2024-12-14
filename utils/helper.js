const crypto = require('crypto')
// const cloudinary = require("../cloud");
// const Movie=require('../models/Movie')
exports.sendError = (res, error, statusCode = 401) => (
    res.status(statusCode).json({ error })
)

exports.generateRandomByte = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(30, (err, buff) => {
            if (err) reject(err);
            const buffString = buff.toString("hex");

            resolve(buffString);
        });
    });
};

exports.handleNotFound = (req, res) => {
    this.sendError(res, "Not found", 404);
};
exports.uploadImageToCloud = async (file) => {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file,
      { gravity: "face", height: 500, width: 500, crop: "thumb" }
    );
  
    return { url, public_id };
  };

  exports.formatActor = (actor) => {
    const { name, gender, about, _id, avatar } = actor;
    return {
      id: _id,
      name,
      about,
      gender,
      avatar: avatar?.url,
    }
  }
  exports.parseData = (req, res, next) => {
    const { trailer, cast, genres, tags, writers } = req.body;
    
    if (trailer) req.body.trailer = JSON.parse(trailer);
  
    if (cast) req.body.cast = JSON.parse(cast);
    
    if (genres) req.body.genres = JSON.parse(genres);
    if (tags) req.body.tags = JSON.parse(tags);
    

    if (writers) req.body.writers = JSON.parse(writers);
  
    next();
  };
exports.ott=[
  {
    name:'Netflix',
    img:'/public/images/ott/netflix.ico'
  },
  {
    name:'Hotstar',
    img:'/public/images/ott/hotstar.png'
  },
  {
    name:'ALT Balaji',
    img:'/public/images/ott/altbalaji.png'
  },
  {
    name:'Jio Cinema',
    img:'/public/images/ott/jiocinema.png'
  },
  {
    name:'MX Player',
    img:'/public/images/ott/mxplayer.png'
  },
  {
    name:'Prime Video',
    img:'/public/images/ott/primevideo.png'
  },
  {
    name:'Sony Liv',
    img:'/public/images/ott/sonyliv.png'
  },
  {
    name:'Voot',
    img:'/public/images/ott/voot.png'
  }
]