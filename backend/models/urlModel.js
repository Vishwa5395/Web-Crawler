const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  baseURL: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  totalHits: Number,
  totalLinks: Number,
  links: [
    {
      url: String,
      hits: Number,
      status: Number
    }
  ]
});

module.exports = mongoose.model('Url', urlSchema);

