const mongoose = require("mongoose");

const TrackerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  incomes: [{ amount: Number, description: String, date: Date }],
  utilities: [{ amount: Number, description: String, date: Date }],
  fixedCosts: [{ amount: Number, description: String, date: Date }],
  installments: [{ amount: Number, description: String, date: Date }],
});

module.exports = mongoose.model("Tracker", TrackerSchema);
