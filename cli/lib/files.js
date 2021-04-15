import fs from "fs";
import path from "path";

export const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

const createFolderPath = (dirname) => {
  fs.mkdirSync(dirname, { recursive: true });
};

export const createBaseFolderPathForFile = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fileExists(dirname)) {
    createFolderPath(dirname);
  }
};

export const createFile = (filePath, content) => {
  createBaseFolderPathForFile(filePath);
  fs.writeFileSync(filePath, content);
};
