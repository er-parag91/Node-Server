// it takes in CSV string and removes any empty strings if there is any
exports.productConfig = (configString) => {
  if (configString) {
    return configString.split(',').filter(item => {
      if (item.trim()) {
        return true;
      }
      return false
    }).map(item => item.trim()).join(',');
  }
  return configString;
};