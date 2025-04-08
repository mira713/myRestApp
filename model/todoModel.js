const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema(
  {
    task: { type: String },
    user: { type: String },
    todoheader: { type: String },
  },
  { versionKey: false }
);

const TodoModel = mongoose.model("Todo", TodoSchema);

module.exports = {
  TodoModel,
};
