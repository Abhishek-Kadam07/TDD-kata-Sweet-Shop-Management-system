const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, default: null },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Sweet', sweetSchema);
