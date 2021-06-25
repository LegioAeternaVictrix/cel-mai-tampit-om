const Course = require("../models/courseModel");
// const User = require("../models/userModel");
const Order = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res, next) => {
  const courses = await Course.find();

  res.status(200).render("overview", {
    title: "All courses",
    courses
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  // Get the data, for the requested course (including reviews and teachers)
  const course = await Course.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user"
  });

  if (!course) {
    return next(new AppError("There is no course with that name.", 404));
  }

  //  Render template using data from 1)
  res.status(200).render("course", {
    title: `${course.name} course`,
    course
  });
});

exports.getSignupForm = (req, res) => {
  res.status(200).render("signup", {
    title: "Create your account"
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account"
  });
};

exports.getSettings = (req, res) => {
  res.status(200).render("settings", {
    title: "Your account settings"
  });
};

exports.getMyLearnings = catchAsync(async (req, res, next) => {
  const learnings = await Order.find({ user: req.user.id });

  const courseIDs = learnings.map(el => el.course);
  const courses = await Course.find({ _id: { $in: courseIDs } });

  res.status(200).render("overview", {
    title: "My Learnings",
    courses
  });
});
