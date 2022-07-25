const mongoose = require("mongoose");

// define the schema
const reviewSchema = new mongoose.Schema({
  review_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
  },
  island_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Island",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userReview: {
    type: String,
  },
  rating: {
    type: Number,
  },
});

//make the model and export it
module.exports = mongoose.model("Review", reviewSchema);
