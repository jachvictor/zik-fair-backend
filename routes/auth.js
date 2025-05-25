const express = require("express");
// const { check, validationResult } = require("express-validator");
const {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  logout,
  registerVendor,
  verifyVendor,
  updateAcount
} = require("../controllers/authController");
// const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-account",updateAcount)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/register-vendor", registerVendor);
router.post("/verify-vendor", verifyVendor);

module.exports = router;
