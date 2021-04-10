import fs from "fs";
import path from "path";

export const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

const createFolderPath = (dirname) => {
  fs.mkdirSync(dirname, { recursive: true }, (err) => {
    if (err) throw err;
  });
};

export const createFile = (filePath, content) => {
  const dirname = path.dirname(filePath);
  if (!fileExists(dirname)) {
    createFolderPath(dirname);
  }
  fs.writeFileSync(filePath, content);
};
