const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  email: { type: String, required: false },
  vendorEmail: { type: String, required: false },
  name: String,
  password: String, // hashed
  token: { type: String, required: false },
  resetToken: { type: String, required: false },
  vendorToken: { type: String, required: false },
  location: { type: String, required: false },
  address: { type: String, required: false },
  vendor: { type: Boolean, default: false }, // 🛒 Is user a vendor or normal user?
  login: { type: Boolean, default: false },
  // expiresAt: { type: Date, required: false },
  expiresAt: { type: Date, required: false, index: { expires: 0 } },
  resetExpiresAt: { type: Date, required: false, index: { expires: 0 } },
  vendorExpiresAt: { type: Date, required: false, index: { expires: 0 } },
});

module.exports = mongoose.model("EmailToken", TokenSchema);
