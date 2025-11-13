const express = require("express");
const reliableRouter = express.Router();
const { ReliableModel } = require("../model/reliableModel");

reliableRouter.get("/", async (req, res) => {
  try {
    const data = await ReliableModel.find();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

reliableRouter.get("/:category", async (req, res) => {
  const { category } = req.params;
  try {
    // Use field projection to get only that category
    const data = await ReliableModel.findOne({}, { [category]: 1, _id: 0 });

    if (!data || !data[category]) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(data[category]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = { reliableRouter };
