const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
    {
        movieId: { type: mongoose.Schema.Types.ObjectId,ref:'Movie', required: true },
        rating:[
            {
              userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',},
              ratingValue:{type: Number},
            }
        ],
      },
      { timestamps: true }
);

module.exports=mongoose.model('Rating',RatingSchema)