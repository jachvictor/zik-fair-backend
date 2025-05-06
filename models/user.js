const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    vendorEmail: { type: String, required: false, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    vendor: { type: Boolean, default: false }, // 🛒 Is user a vendor or normal user?
    login: { type: Boolean, default: false }, // 🔐 Is user currently logged in? (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
