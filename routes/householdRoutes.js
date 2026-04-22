const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createHousehold,
  joinHousehold,
  getMyHousehold,
  getMembers,
    leaveHousehold 
} = require("../controllers/householdController");

router.post("/", authMiddleware, createHousehold);
router.post("/join", authMiddleware, joinHousehold);
router.get("/me", authMiddleware, getMyHousehold);
router.get("/:id/members", authMiddleware, getMembers);
router.post("/leave", authMiddleware, leaveHousehold);

module.exports = router;