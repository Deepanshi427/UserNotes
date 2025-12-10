const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");

// Public routes
router.post("/signup", asyncHandler(authController.signup));
router.post("/login", asyncHandler(authController.login));

// Refresh access token
router.post("/refresh-token", asyncHandler(authController.refreshToken));

// Logout
router.post("/logout", asyncHandler(authController.logout));

module.exports = router;
