import path from "path";
import sirv from "sirv";
import { App } from "@tinyhttp/app";
import { readFile } from "../helper/files.js";
import { MANIFEST_FILENAME } from "../constants.js";

export const startServer = ({ outputFoldername }) => {
  const app = new App();

  app
    .use(function someMiddleware(req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
    })
    .use("/assets", sirv(outputFoldername))
    .get("/", (_, res) => {
      res.send("<h1>lode API is running</h1>");
    })
    .get("/manifest", (req, res) => {
      const file = readFile(path.join(outputFoldername, MANIFEST_FILENAME));
      res.status(200).send(file);
    })
    .listen(3001);

  return app;
};
