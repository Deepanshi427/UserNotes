const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");
const {sendOTP,
      verifyOTP
      } = require("../controllers/authController");

// Public routes
router.post("/signup", asyncHandler(authController.signup));
router.post("/login", asyncHandler(authController.login));
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// Refresh access token
router.post("/refresh-token", asyncHandler(authController.refreshToken));

// Logout
router.post("/logout", asyncHandler(authController.logout));

module.exports = router;
