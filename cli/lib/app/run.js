import glob from "glob";
import fs from "fs";
import figlet from "figlet";
import * as print from "../print.js";
import { performLOD, copyOriginalArtifact } from "../lod.js";
import { mergeOptionsWithConfigFile } from "../config.js";
import {
  createBaseFolderPathForFile,
  getFilename,
  getFolderPath,
  getFilenameWithoutExtension,
  rmDir,
  getLastModified,
  fileExists,
} from "../files.js";

const defaultRunOptions = {
  source: "**/*.gltf",
  config: "./lode-cli.config.json",
  outputFoldername: "lode-build",
  clearOutputBeforeRun: true,
};

const optimizeFile = (fileStructure, opts) => {
  copyOriginalArtifact(fileStructure.pathNames[0], fileStructure.file);
  fileStructure.pathNames.slice(1).forEach((pathName) => {
    const originalModified = () =>
      getLastModified(pathName) < getLastModified(fileStructure.file);
    if (
      opts.clearOutputBeforeRun ||
      !fileExists(pathName) ||
      originalModified()
    ) {
      performLOD(pathName, fileStructure.file);
    }
  });
};

const prepareFolders = (outputFoldername, sourceFiles, levelCount) => {
  return sourceFiles.reduce((agg, file) => {
    const filename = getFilename(file);
    const filenameWithoutExtension = getFilenameWithoutExtension(filename);
    const folderPath = getFolderPath(file);

    const pathNames = [];
    for (let i = 0; i < levelCount; i++) {
      const pathName = `./${outputFoldername}/${folderPath}/${filenameWithoutExtension}-lod-${i}/${filename}`;
      createBaseFolderPathForFile(pathName);
      pathNames.push(pathName);
    }

    return { ...agg, [file]: { file, pathNames } };
  }, {});
};

const run = (commanderOptions) => {
  print.warn(figlet.textSync("LODE", { horizontalLayout: "full" }));
  const opts = mergeOptionsWithConfigFile(commanderOptions, defaultRunOptions);
  const sourceFiles = glob.sync(opts.source);
  const levelCount = 2;

  if (opts.clearOutputBeforeRun) {
    print.info("Clearing output folder:");
    rmDir(opts.outputFoldername);
    print.success("done");
  }

  if (sourceFiles.length === 0) {
    print.error("No files found matching", opts.source);
    print.error("Aborting");
    return;
  }
  print.info("Preparing output folder:");
  const fileStructure = prepareFolders(
    opts.outputFoldername,
    sourceFiles,
    levelCount
  );
  print.success("done");

  print.info("Running initial LOD transformation:");
  sourceFiles.forEach((file) => optimizeFile(fileStructure[file], opts));
  print.success("done");

  if (opts.watch) {
    print.info("watching files...");
    sourceFiles.forEach((file) => {
      fs.watch(file, () => {
        optimizeFile(fileStructure[file], opts);
      });
    });
  }
};

export default run;
