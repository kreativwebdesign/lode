import inquirer from "inquirer";
import * as print from "../print.js";
import { fileExists, createFile } from "../files.js";

const questions = [
  {
    name: "configFilepath",
    type: "input",
    message: "Where should i create the config file?",
    default: "./lode-cli.config.json",
    validate: function (value) {
      if (value.length) {
        return true;
      } else {
        return "Please enter a valid filename";
      }
    },
  },
  {
    name: "overwriteConfigFile",
    type: "confirm",
    message: "Config file already found, do you want to overwrite it?",
    default: false,
    when: (answers) => {
      return fileExists(answers.configFilepath);
    },
  },
  {
    name: "sourcePattern",
    type: "input",
    message: "For which files do you want to run lode-cli?",
    default: "**/*.gltf",
    when: (answers) => {
      return answers.overwriteConfigFile !== false;
    },
  },
  {
    name: "outputFoldername",
    type: "input",
    message: "Where should i store the generated artifacts?",
    default: "lode-build",
    when: (answers) => {
      return answers.overwriteConfigFile !== false;
    },
    validate: function (value) {
      if (value.length) {
        return true;
      } else {
        return "Please enter a valid filename";
      }
    },
  },
  {
    name: "levelCount",
    type: "number",
    message: "How many level of details should i generate (min. 2)",
    default: 2,
    when: (answers) => {
      return answers.overwriteConfigFile !== false;
    },
    validate: function (value) {
      if (value >= 2) {
        return true;
      } else {
        return "Please enter a valid number higher than 2";
      }
    },
  },
  {
    name: "clearOutputBeforeRun",
    type: "confirm",
    message: "Should i delete the output folder before running?",
    default: true,
    when: (answers) => {
      return answers.overwriteConfigFile !== false;
    },
  },
  {
    name: "watch",
    type: "confirm",
    message: "Do you want to run lode-cli in watch mode by default?",
    default: false,
    when: (answers) => {
      return answers.overwriteConfigFile !== false;
    },
  },
];

const init = async () => {
  const answers = await inquirer.prompt(questions);
  if (answers.overwriteConfigFile === false) {
    return;
  }
  try {
    createFile(
      answers.configFilepath,
      `{
  "source": "${answers.sourcePattern}",
  "outputFoldername": "${answers.outputFoldername}",
  "levelCount": ${answers.levelCount},
  "clearOutputBeforeRun": "${answers.clearOutputBeforeRun}",
  "watch": ${answers.watch}
}`
    );
    print.success(`${answers.configFilepath} created.`);
    print.info(`run lode-cli with '-c "${answers.configFilepath}"'`);
  } catch (e) {
    print.error(e.message);
  }
};

export default init;
