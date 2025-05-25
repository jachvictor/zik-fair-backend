const express = require("express");
const {
  createBusiness,
  getBusinesses,
  getAllBusinesses,
  getBusiness,
  deleteBusiness,
  deleteBusinesses,
  addComment,
  deleteComment,
} = require("../controllers/businessController");
const router = express.Router();
router.post("/create-business", createBusiness);
router.get("/user/:userId", getBusinesses);
router.get("/get-all-businesses", getAllBusinesses);

router.get("/:businessId", getBusiness);
router.delete("/delete-business/:businessId", deleteBusiness);
router.delete("/delete-businesses/:ownerId", deleteBusinesses);
router.post("/add-comment/:id", addComment);
router.delete("/delete-comment", deleteComment);

module.exports = router;
