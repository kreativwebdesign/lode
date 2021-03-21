const fs = require("fs");

const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

module.exports = {
  fileExists,
};
