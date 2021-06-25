const mongoose = require("mongoose");
const slugify = require("slugify");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },

    slug: String,

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    language: {
      type: String,
      default: "English"
    },

    youWillLearnAbout: {
      type: [String],
      required: true
    },

    imageCover: {
      type: String,
      required: true
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: val => Math.round(val * 10) / 10
    },

    ratingsQuantity: {
      type: Number,
      default: 0
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Course must belong to a teacher"]
    }
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

courseSchema.index({ slug: 1 });

courseSchema.pre(/^find/, function(next) {
  this.populate({
    path: "teacher",
    select: "firstName lastName role photo username"
  });
  next();
});

// Virtual populate // parent reference
courseSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "course",
  localField: "_id"
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
courseSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
