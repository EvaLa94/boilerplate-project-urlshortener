const mongoose = require("mongoose");

const shortUrlSchema = {
  original_url: String,
  short_url: String,
};

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);

module.exports = { ShortUrl };
