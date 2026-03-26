const mongoose = require('mongoose');

const LetterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: String,
  deliverAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Letter', LetterSchema);