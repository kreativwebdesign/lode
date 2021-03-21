const fs = require("fs");
const print = require("./print");
const commander = require("./commander");
const fileExists = require("./files");
const defaultOptions = require("./default-options");

const getOptions = () => {
  const options = commander.opts();
  const configFilePath = options.config || defaultOptions.config;

  if (fileExists(configFilePath)) {
    const configFile = fs.readFileSync(configFilePath);
    const config = JSON.parse(configFile);
    return {
      ...defaultOptions,
      ...config,
      ...options,
    };
  } else {
    if (options.config) {
      print.warn("Config file not found:", options.config);
    }
    return {
      ...defaultOptions,
      ...options,
    };
  }
};

module.exports = {
  getOptions,
};
