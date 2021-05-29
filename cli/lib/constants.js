import path from "path";

export const CONFIG_FILENAME = "lode-config.json";
export const MANIFEST_FILENAME = "lode-manifest.json";
export const HASH_FILENAME = ".lode-hash";
export const LODE_UI_PATH = path
  .join(import.meta.url, "../../lode-ui-build")
  .replace("file:", "");
