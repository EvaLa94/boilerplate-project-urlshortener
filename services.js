const shortUrls = [];

validateUrl = (urlString) => {
  try {
    return new URL(urlString);
  } catch {
    return false;
  }
};

filterResults = (type, data) => {
  const result = shortUrls.filter((el) => el[type] === data)[0];
  return result ? result : false;
};

module.exports = { validateUrl, filterResults, shortUrls };
