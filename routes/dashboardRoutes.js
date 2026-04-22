const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getStats,
  getExpiring
} = require("../controllers/dashboardController");

router.get("/stats", authMiddleware, getStats);
router.get("/expiring", authMiddleware, getExpiring);

module.exports = router;