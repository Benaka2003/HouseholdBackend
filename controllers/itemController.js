const Item = require("../models/Item");
const User = require("../models/User");
const calculateStatus = require("../utils/calculateStatus");


// ➕ ADD ITEM
exports.addItem = async (req, res) => {
  try {
    const { name, category, quantity, expiryDate } = req.body;

    if (!name || !expiryDate) {
      return res.status(400).json({ message: "Name and expiry date are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user || !user.householdId) {
      return res.status(400).json({ message: "Join a household first" });
    }

    const status = calculateStatus(expiryDate);

    const item = await Item.create({
      name,
      category,
      quantity,
      expiryDate,
      status,
      householdId: user.householdId,
      addedBy: req.user._id
    });

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📋 GET ITEMS (with filters)
exports.getItems = async (req, res) => {
  try {
    const { status, category } = req.query;

    const user = await User.findById(req.user._id);

    if (!user || !user.householdId) {
      return res.status(400).json({ message: "No household found" });
    }

    let filter = { householdId: user.householdId };

    if (status) filter.status = status;
    if (category) filter.category = category;

    const items = await Item.find(filter)
      .sort({ expiryDate: 1 })
      .populate("addedBy", "name email");

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✏️ UPDATE ITEM
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔐 Only creator can edit
    if (item.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, category, quantity, expiryDate } = req.body;

    if (name) item.name = name;
    if (category) item.category = category;
    if (quantity !== undefined) item.quantity = quantity;

    if (expiryDate) {
      item.expiryDate = expiryDate;
      item.status = calculateStatus(expiryDate);
    }

    await item.save();

    res.json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🟢 MARK USED / WASTED
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["used", "wasted"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = status;

    await item.save();

    res.json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🗑️ DELETE ITEM
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔐 Only creator can delete
    if (item.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await item.deleteOne();

    res.json({ message: "Item deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};