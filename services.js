const shortUrls = [];

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

filterResults = (type, data) => {
  const result = shortUrls.filter((el) => el[type] === data)[0];
  return result ? result : false;
};

module.exports = { validateUrl, filterResults, shortUrls };
