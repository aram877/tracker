const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Tracker = require("../models/Tracker");
const router = express.Router();

// Create a tracker entry
router.post("/entry", authMiddleware, async (req, res) => {
  const { type, amount, description } = req.body;

  try {
    let tracker = await Tracker.findOne({ user: req.user.id });

    if (!tracker) {
      tracker = new Tracker({
        user: req.user.id,
        incomes: [],
        utilities: [],
        fixedCosts: [],
        installments: [],
      });
    }

    if (type === "income")
      tracker.incomes.push({ amount, description, date: new Date() });
    else if (type === "utility")
      tracker.utilities.push({ amount, description, date: new Date() });
    else if (type === "fixedCost")
      tracker.fixedCosts.push({ amount, description, date: new Date() });
    else if (type === "installment")
      tracker.installments.push({ amount, description, date: new Date() });

    await tracker.save();
    res.json(tracker);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get tracker summary
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const tracker = await Tracker.findOne({ user: req.user.id });
    if (!tracker) return res.status(400).json({ msg: "No tracker found" });

    const totalIncome = tracker.incomes.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    const totalCost =
      tracker.utilities.reduce((sum, entry) => sum + entry.amount, 0) +
      tracker.fixedCosts.reduce((sum, entry) => sum + entry.amount, 0) +
      tracker.installments.reduce((sum, entry) => sum + entry.amount, 0);

    const summary = {
      totalIncome,
      totalCost,
      savings: totalIncome - totalCost,
    };

    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
