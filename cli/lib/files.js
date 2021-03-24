const fs = require("fs");
const path = require("path");

const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

const createFolderPath = (dirname) => {
  fs.mkdirSync(dirname, { recursive: true }, (err) => {
    if (err) throw err;
  });
};

const createFile = (filePath, content) => {
  const dirname = path.dirname(filePath);
  if (!fileExists(dirname)) {
    createFolderPath(dirname);
  }
  fs.writeFileSync(filePath, content);
};

module.exports = {
  fileExists,
  createFile,
};
