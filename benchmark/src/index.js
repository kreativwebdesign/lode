import fs from "fs";
import * as math from "mathjs";
import puppeteer from "puppeteer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { waitFor, startLogGroup, createFolderIfNotExist } from "./helpers.js";
import { reporter, analyzeTraceEvents, generateReport } from "./analyze.js";
import { calculateNinetyFiveConfidenceInterval } from "./stats.js";
import { logDetail, setLogDetail } from "./logger.js";

const argv = yargs(hideBin(process.argv)).argv;

const SAMPLE_TIMEOUT_MS = 20000;

const LOG_DETAILS = argv.logDetails || false;
setLogDetail(LOG_DETAILS);

const main = async () => {
  const ITERATIONS = argv.iterations || 10;
  logDetail("start benchmark with " + ITERATIONS + " iterations");
  const reports = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const optimizedReport = await Promise.any([
      sample(true),
      waitFor(SAMPLE_TIMEOUT_MS),
    ]);

    const baselineReport = await Promise.any([
      sample(false),
      waitFor(SAMPLE_TIMEOUT_MS),
    ]);

    if (optimizedReport === undefined || baselineReport === undefined) {
      throw new Error(
        "got undefined report, likely due to timeout. Ensure that benchmark is working and otherwise tune timeout."
      );
    }

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

  const {
    upper: optimizedUpper,
    lower: optimizedLower,
  } = calculateNinetyFiveConfidenceInterval({
    mean: optimizedMedianFpsMean,
    variance: optimizedMedianFpsVariance,
    samples: ITERATIONS,
  });

  const {
    upper: baselineUpper,
    lower: baselineLower,
  } = calculateNinetyFiveConfidenceInterval({
    mean: baselineMedianFpsMean,
    variance: baselineMedianFpsVariance,
    samples: ITERATIONS,
  });

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
    the value is with a confidence of 95% between ${math.round(
      optimizedLower,
      precision
    )} and ${math.round(optimizedUpper, precision)}
    baseline fps: ${math.round(baselineMedianFpsMean, precision)} (${math.round(
      baselineMedianFpsVariance,
      precision
    )} variance)
    the value is with a confidence of 95% between ${math.round(
      baselineLower,
      precision
    )} and ${math.round(baselineUpper, precision)}
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
  logDetail("start benchmark");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const { report, reportPerformanceEntries, getReport } = reporter();

  // promise to resolve when models are loaded in scene
  let resolveLoadedModels = null;
  let loadedModels = new Promise((resolve) => {
    resolveLoadedModels = resolve;
  });

  page.on("console", (message) => {
    const log = message.text();
    if (log === "::benchmark::loadedModels") {
      resolveLoadedModels();
    } else if (log.includes("::benchmark::")) {
      report(log);
    } else {
      logDetail("web-console: " + message.text());
    }
  });

  let finishGroup = startLogGroup("load page");
  await page.goto(`http://localhost:8080?${optimize ? "optimize" : ""}`);
  await loadedModels;
  finishGroup();

  // screenshot is only used for manual qa
  await page.screenshot({
    path: `${TEMP_FOLDER}screenshotPre${optimize}.jpg`,
  });

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
  await page.screenshot({
    path: `${TEMP_FOLDER}screenshotAfter${optimize}.jpg`,
  });

  await browser.close();
  logDetail("stop benchmark");

  logDetail("start analyzer");

  const trace = JSON.parse(fs.readFileSync(`${TEMP_FOLDER}trace.json`, "utf8"));
  const events = trace.traceEvents ? trace.traceEvents : trace;
  const traceEventGroups = analyzeTraceEvents(events);
  return generateReport(getReport(), traceEventGroups);
};

main();
