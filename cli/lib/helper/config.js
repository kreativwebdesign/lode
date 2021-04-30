import fs from "fs";
import * as print from "./print.js";
import { fileExists } from "./files.js";

export const mergeOptionsWithConfigFile = (options, defaultOptions) => {
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
