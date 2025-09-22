const express = require("express");
const timepassRouter = express.Router();
const { TimepassModel } = require("../model/timepassModel");

timepassRouter.get("/", async (req, res) => {
  try {
    const allTimepassDish = await TimepassModel.find();
    res.send(allTimepassDish);
  } catch (e) {
    res.send({ error: e.message });
  }
});

timepassRouter.get("/:foodId", async (req, res) => {
  const { foodId } = req.params;
  try {
    const timepassDish = await TimepassModel.findOne({ _id: foodId });
    res.send(timepassDish);
  } catch (e) {
    res.send({ error: e.message });
  }
});

timepassRouter.post("/add", async (req, res) => {
  const body = req.body;
  try {
    const dish = new TimepassModel(body);
    await dish.save();
    res.send({ respose: "dish added sucessfully" });
  } catch (e) {
    res.send({ error: e.message });
  }
});

timepassRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await TimepassModel.findByIdAndDelete(id);
    res.send({ message: "Item Deleted" });
  } catch (e) {
    res.send({ error: e.message });
  }
});

timepassRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const dish = req.body.dish;
  const price = req.body.price;
  const img = req.body.img;
  const quantity = req.body.quantity;
  const user = req.body.user;
  try {
    await TimepassModel.findByIdAndUpdate(id, {
      dish,
      price,
      img,
      quantity,
      user,
    });
    res.send({ message: "Item Updated" });
  } catch (e) {
    res.send({ error: e.message });
  }
});

timepassRouter.get("/filter/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const filteredItem = await TimepassModel.find({
      dish: { $regex: name, $options: "i" },
    });
    res.send(filteredItem);
  } catch (e) {
    res.send({ error: e.message });
  }
});

// Add/Remove to wishlist for a specific user
timepassRouter.patch("/wishlist/:id", async (req, res) => {
  const { id } = req.params; // dish id
  const { user } = req.body; // user id (from frontend or token)

  try {
    const dish = await TimepassModel.findById(id);
    if (!dish) return res.status(404).send({ error: "Dish not found" });

    // Prevent duplicate entries
    if (!dish.user.includes(user)) {
      dish.user.push(user);
      await dish.save();
    } else {
      dish.user = dish.user.filter((u) => u !== user);
      await dish.save();
      return res.send({ message: "Removed from wishlist", dish });
    }

    res.send({ message: "Added to wishlist", dish });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = { timepassRouter };
