const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
});

const businessSchema = new mongoose.Schema(
  {
    businessEmail: { type: String, required: false },
    name: String,
    address: String,
    phone: String,
    whatsapp: String,
    facebook: String,
    twitter: String,
    website: String,
    about: String,
    coverImage: imageSchema,
    sampleImages: [imageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
