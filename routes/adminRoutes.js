const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");
const P = require("../config/permissions");

// Only admin can access this
router.get("/secret", auth, requirePermission(P.ADMIN_OVERRIDE), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin! You accessed a protected admin route."
  });
});

module.exports = router;
