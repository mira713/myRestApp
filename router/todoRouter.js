const express = require("express");
const todoRouter = express.Router();
const { TodoModel } = require("../model/todoModel");

todoRouter.get("/", async (req, res) => {
  const id = req.user;
  try {
    const allTodoes = await TodoModel.find({ user: id });
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
    res.send({ respose: "task added sucessfully" });
  } catch (e) {
    res.send(e.message);
  }
});

todoRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await TodoModel.findByIdAndDelete(id);
    res.send({ message: "Item Deleted" });
  } catch (e) {
    res.send(e.message);
  }
});

todoRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const task = req.body.task;
  const todoheader = req.body.todoheader;
  try{
    await TodoModel.findByIdAndUpdate(id, { task, todoheader });
    res.send({message:"Item Updated"});
  }catch(e){
    res.send(e.message);
  }
});
module.exports = { todoRouter };
