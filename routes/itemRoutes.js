const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addItem,
  getItems,
  updateItem,
  updateStatus,
  deleteItem
} = require("../controllers/itemController");

router.get("/", authMiddleware, getItems);
router.post("/", authMiddleware, addItem);
router.put("/:id", authMiddleware, updateItem);
router.patch("/:id/status", authMiddleware, updateStatus);
router.delete("/:id", authMiddleware, deleteItem);

module.exports = router;