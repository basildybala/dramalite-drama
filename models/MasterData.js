const mongoose = require("mongoose");

const masterSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Tags", "Genre"], // Restrict values to 'tag' or 'genre'
  }
},{timestamps: true });

module.exports = mongoose.model("Master", masterSchema);