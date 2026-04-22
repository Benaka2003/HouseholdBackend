const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET PROFILE
router.get("/me", async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("householdId", "name inviteCode");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;