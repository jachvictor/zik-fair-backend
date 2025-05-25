const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sender: String,
    text: String,
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
});

const businessSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    category: String,
    location: String,
    phone: String,
    whatsapp: String,
    facebook: String,
    twitter: String,
    website: String,
    about: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Vendor" if you're using a separate vendor model
    },
    coverImage: imageSchema,
    sampleImages: [imageSchema],
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
