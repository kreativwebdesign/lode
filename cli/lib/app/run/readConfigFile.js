import { readFile } from "../../helper/files.js";

const readConfigFile = (file) => {
  const configFile = readFile(file);
  const parsedJson = JSON.parse(configFile);
  return parsedJson;
};
export default readConfigFile;
