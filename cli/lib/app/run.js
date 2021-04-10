import glob from "glob";
import fs from "fs";
import figlet from "figlet";
import * as print from "../print.js";
import { performLOD } from "../lod.js";
import { mergeOptionsWithConfigFile } from "../config.js";

const defaultRunOptions = {
  source: "**/*.gltf",
  config: "./lode-cli.config.json",
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

  print.info("Running initial LOD transformation:");
  sourceFiles.forEach(performLOD);

  if (opts.watch) {
    print.info("watching files...");
    sourceFiles.forEach((file) => fs.watch(file, () => performLOD(file)));
  }
};

export default run;
