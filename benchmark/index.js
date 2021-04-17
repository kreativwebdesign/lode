import fs from "fs";
import * as math from "mathjs";
import puppeteer from "puppeteer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { waitFor, startLogGroup, createFolderIfNotExist } from "./helpers.js";
import { reporter, analyzeTraceEvents, generateReport } from "./analyze.js";

const argv = yargs(hideBin(process.argv)).argv;

const main = async () => {
  const ITERATIONS = argv.iterations || 10;
  console.log("start benchmark with " + ITERATIONS + " iterations");
  const reports = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const optimizedReport = await sample(true);
    const baselineReport = await sample(false);
    reports.push({
      optimizedReport,
      baselineReport,
    });
  }

  const optimizedMedianFps = reports.map(
    ({ optimizedReport: { medianFps } }) => medianFps
  );
  const baselineMedianFps = reports.map(
    ({ baselineReport: { medianFps } }) => medianFps
  );
  const optimizedMedianFpsMean = math.mean(optimizedMedianFps);
  const optimizedMedianFpsVariance = math.variance(optimizedMedianFps);
  const baselineMedianFpsMean = math.mean(baselineMedianFps);
  const baselineMedianFpsVariance = math.variance(baselineMedianFps);

  const optimizedGpuTotalTime = reports.map(
    ({ optimizedReport: { gpuTotalTime } }) => gpuTotalTime
  );
  const baselineGpuTotalTime = reports.map(
    ({ baselineReport: { gpuTotalTime } }) => gpuTotalTime
  );

  const optimizedGpuTotalTimeMean = math.mean(optimizedGpuTotalTime);
  const optimizedGpuTotalTimeVariance = math.variance(optimizedGpuTotalTime);
  const baselineGpuTotalTimeMean = math.mean(baselineGpuTotalTime);
  const baselineGpuTotalTimeVariance = math.variance(baselineGpuTotalTime);

  console.log(
    `report for ${ITERATIONS} iterations, performed on ${new Date()}:`
  );

  const precision = 3;

  console.log(
    `
    optimized fps: ${math.round(
      optimizedMedianFpsMean,
      precision
    )} (${math.round(optimizedMedianFpsVariance, precision)} variance)
    baseline fps: ${math.round(baselineMedianFpsMean, precision)} (${math.round(
      baselineMedianFpsVariance,
      precision
    )} variance)
    `
  );

  console.log(
    `
    optimized gpuTotalTime: ${math.round(
      optimizedGpuTotalTimeMean,
      precision
    )} (${math.round(optimizedGpuTotalTimeVariance, precision)} variance)
    baseline gpuTotalTime: ${math.round(
      baselineGpuTotalTimeMean,
      precision
    )} (${math.round(baselineGpuTotalTimeVariance, precision)} variance)
    `
  );
};

const sample = async (optimize) => {
  const TEMP_FOLDER = "tmp/";
  createFolderIfNotExist(TEMP_FOLDER);
  console.log("start benchmark");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const { report, reportPerformanceEntries, getReport } = reporter();

  page.on("console", (message) => {
    const log = message.text();
    if (log.includes("::benchmark::")) {
      report(log);
    } else {
      console.info("web-console: " + message.text());
    }
  });

  let finishGroup = startLogGroup("load page");
  await page.goto(`http://localhost:8080?${optimize ? "optimize" : ""}`);
  finishGroup();

  finishGroup = startLogGroup("start trace");
  await page.tracing.start({ path: `${TEMP_FOLDER}trace.json` });

  await waitFor(3000);

  await page.tracing.stop();
  finishGroup();

  const context = await page.mainFrame().executionContext();
  const entries = JSON.parse(
    await context.evaluate(() => {
      return JSON.stringify(window.performance.getEntries());
    })
  );

  entries.forEach((entry) => {
    reportPerformanceEntries(entry);
  });

  // screenshot is only used for manual qa
  await page.screenshot({ path: `${TEMP_FOLDER}screenshot.jpg` });

  await browser.close();
  console.log("stop benchmark");

  console.log("start analyzer");

  const trace = JSON.parse(fs.readFileSync(`${TEMP_FOLDER}trace.json`, "utf8"));
  const events = trace.traceEvents ? trace.traceEvents : trace;
  const traceEventGroups = analyzeTraceEvents(events);
  return generateReport(getReport(), traceEventGroups);
};

main();
