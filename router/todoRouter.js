const express = require("express");
const todoRouter = express.Router();
const { TodoModel } = require("../model/todoModel");

todoRouter.get("/", async (req, res) => {
  try {
    const allTodoes = await TodoModel.find();
    res.send(allTodoes);
  } catch (e) {
    res.send(e.message);
  }
});

todoRouter.post("/add", async (req, res) => {
  const body = req.body;
  try {
    const task = new TodoModel(body);
    await task.save();
    res.send("task added sucessfully");
  } catch (e) {
    res.send(e.message);
  }
});

todoRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await TodoModel.deleteOne({id});
    res.send({ message: "Item Deleted" });
  } catch (e) {
    res.send(e.message);
  }
});
module.exports = { todoRouter };
