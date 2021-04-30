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
  .option("-l, --levelCount <count>", "Amount of detail leves to be generated")
  .option("-o, --outputFoldername <name>", "Name of the output folder")
  .action(app.run);

program.command("init").description("Setup LOD configuration").action(app.init);

program
  .command("config")
  .option("-c, --config <configfile>", "Path to config file")
  .option("-s, --source <pattern>", "Source glob pattern")
  .description("Configure LOD options for each artifact")
  .action(app.config);

program
  .command("clean")
  .description("Cleans the output folder")
  .option("-c, --config <configfile>", "Path to config file")
  .option("-o, --outputFoldername <name>", "Name of the output folder")
  .action(app.clean);

program.parse();
