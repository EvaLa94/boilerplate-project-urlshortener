const { ShortUrl } = require("./schema");

validateUrl = (urlString) => {
  try {
    const validateUrl = new URL(urlString);
    if (validateUrl.protocol === "https:" || validateUrl.protocol === "http:") {
      return validateUrl;
    } else {
      throw err;
    }
  } catch {
    return false;
  }
};

createNewRecord = async (url) => {
  let count = await ShortUrl.count();

  const newShortUrl = new ShortUrl({
    original_url: url.href,
    short_url: ++count,
  });

  newShortUrl.save();

  return newShortUrl;
};

module.exports = { validateUrl, createNewRecord };
