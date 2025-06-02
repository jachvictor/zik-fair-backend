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
  updateAcount,
  contactUs,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-account", updateAcount);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/register-vendor", registerVendor);
router.post("/verify-vendor", verifyVendor);
router.post("/contact-us", contactUs);

module.exports = router;
