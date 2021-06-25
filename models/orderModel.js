const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: [true, "COURSE REQUIRED"]
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "USER REQUIRED"]
  },

  price: {
    type: Number,
    require: [true, "PRICE REQUIRED"]
  },

  createdAt: {
    type: Date,
    default: Date.now()
  },

  paid: {
    type: Boolean,
    default: true
  }
});

orderSchema.pre(/^find/, function(next) {
  this.populate("user").populate({
    path: "course",
    select: "name"
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
