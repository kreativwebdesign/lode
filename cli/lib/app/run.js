import glob from "glob";
import fs from "fs";
import chokidar from "chokidar";
import figlet from "figlet";
import * as print from "../helper/print.js";
import { performLOD, copyOriginalArtifact } from "../lod.js";
import { mergeOptionsWithConfigFile } from "../helper/config.js";
import { MAIN_CONFIG_FILENAME } from "../constants.js";
import {
  createBaseFolderPathForFile,
  getFilename,
  getFolderPath,
  getFilenameWithoutExtension,
  getLastModified,
  createFile,
  getModelConfigFile,
  getLodHashFile,
  fileExists,
} from "../helper/files.js";

const readConfigFile = (file) => {
  const configFile = fs.readFileSync(file, "utf-8");
  const parsedJson = JSON.parse(configFile);
  return parsedJson;
};

const defaultRunOptions = {
  source: "**/*.gltf",
  config: "./lode-cli.config.json",
  levelCount: 2,
  outputFoldername: "lode-build",
  clearOutputBeforeRun: true,
};

const generateHash = (originalFile, configuration) =>
  getLastModified(originalFile) + JSON.stringify(configuration);

const optimizeFile = ({ originalFile, levelDefinitions }) => {
  const copiedOriginalFile = levelDefinitions[0].pathName;
  const originalModified = () =>
    getLastModified(copiedOriginalFile) < getLastModified(originalFile);

  if (!fileExists(copiedOriginalFile) || originalModified()) {
    copyOriginalArtifact(copiedOriginalFile, originalFile);
  }
  levelDefinitions.slice(1).forEach((levelDefinition) => {
    const hashFilePath = getLodHashFile(levelDefinition.pathName);
    const newHash = generateHash(originalFile, levelDefinition.configuration);

    if (
      fileExists(hashFilePath) &&
      fs.readFileSync(hashFilePath, "utf8") === newHash
    ) {
      return;
    }

    performLOD({ originalFile, levelDefinition });
    createFile(hashFilePath, newHash);
    print.success("done");
  });
};

const prepareFolders = (outputFoldername, sourceFiles) => {
  return sourceFiles.reduce((agg, originalFile) => {
    const filename = getFilename(originalFile);
    const filenameWithoutExtension = getFilenameWithoutExtension(filename);
    const folderPath = getFolderPath(originalFile);
    const modelConfig = readConfigFile(getModelConfigFile(originalFile));

    const levelDefinitions = [];
    for (let i = 0; i < modelConfig.levels.length; i++) {
      const pathName = `./${outputFoldername}/${folderPath}/${filenameWithoutExtension}-lod-${i}/${filename}`;
      createBaseFolderPathForFile(pathName);
      levelDefinitions.push({
        pathName,
        configuration: modelConfig.levels[i].configuration,
      });
    }

    return { ...agg, [originalFile]: { originalFile, levelDefinitions } };
  }, {});
};

const buildMainConfigFile = (outputFoldername, sourceFiles) => {
  const mainConfig = sourceFiles.reduce((agg, sourceFile) => {
    const modelConfig = readConfigFile(getModelConfigFile(sourceFile));

    return {
      ...agg,
      [outputFoldername + "/" + sourceFile]: modelConfig,
    };
  }, {});
  createFile(
    outputFoldername + "/" + MAIN_CONFIG_FILENAME,
    JSON.stringify(mainConfig, null, 2)
  );
};

const run = (commanderOptions) => {
  print.warn(figlet.textSync("LODE", { horizontalLayout: "full" }));
  const opts = mergeOptionsWithConfigFile(commanderOptions, defaultRunOptions);
  const sourceFiles = glob.sync(opts.source);

  if (sourceFiles.length === 0) {
    print.error("No files found matching", opts.source);
    print.error("Aborting");
    return;
  }
  print.info("Preparing output folder:");
  const fileStructure = prepareFolders(opts.outputFoldername, sourceFiles);
  print.success("done");

  print.info("Running initial LOD transformation:");
  sourceFiles.forEach((file) => optimizeFile(fileStructure[file]));

  buildMainConfigFile(opts.outputFoldername, sourceFiles);

  if (opts.watch) {
    print.info("watching files...");

    chokidar
      .watch(opts.source)
      .on("add", (file) => optimizeFile(fileStructure[file]))
      .on("change", (file) => optimizeFile(fileStructure[file]));
    sourceFiles.forEach((srcFile) => {
      const modelConfigFile = getModelConfigFile(srcFile);
      chokidar
        .watch(modelConfigFile, { awaitWriteFinish: true })
        .on("change", () => {
          const fileStructure = prepareFolders(opts.outputFoldername, [
            srcFile,
          ]);
          optimizeFile(fileStructure[srcFile]);

          buildMainConfigFile(opts.outputFoldername, sourceFiles);
        });
    });
  }
};

export default run;
