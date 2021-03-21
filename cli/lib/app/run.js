const glob = require("glob");
const fs = require("fs");
const figlet = require("figlet");
const print = require("../print");
const { performLOD } = require("../lod");
const { mergeOptionsWithConfigFile } = require("../config");

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
    print.info("somehow watching files...");
    sourceFiles.forEach((file) =>
      fs.watchFile(file, { persistent: true }, () => performLOD(file))
    );
  }
};

module.exports = run;
