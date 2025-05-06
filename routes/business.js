const express = require("express");
const { createBusiness } = require("../controllers/businessController");
const router = express.Router();
router.post("/create-business", createBusiness);

module.exports = router;
