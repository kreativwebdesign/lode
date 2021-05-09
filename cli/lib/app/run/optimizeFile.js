import * as print from "../../helper/print.js";
import { performLOD } from "../../lod.js";
import {
  copyFolder,
  getLastModified,
  createFile,
  getFolderPath,
  getLodHashFile,
  fileExists,
  readFile,
} from "../../helper/files.js";
import generateHash from "./generateHash.js";

const optimizeFile = async ({ originalFile, levelDefinitions }) => {
  const copiedOriginalFile = levelDefinitions[0].pathName;
  const originalModified = () =>
    getLastModified(copiedOriginalFile) < getLastModified(originalFile);

  if (!fileExists(copiedOriginalFile) || originalModified()) {
    const srcDir = getFolderPath(originalFile);
    const destDir = getFolderPath(copiedOriginalFile);
    copyFolder(srcDir, destDir);
  }
  const levelsToBeReGenerated = levelDefinitions
    .slice(1)
    .filter((levelDefinition) => {
      const hashFilePath = getLodHashFile(levelDefinition.pathName);
      const newHash = generateHash(originalFile, levelDefinition.configuration);
      return !(fileExists(hashFilePath) && readFile(hashFilePath) === newHash);
    });
  if (levelsToBeReGenerated.length > 0) {
    await performLOD({ originalFile, levelDefinitions: levelsToBeReGenerated });
    levelsToBeReGenerated.forEach((levelDefinition) => {
      const hashFilePath = getLodHashFile(levelDefinition.pathName);
      const newHash = generateHash(originalFile, levelDefinition.configuration);
      createFile(hashFilePath, newHash);
    });
    print.success("done");
  }
};

export default optimizeFile;
