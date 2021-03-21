const { Command } = require("commander");
const app = require("./lib/app");
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
  .action(app.run);

program.command("init").description("Setup LOD configuration").action(app.init);

program.parse();
