const express = require("express");
const router = express.Router();
const Business = require("../models/business");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// POST /api/business
// router.post("/", async (req, res) => {

exports.createBusiness = async (req, res) => {
  try {
    const {
      name,
      address,
      location,
      category,
      phone,
      whatsapp,
      facebook,
      twitter,
      website,
      about,
      coverImage,
      sampleImages,
      owner,
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
      category,
      location,
      phone,
      whatsapp,
      facebook,
      twitter,
      website,
      about,
      coverImage,
      sampleImages,
      owner,
    });

    await newBusiness.save();

    res.status(201).json({
      message: "Business added successfully",
      business: newBusiness,
      success: true,
    });
  } catch (err) {
    console.error("Error saving business:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.businessId);

    res.status(200).json({
      message: "Business fetched successfully",
      success: true,
      business,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/businesses/user/:userId
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({
      owner: req.params.userId,
    }).populate("owner", "name email");

    res.status(200).json({
      message: "Businesses fetched successfully",
      success: true,
      businesses,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate("owner", "name email"); // only name & email fields
    res.status(200).json({
      message: "Businesses fetched successfully",
      success: true,
      businesses,
    });
  } catch (err) {
    console.error("Error fetching businesses:", err);
    res.status(500).json({ error: "Server error" });
  }
};
// DELETE /api/businesses/:id
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business)
      return res.status(404).json({ message: "Business not found" });

    // Delete cover image
    if (business.coverImage?.publicId) {
      await cloudinary.uploader.destroy(business.coverImage.publicId);
    }

    // Delete each sample image
    if (Array.isArray(business.sampleImages)) {
      for (const img of business.sampleImages) {
        if (img.publicId) {
          await cloudinary.uploader.destroy(img.publicId);
        }
      }
    }

    // Delete business from DB
    await Business.findByIdAndDelete(req.params.businessId);

    res
      .status(200)
      .json({ message: "Business and images deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// DELETE /api/businesses/owner/:ownerId
exports.deleteBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({ owner: req.params.ownerId });
    if (businesses.length === 0) {
      return res
        .status(404)
        .json({ message: "no businesses found", success: true });
    }

    for (const business of businesses) {
      // Delete cover image
      if (business.coverImage?.publicId) {
        await cloudinary.uploader.destroy(business.coverImage.publicId);
      }

      // Delete sample images
      if (Array.isArray(business.sampleImages)) {
        for (const img of business.sampleImages) {
          if (img.publicId) {
            await cloudinary.uploader.destroy(img.publicId);
          }
        }
      }

      // Delete business
      await Business.findByIdAndDelete(business._id);
    }

    res.status(200).json({
      message: `${businesses.length} businesses and their images deleted successfully.`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// POST /api/business/:id/comment
exports.addComment = async (req, res) => {
  try {
    const { text, rating, userId, sender } = req.body;
    // const userId = req.user._id; // Auth middleware must set this

    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ error: "Business not found" });

    business.comments.push({ user: userId, text, rating, sender });
    await business.save();

    res
      .status(201)
      .json({ message: "Comment added", comments: business.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { businessId, commentId, userId } = req.body;
    // const userId = req.body.userId;

    // You should ideally get this from auth middleware (e.g. req.user._id)

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }

    // Find the comment
    const comment = business.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the current user is the author
    if (comment.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this comment" });
    }

    // Remove the comment
    // comment.remove();
    business.comments.pull({ _id: commentId });

    await business.save();

    res
      .status(200)
      .json({ message: "Comment deleted", comments: business.comments });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      message: "Failed to delete comment",
      error: "Failed to delete comment",
    });
  }
};
