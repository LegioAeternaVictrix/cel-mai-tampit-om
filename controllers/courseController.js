const Course = require("./../models/courseModel");
const factory = require("./handlerFactory");

exports.setId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.teacher) req.body.teacher = req.user.id;
  next();
};

exports.getAllCourses = factory.getAll(Course);
exports.getCourse = factory.getOne(Course, { path: "reviews" });
exports.createCourse = factory.createOne(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);
