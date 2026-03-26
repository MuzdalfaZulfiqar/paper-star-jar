const mongoose = require('mongoose');

const StarSchema = new mongoose.Schema({
  message: { type: String, required: true },
  color: { type: String, default: '#FFADAD' }, // Default pastel red
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Star', StarSchema);