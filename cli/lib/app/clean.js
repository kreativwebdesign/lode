import { mergeOptionsWithConfigFile } from "../helper/config.js";
import * as print from "../helper/print.js";
import { rmDir } from "../helper/files.js";

const defaultCleanOptions = {
  config: "./lode-cli.config.json",
  outputFoldername: "lode-build",
};

const clean = (commanderOptions) => {
  const opts = mergeOptionsWithConfigFile(
    commanderOptions,
    defaultCleanOptions
  );

  print.info("Clearing output folder:");
  rmDir(opts.outputFoldername);
  print.success("done");
};

export default clean;
