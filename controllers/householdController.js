const Household = require("../models/Household");
const User = require("../models/User");
const generateInviteCode = require("../utils/generateInviteCode");


// 🏠 CREATE HOUSEHOLD
exports.createHousehold = async (req, res) => {
  try {
    const { name } = req.body;

    const inviteCode = generateInviteCode();

    const household = await Household.create({
      name,
      inviteCode,
      members: [req.user._id]
    });

    // link user → household
    await User.findByIdAndUpdate(req.user._id, {
      householdId: household._id
    });

    res.status(201).json(household);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔗 JOIN HOUSEHOLD
exports.joinHousehold = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const household = await Household.findOne({ inviteCode });

    if (!household) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    // add user
    household.members.push(req.user._id);
    await household.save();

    await User.findByIdAndUpdate(req.user._id, {
      householdId: household._id
    });

    res.json(household);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 👤 GET MY HOUSEHOLD
exports.getMyHousehold = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.householdId) {
      return res.status(404).json({ message: "No household found" });
    }

    const household = await Household.findById(user.householdId)
      .populate("members", "name email");

    res.json(household);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 👥 GET MEMBERS
exports.getMembers = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id)
      .populate("members", "name email");

    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    res.json(household.members);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚪 LEAVE HOUSEHOLD
exports.leaveHousehold = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user.householdId) {
      return res.status(400).json({ message: "User not in any household" });
    }

    const household = await Household.findById(user.householdId);

    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    // Remove user from members
    household.members = household.members.filter(
      (member) => member.toString() !== userId.toString()
    );

    // If no members left → delete household
    if (household.members.length === 0) {
      await household.deleteOne();
    } else {
      await household.save();
    }

    // Remove household from user
    user.householdId = null;
    await user.save();

    res.json({ message: "Left household successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};