const mongoose = require("mongoose");

const reliableSchema = new mongoose.Schema(
  {},
  { strict: false, versionKey: false }
);

const ReliableModel = mongoose.model(
  "reliableProduct", // Model name
  reliableSchema, // Schema
  "reliableProducts" // Exact collection name in MongoDB
);

module.exports = { ReliableModel };
