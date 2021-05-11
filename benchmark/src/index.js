import fs from "fs";
import puppeteer from "puppeteer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { waitFor, startLogGroup, createFolderIfNotExist } from "./helpers.js";
import { reporter, analyzeTraceEvents, generateReport } from "./analyze.js";
import { logDetail, setLogDetail } from "./logger.js";
import { generateHolisticReport } from "./reporter.js";

const argv = yargs(hideBin(process.argv)).argv;

const LOG_DETAILS = argv.logDetails || false;
setLogDetail(LOG_DETAILS);

const HEADLESS = argv.headless || false;

const main = async () => {
  const ITERATIONS = argv.iterations || 10;
  const SAMPLE_TIMEOUT_MS = argv.timeout || 20000;
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

  const {
    optimizedMedianFpsMean,
    optimizedMedianFpsVariance,
    optimizedLower,
    optimizedUpper,
    baselineMedianFpsMean,
    baselineMedianFpsVariance,
    baselineLower,
    baselineUpper,
    gpuTotalTime,
    medianRenderLoopDuration,
    totalGpuEvents,
    totalModelLoadDuration,
    totalRenders,
  } = generateHolisticReport(reports);

  console.log(
    `report for ${ITERATIONS} iterations, performed on ${new Date()}:`
  );

  console.log(`
optimized fps: ${optimizedMedianFpsMean} (${optimizedMedianFpsVariance} variance)
the value is with a confidence of 95% between ${optimizedLower} and ${optimizedUpper}
baseline fps: ${baselineMedianFpsMean} (${baselineMedianFpsVariance} variance)
the value is with a confidence of 95% between ${baselineLower} and ${baselineUpper}
`);

  console.log(`
further information for interpreting data:
`);

  const logReportSection = (sectionName, data) => {
    console.log(`${sectionName}:
optimized: ${data.optimized.mean} (${data.optimized.variance} variance)
baseline: ${data.baseline.mean} (${data.baseline.variance} variance)`);
  };

  logReportSection("gpuTotalTime", gpuTotalTime);
  logReportSection("medianRenderLoopDuration", medianRenderLoopDuration);
  logReportSection("totalGpuEvents", totalGpuEvents);
  logReportSection("totalModelLoadDuration", totalModelLoadDuration);
  logReportSection("totalRenders", totalRenders);
};

const sample = async (optimize) => {
  const TEMP_FOLDER = "tmp/";
  createFolderIfNotExist(TEMP_FOLDER);
  logDetail("start benchmark");
  const browser = await puppeteer.launch({ headless: HEADLESS });
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
