const mongoose = require('mongoose');

const EmailLogSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  to: { type: String, required: true },
  from: { type: String },
  subject: { type: String },
  sendResult: { type: Object },
  error: { type: Object },
  success: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const EmailLogModel = mongoose.model('emaillog', EmailLogSchema);
module.exports = { EmailLogModel };