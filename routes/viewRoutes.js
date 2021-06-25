const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.getOverview);

router.get(
  "/course/:slug",
  authController.isLoggedIn,
  viewsController.getCourse
);

router.get("/signup", viewsController.getSignupForm);
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);

router.get("/settings", authController.protect, viewsController.getSettings);

router.get(
  "/my-learnings",
  authController.protect,
  viewsController.getMyLearnings
);

module.exports = router;
