const chalk = require("chalk");
const glob = require("glob");
const fs = require("fs");
const figlet = require("figlet");
const { performLOD } = require("./lib/lod");
const { source } = require("./lib/config");

const main = () => {
  console.log(
    chalk.yellow(figlet.textSync("LODE", { horizontalLayout: "full" }))
  );

  const sourceFiles = glob.sync(source);

  if (sourceFiles.length === 0) {
    console.log(chalk.red("No files found matching", source));
    console.log(chalk.red("Aborting"));
    return;
  }

  console.log("Running initial LOD transformation:");
  sourceFiles.forEach(performLOD);

  console.log("watching files...");
  sourceFiles.forEach((file) =>
    fs.watchFile(file, { persistent: true }, () => performLOD(file))
  );
};

main();
