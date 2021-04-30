import inquirer from "inquirer";
import glob from "glob";
import { mergeOptionsWithConfigFile } from "../helper/config.js";
import * as print from "../helper/print.js";
import {
  createFile,
  fileExists,
  getModelConfigFile,
  readFile,
} from "../helper/files.js";

const defaultConfigOptions = {
  config: "./lode-cli.config.json",
  all: false,
};

const config = async (commanderOptions) => {
  const opts = mergeOptionsWithConfigFile(
    commanderOptions,
    defaultConfigOptions
  );

  const sourceFiles = glob.sync(opts.source);
  for await (const file of sourceFiles) {
    const configFile = getModelConfigFile(file);
    const configFileExists = fileExists(configFile);

    if (configFileExists && !opts.all) {
      break;
    }
    const storedConfig = configFileExists
      ? JSON.parse(readFile(configFile))
      : {};
    const config = { levels: [] };
    print.success(file);
    const { levelCount } = await inquirer.prompt([
      {
        name: "levelCount",
        type: "number",
        message: "How many level of details should i generate (min. 2)",
        default: storedConfig.levels?.length || 2,
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
      const defaults = {
        firstThreshold: 100,
        lastThreshold: -1,
        threshold: 50,
        targetScale: 1 / Math.pow(2, i + 2),
      };
      const getDefaultThreshold = () => {
        if (storedConfig.levels?.[i].threshold) {
          return storedConfig.levels?.[i].threshold;
        }
        if (isFirst) {
          return defaults.firstThreshold;
        } else if (isLast) {
          return defaults.lastThreshold;
        } else {
          return defaults.threshold;
        }
      };
      print.success(`${artifactName}:`);
      const levelConfig = await inquirer.prompt([
        {
          name: "threshold",
          type: "number",
          message: `For which distance should the artifact "${artifactName}" be used? (-1 for infinity)`,
          default: getDefaultThreshold(),
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
          default: storedConfig.levels?.[i].targetScale || defaults.targetScale,
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
      config.levels.push({
        threshold: levelConfig.threshold,
        configuration: isFirst
          ? undefined
          : {
              targetScale: levelConfig.targetScale,
            },
      });
    }
    createFile(configFile, JSON.stringify(config, null, 2));
    print.blankLine();
  }
};

export default config;
