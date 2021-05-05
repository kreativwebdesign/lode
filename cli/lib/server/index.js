import glob from "glob";
import path from "path";
import serveStatic from "serve-static";
import { App } from "@tinyhttp/app";
import { json } from "milliparsec";
import { cors } from "@tinyhttp/cors";
import { readFile, writeFile } from "../helper/files.js";
import { CONFIG_FILENAME, MANIFEST_FILENAME } from "../constants.js";
import buildManifest from "../app/run/buildManifest.js";

function createOncePubSub() {
  const pubSub = {
    changes: [],
    subscribers: [],
    sub: function (subscriber) {
      this.subscribers.push(subscriber);
      return subscriber;
    },
    pub: function (change) {
      this.changes.push(change);
      this.subscribers.forEach((subscriber) => subscriber(this.changes));
      this.changes = [];
    },
    unsub: function (subscriber) {
      this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
    },
  };
  return pubSub;
}

export const startServer = (opts) => {
  const app = new App();
  const oncePubSub = createOncePubSub();

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
    .get("/changes", (req, res) => {
      const listener = (changes) => {
        const timestamp = new Date().getMilliseconds();
        const manifest = readFile(
          path.join(opts.outputFoldername, MANIFEST_FILENAME)
        );
        res
          .status(200)
          .send({ changes, timestamp, manifest: JSON.parse(manifest) });
        oncePubSub.unsub(listener);
      };
      oncePubSub.sub(listener);
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

  return { app, oncePubSub };
};
