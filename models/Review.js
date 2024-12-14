const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        movieId: { type: mongoose.Schema.Types.ObjectId,ref:'Movie', required: true },
        review:[
            {
              userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',},
              head:{type: String,    minlength: 10, maxlength: 90},
              content:{type: String,   maxlength: 9000},
              storyRating:{type: Number},
              castRating:{type: Number},
              rewatchValueRating:{type: Number},
              overall:{type: Number},
              helpful:[{type: mongoose.Schema.Types.ObjectId,ref:'User'}],
              notHelpful:[{type: mongoose.Schema.Types.ObjectId,ref:'User'}],
            }
        ],
      },
      { timestamps: true }
);

module.exports=mongoose.model('Review',ReviewSchema)