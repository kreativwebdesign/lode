const glob = require("glob");
const fs = require("fs");
const figlet = require("figlet");
const print = require("./lib/print");
const { performLOD } = require("./lib/lod");
const { getOptions } = require("./lib/config");

const main = () => {
  print.warn(figlet.textSync("LODE", { horizontalLayout: "full" }));

  const appOptions = getOptions();

  const sourceFiles = glob.sync(appOptions.source);

  if (sourceFiles.length === 0) {
    print.error("No files found matching", appOptions.source);
    print.error("Aborting");
    return;
  }

  print.info("Running initial LOD transformation:");
  sourceFiles.forEach(performLOD);

  if (appOptions.watch) {
    print.info("watching files...");
    sourceFiles.forEach((file) =>
      fs.watchFile(file, { persistent: true }, () => performLOD(file))
    );
  }
};

main();
