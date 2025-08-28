const mongoose = require("mongoose");

const TimepassSchema = mongoose.Schema(
  {
    dish: { type: String },
    price: { type: Number },
    img: { type: String },
    rating: { type: Number },
  },
  { versionKey: false }
);

const TimepassModel = mongoose.model("Timepass", TimepassSchema);

module.exports = {
  TimepassModel,
};
