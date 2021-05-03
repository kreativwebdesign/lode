import fs from "fs";
import path from "path";
import { CONFIG_FILENAME, HASH_FILENAME } from "../constants.js";

export const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

const createFolderPath = (dirname) => {
  fs.mkdirSync(dirname, { recursive: true });
};

export const getFolderPath = (filePath) => path.dirname(filePath);
export const getFilename = (filePath) => path.basename(filePath);
export const getFilenameWithoutExtension = (filename) =>
  filename.split(".").slice(0, -1).join(".");

export const createBaseFolderPathForFile = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fileExists(dirname)) {
    createFolderPath(dirname);
  }
};

export const createFile = (filePath, content) => {
  createBaseFolderPathForFile(filePath);
  return writeFile(filePath, content);
};

export const writeFile = (filePath, content) => {
  fs.writeFileSync(filePath, content);
  return readFile(filePath);
};

export const rmDir = (path) => {
  fs.rmSync(path, { recursive: true, force: true });
};

export const getLastModified = (file) => fs.statSync(file).mtimeMs;

export const getModelConfigFile = (file) =>
  path.join(getFolderPath(file), CONFIG_FILENAME);

export const getLodHashFile = (file) =>
  path.join(getFolderPath(file), HASH_FILENAME);

export const readFile = (file) => fs.readFileSync(file, "utf8");
