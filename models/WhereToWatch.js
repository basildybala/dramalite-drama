const mongoose = require("mongoose");

const masterSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique:true
  },
  image: {
    type: String,
    required: true, // Restrict values to 'tag' or 'genre'
  }
},{timestamps: true });

module.exports = mongoose.model("WhereToWatch", masterSchema);