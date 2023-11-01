const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name of product"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Plese Enter a description"],
  },
  price: {
    type: Number,
    required: [true, "please enter amount"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        // required: true,
      },
      imgUrl: {
        type: String,
        // required: true,
      },
    },
  ],
  category: {
    type: String,
    // required: [true, "Please enter category"],
  },
  Stock: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        // required: true,
      },
      name: {
        type: String,
        // required: true,
      },
      comment: {
        type: String,
        // required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
