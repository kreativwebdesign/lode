import path from "path";
import { MANIFEST_FILENAME } from "../../constants.js";
import {
  getFolderPath,
  createFile,
  getModelConfigFile,
} from "../../helper/files.js";
import readConfigFile from "./readConfigFile.js";

const buildManifest = (outputFoldername, sourceFiles) => {
  const manifest = sourceFiles.reduce((agg, sourceFile) => {
    const modelConfig = readConfigFile(getModelConfigFile(sourceFile));
    return {
      ...agg,
      [getFolderPath(sourceFile)]: modelConfig,
    };
  }, {});
  return createFile(
    path.join(outputFoldername, MANIFEST_FILENAME),
    JSON.stringify(manifest, null, 2)
  );
};

export default buildManifest;
