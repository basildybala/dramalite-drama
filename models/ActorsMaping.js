const mongoose = require("mongoose");

const ActorsMapingSchema = new mongoose.Schema(
    {
        movieId: { type: mongoose.Schema.Types.ObjectId,ref:'Movie', required: true },
        actors:[
            {
              actorid:{type:mongoose.Schema.Types.ObjectId,ref:'Actor',},
              actordramaname: {type: String,trim: true},
              actorrole: {type: String,trim: true},
              description: {type: String,trim: true},
              position: {type: String,trim: true},
            }
        ],
      },
      { timestamps: true }
);

module.exports=mongoose.model('ActorsMaping',ActorsMapingSchema)