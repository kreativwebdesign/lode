import { Command } from "commander";
import * as app from "./lib/app/index.js";

const program = new Command();

program
  .version("v0.0.1")
  .description("CLI for creating different LOD artifacts.");

program
  .command("run", { isDefault: true })
  .description("Generate different LOD artifacts")
  .option("-w, --watch", "Watch source files")
  .option("-s, --source <pattern>", "Source glob pattern")
  .option("-c, --config <configfile>", "Path to config file")
  .option("-o, --outputFoldername <name>", "Name of the output folder")
  .option("--clearOutputBeforeRun", "Clean output folder before run")
  .action(app.run);

program.command("init").description("Setup LOD configuration").action(app.init);

program.parse();
