const commander = require("commander");

module.exports = commander
  .version("v0.0.1")
  .description("CLI for creating different LOD artifacts.")
  .option("-w, --watch", "Watch source files")
  .option("-s, --source <pattern>", "Source glob pattern")
  .option("-c, --config <configfile>", "Path to config file")
  .parse(process.argv);
