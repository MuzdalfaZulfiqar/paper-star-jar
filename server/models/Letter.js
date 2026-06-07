
const mongoose = require('mongoose');

const LetterSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  body:        { type: String, required: true },
  deliverAt:   { type: Date, required: true },
  inkMood:     { type: String, enum: ['sepia', 'midnight', 'crimson', 'forest', 'slate'], default: 'sepia' },
  isAnonymous: { type: Boolean, default: false },
  emailSent:   { type: Boolean, default: false },
  readAt:      { type: Date, default: null },

  // ── Gift ──────────────────────────────────────────────────────────────
  // One of: candle | moonjar | pressedrose | constellation | inkwell | hourglss
  // null means no gift enclosed
  giftType:    { type: String, enum: ['candle','moonjar','pressedrose','constellation','inkwell','hourglss', null], default: null },

  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Letter', LetterSchema);