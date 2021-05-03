import {
  createBaseFolderPathForFile,
  getFilename,
  getFolderPath,
  getModelConfigFile,
} from "../../helper/files.js";
import readConfigFile from "./readConfigFile.js";

const prepareFolders = (outputFoldername, sourceFiles) => {
  return sourceFiles.reduce((agg, originalFile) => {
    const filename = getFilename(originalFile);
    const folderPath = getFolderPath(originalFile);
    const modelConfig = readConfigFile(getModelConfigFile(originalFile));

    const levelDefinitions = [];
    for (let i = 0; i < modelConfig.levels.length; i++) {
      const pathName = `./${outputFoldername}/${folderPath}/lod-${i}/${filename}`;
      createBaseFolderPathForFile(pathName);
      levelDefinitions.push({
        pathName,
        configuration: modelConfig.levels[i].configuration,
      });
    }

    return { ...agg, [originalFile]: { originalFile, levelDefinitions } };
  }, {});
};

export default prepareFolders;
