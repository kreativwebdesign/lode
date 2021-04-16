import { mergeOptionsWithConfigFile } from "../config.js";
import * as print from "../print.js";
import { rmDir } from "../files.js";

const defaultRunOptions = {
  config: "./lode-cli.config.json",
  outputFoldername: "lode-build",
};

const clean = (commanderOptions) => {
  const opts = mergeOptionsWithConfigFile(commanderOptions, defaultRunOptions);

  print.info("Clearing output folder:");
  rmDir(opts.outputFoldername);
  print.success("done");
};

export default clean;
