import { getLastModified } from "../../helper/files.js";

const generateHash = (originalFile, configuration) =>
  getLastModified(originalFile) + JSON.stringify(configuration);

export default generateHash;
