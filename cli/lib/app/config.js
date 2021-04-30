import inquirer from "inquirer";
import glob from "glob";
import { mergeOptionsWithConfigFile } from "../helper/config.js";
import * as print from "../helper/print.js";
import { createFile, getModelConfigFile } from "../helper/files.js";

const defaultConfigOptions = {
  config: "./lode-cli.config.json",
};

const config = async (commanderOptions) => {
  const opts = mergeOptionsWithConfigFile(
    commanderOptions,
    defaultConfigOptions
  );

  const sourceFiles = glob.sync(opts.source);
  for await (const file of sourceFiles) {
    const config = { levels: [] };
    print.success(file);
    const { levelCount } = await inquirer.prompt([
      {
        name: "levelCount",
        type: "number",
        message: "How many level of details should i generate (min. 2)",
        default: 2,
        validate: function (value) {
          if (value >= 2) {
            return true;
          } else {
            return "Please enter a valid number higher than 1";
          }
        },
      },
    ]);

    for (let i = 0; i < levelCount; i++) {
      const isFirst = i === 0;
      const isLast = i === levelCount - 1;
      const artifactName = i === 0 ? "original" : `LOD-${i}`;
      print.success(`${artifactName}:`);
      const levelConfig = await inquirer.prompt([
        {
          name: "threshold",
          type: "number",
          message: `For which distance should the artifact "${artifactName}" be used? (-1 for infinity)`,
          default: isFirst ? 100 : isLast ? -1 : 50,
          validate: function (value) {
            if (value >= 1 || value === -1) {
              return true;
            } else {
              return "Please enter a valid number higher than 0";
            }
          },
        },
        {
          name: "targetScale",
          type: "number",
          message: `Target scale for the artifact "${artifactName}" (0-1)`,
          default: 1 / Math.pow(2, i + 2),
          validate: function (value) {
            if (value <= 1 && value > 0) {
              return true;
            } else {
              return "Please enter a valid number higher than 0";
            }
          },
          when: () => !isFirst,
        },
      ]);
      const lastThreshold =
        config.levels[config.levels.length - 1]?.threshold || 0;
      const threshold =
        levelConfig.threshold === -1
          ? -1
          : lastThreshold + levelConfig.threshold;

      config.levels.push({
        threshold: threshold,
        configuration: isFirst
          ? "raw"
          : {
              targetScale: levelConfig.targetScale,
            },
      });
    }
    createFile(getModelConfigFile(file), JSON.stringify(config, null, 2));
    print.blankLine();
  }
};

export default config;
