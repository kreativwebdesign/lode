import glob from "glob";
import path from "path";
import chokidar from "chokidar";
import figlet from "figlet";
import * as print from "../../helper/print.js";
import { mergeOptionsWithConfigFile } from "../../helper/config.js";
import { getModelConfigFile } from "../../helper/files.js";
import { startServer } from "../../server/index.js";
import defaultRunOptions from "./defaultRunOptions.js";
import prepareFolders from "./prepareFolders.js";
import optimizeFile from "./optimizeFile.js";
import buildManifest from "./buildManifest.js";

const run = (commanderOptions) => {
  print.warn(figlet.textSync("LODE", { horizontalLayout: "full" }));
  const opts = mergeOptionsWithConfigFile(commanderOptions, defaultRunOptions);
  const sourceFiles = glob.sync(opts.source);

  if (sourceFiles.length === 0) {
    print.error("No files found matching", opts.source);
    print.error("Aborting");
    return;
  }
  print.info("Preparing output folder:");
  const fileStructure = prepareFolders(opts.outputFoldername, sourceFiles);
  print.success("done");

  print.info("Running initial LOD transformation:");
  sourceFiles.forEach((file) => optimizeFile(fileStructure[file]));

  buildManifest(opts.outputFoldername, sourceFiles);

  if (opts.watch) {
    print.info("watching files and running lode api server on port 3001...");

    const { oncePubSub } = startServer(opts);

    chokidar
      .watch(opts.source)
      .on("add", (file) => optimizeFile(fileStructure[file]))
      .on("change", (file) => optimizeFile(fileStructure[file]));
    sourceFiles.forEach((srcFile) => {
      const modelConfigFile = getModelConfigFile(srcFile);
      chokidar
        .watch(modelConfigFile, { awaitWriteFinish: true })
        .on("change", () => {
          const fileStructure = prepareFolders(opts.outputFoldername, [
            srcFile,
          ]);
          optimizeFile(fileStructure[srcFile]);

          buildManifest(opts.outputFoldername, sourceFiles);
        });
    });
    chokidar
      .watch(path.join(opts.outputFoldername, opts.source))
      .on("change", (file) => {
        oncePubSub.pub(file);
      });
  }
};

export default run;
