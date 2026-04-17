const express = require("express");
const { getAllUsers, getUserById, updateProfile, deleteAccount } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Anyone can get users for chat purposes
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.put("/profile/update", protect, updateProfile);
router.delete("/account/delete", protect, deleteAccount);

module.exports = router;
