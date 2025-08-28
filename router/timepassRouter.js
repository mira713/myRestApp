const express = require("express");
const timepassRouter = express.Router();
const { TimepassModel } = require("../model/timepassModel");

timepassRouter.get("/", async (req, res) => {
  try {
    const allTimepassDish = await TimepassModel.find();
    res.send(allTimepassDish);
  } catch (e) {
    res.send(e.message);
  }
});

timepassRouter.post("/add", async (req, res) => {
  const body = req.body;
  try {
    const dish = new TimepassModel(body);
    await dish.save();
    res.send({ respose: "dish added sucessfully" });
  } catch (e) {
    res.send(e.message);
  }
});

timepassRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await TimepassModel.findByIdAndDelete(id);
    res.send({ message: "Item Deleted" });
  } catch (e) {
    res.send(e.message);
  }
});

timepassRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const dish = req.body.dish;
  const price = req.body.price;
  const img = req.body.img;
  try {
    await TimepassModel.findByIdAndUpdate(id, { dish, price, img });
    res.send({ message: "Item Updated" });
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = { timepassRouter };
