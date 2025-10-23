const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'other', trim: true },

  // images fields
  imageUrl: { type: String, default: '' },
  imageAlt: { type: String, default: '' },

}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
