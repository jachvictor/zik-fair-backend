const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const EmailToken = require("../models/emailVerificationToken");
const User = require("../models/user");
const nodemailer = require("nodemailer");

const sendEmail = require("../utils/sendEmail"); // You'll create this
const dayjs = require("dayjs");

// POST /register
//
//
//

exports.register = async (req, res) => {
  const { name, email, password, location, address } = req.body;

  try {
    // Check for missing fields
    if (!name || !email || !password || !location || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate token
    const token = crypto.randomBytes(3).toString("hex");
    const expiresAt = dayjs().add(1, "day").toDate();

    // Check if a token already exists for the email
    const existingToken = await EmailToken.findOne({ email });

    if (existingToken) {
      // Update the existing token
      existingToken.token = token;
      existingToken.expiresAt = expiresAt;
      existingToken.name = name;
      existingToken.password = hashedPassword;
      existingToken.location = location;
      existingToken.address = address;
      await existingToken.save();
    } else {
      // Create a new token record
      await EmailToken.create({
        name,
        email,
        password: hashedPassword,
        location,
        address,
        token,
        expiresAt,
      });
    }

    // Send token via email
    await sendEmail(email, token);

    res.status(200).json({ message: "Verification token sent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// POST /verify
exports.verifyEmail = async (req, res) => {
  // router.post("/verify", async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already Exist" });
    }
    const record = await EmailToken.findOne({ email, token });

    if (!record) {
      return res
        .status(400)
        .json({ message: "Invalid Email or expired token." });
    }

    if (new Date() > record.expiresAt) {
      await EmailToken.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "Token expired." });
    }

    // Create the actual user
    await User.create({
      name: record.name,
      email: record.email,
      password: record.password,
      location: record.location,
      address: record.address,
      login: true,
    });

    // Delete the token record
    await EmailToken.deleteOne({ _id: record._id });

    res.status(201).json({
      message: "Email verified and account created.",
      success: true,
      user: record,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(usernameOrEmail);
    // Find user by email or username
    // const user = await User.findOne({ email });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // If user not found or password does not match
    else if (!(await bcrypt.compare(password, user.password))) {
      console.log(await bcrypt.compare(password, user.password));
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      // Successful login, send token and user details to the client
      user.login = true;
      await user.save();

      res.status(200).json({
        message: "Login successful",
        user: user,
      });
    }

    // Check if user is verified

    // Generate JWT token
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
exports.logout = async (req, res) => {
  try {
    const { email, id } = req.body;
    // console.log(usernameOrEmail);
    // Find user by email or username
    // const user = await User.findOne({ email });
    const user = await User.findOne({ email, _id: id });
    if (!user) {
      return res.status(400).json({ message: "Error during log out" });
    }
    // If user not found or password does not match
    else {
      // Successful login, send token and user details to the client
      user.login = false;
      await user.save();

      res.status(200).json({
        message: "Logged out successful",
      });
    }

    // Check if user is verified

    // Generate JWT token
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exists" });
    }

    // Hash password

    // Generate token
    const token = crypto.randomBytes(3).toString("hex");
    const expiresAt = dayjs().add(1, "day").toDate();

    // Check if a token already exists for the email
    const existingToken = await EmailToken.findOne({ email });

    if (existingToken) {
      // Update the existing token
      existingToken.resetToken = token;
      existingToken.resetExpiresAt = expiresAt;
      await existingToken.save();
    } else {
      // Create a new token record
      await EmailToken.create({
        email,
        resetToken: token,
        resetExpiresAt: expiresAt,
      });
    }

    // Send token via email
    await sendEmail(email, token);

    res
      .status(200)
      .json({ message: "Password reset token sent to email.", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password, email } = req.body;

  // Hash the new password

  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(password, salt);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const record = await EmailToken.findOne({ email, resetToken: token });

    if (!record) {
      return res
        .status(400)
        .json({ message: "Invalid Email or expired token." });
    }

    if (new Date() > record.resetExpiresAt) {
      await EmailToken.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "Token expired." });
    }

    // Create the actual user
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete the token record
    await EmailToken.deleteOne({ _id: record._id });

    res.status(201).json({
      message: "password reset successful",
      success: true,
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.registerVendor = async (req, res) => {
  const { email, vendorEmail } = req.body;

  try {
    if (!email || !vendorEmail) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const requestingUser = await User.findOne({ email });
    if (!requestingUser) {
      return res.status(400).json({ message: "User not found." });
    }

    const existingVendor = await User.findOne({ vendorEmail });
    if (existingVendor && existingVendor.vendor === true) {
      return res.status(400).json({ message: "Vendor already exists." });
    }

    const token = crypto.randomBytes(3).toString("hex");
    const vendorExpiresAt = dayjs().add(1, "day").toDate();

    let existingToken = await EmailToken.findOne({ email });
    if (existingToken) {
      existingToken.vendorEmail=vendorEmail
      existingToken.vendorToken = token;
      existingToken.vendorExpiresAt = vendorExpiresAt;
      await existingToken.save();
    } else {
      await EmailToken.create({
        email,
        vendorEmail,
        vendorToken: token,
        vendorExpiresAt,
      });
    }

    await sendEmail(vendorEmail, token);

    res
      .status(200)
      .json({ message: "Vendor verification token sent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// POST /verify
exports.verifyVendor = async (req, res) => {
  const { vendorEmail, token } = req.body;

  try {
    const record = await EmailToken.findOne({
      vendorEmail,
      vendorToken: token,
    });

    if (!record) {
      return res
        .status(400)
        .json({ message: "Invalid email." });
    }

    if (new Date() > record.vendorExpiresAt) {
      await EmailToken.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "Token expired." });
    }

    const user = await User.findOne({ email: record.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.vendor = true; // Make the user a vendor
    user.vendorEmail = vendorEmail;
    await user.save();

    await EmailToken.deleteOne({ _id: record._id });

    res.status(201).json({
      message: "Vendor verified successfully!",
      success: true,
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteAccount = async (req, res) => {
  const { userId } = req.body;
  console.log("id", userId);
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting account details", error });
  }
};
