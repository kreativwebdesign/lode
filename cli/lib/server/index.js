import glob from "glob";
import path from "path";
import serveStatic from "serve-static";
import { App } from "@tinyhttp/app";
import { json } from "milliparsec";
import { cors } from "@tinyhttp/cors";
import { readFile, writeFile } from "../helper/files.js";
import { CONFIG_FILENAME, MANIFEST_FILENAME } from "../constants.js";
import buildManifest from "../app/run/buildManifest.js";

export const startServer = (opts) => {
  const app = new App();

  app
    .use(json())
    .use(cors({ origin: "*", allowedHeaders: "*" }))
    .options("*", cors())
    .use("/assets", serveStatic(opts.outputFoldername, { maxAge: 0 }))
    .get("/", (_, res) => {
      res.send("<h1>lode API is running</h1>");
    })
    .get("/manifest", (req, res) => {
      const file = readFile(
        path.join(opts.outputFoldername, MANIFEST_FILENAME)
      );
      res.status(200).send(file);
    })
    .post("/updateModel", async (req, res) => {
      const { name, model } = req.body;
      writeFile(
        path.join(name, CONFIG_FILENAME),
        JSON.stringify(model, null, 2)
      );
      const sourceFiles = glob.sync(opts.source);
      const manifest = buildManifest(opts.outputFoldername, sourceFiles);

      res.status(200).send(manifest);
    })
    .listen(3001);

  return app;
};
