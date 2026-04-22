const Item = require("../models/Item");
const User = require("../models/User");


// 📊 GET STATS
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.householdId) {
      return res.status(400).json({ message: "No household found" });
    }

    const items = await Item.find({ householdId: user.householdId });

    let counts = {
      fresh: 0,
      "expiring-soon": 0,
      expired: 0,
      used: 0,
      wasted: 0
    };

    items.forEach(item => {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });

    const total = items.length;
    const used = counts.used;

    const wasteScore = total > 0 ? (used / total) * 100 : 0;

    res.json({
      totalItems: total,
      counts,
      wasteScore: wasteScore.toFixed(2)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ⏰ GET EXPIRING (24 HOURS)
exports.getExpiring = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.householdId) {
      return res.status(400).json({ message: "No household found" });
    }

    const now = new Date();
    const next24h = new Date();
    next24h.setHours(now.getHours() + 24);

    const items = await Item.find({
      householdId: user.householdId,
      expiryDate: { $gte: now, $lte: next24h },
      status: { $nin: ["used", "wasted"] }
    }).sort({ expiryDate: 1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};