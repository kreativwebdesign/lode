const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv)).argv;
const source = argv.source || "**/*.gltf";

module.exports = {
  source,
};
