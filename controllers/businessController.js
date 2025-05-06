const express = require("express");
const router = express.Router();
const Business = require("../models/business");

// POST /api/business
// router.post("/", async (req, res) => {

exports.createBusiness = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      whatsapp,
      facebook,
      twitter,
      website,
      about,
      coverImage,
      sampleImages,
    } = req.body;

    // Optional: Basic validation
    if (
      !name ||
      !address ||
      !phone ||
      !coverImage ||
      sampleImages?.length < 1
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newBusiness = new Business({
      name,
      address,
      phone,
      whatsapp,
      facebook,
      twitter,
      website,
      about,
      coverImage,
      sampleImages,
    });

    await newBusiness.save();

    res
      .status(201)
      .json({
        message: "Business added successfully",
        business: newBusiness,
        success: true,
      });
  } catch (err) {
    console.error("Error saving business:", err);
    res.status(500).json({ error: "Server error" });
  }
};

