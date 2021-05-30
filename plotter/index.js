import puppeteer from "puppeteer";
import { spawn } from "child_process";
import waitPort from "wait-port";

const PORT = 8081;

const main = async () => {
  const snowpack = spawn("npx", ["snowpack", "dev", "--port", PORT], {
    cwd: "visualizer",
  });

  snowpack.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  snowpack.stderr.on("data", (data) => {
    console.error(`snowpack stderr: ${data}`);
  });

  await waitPort({ host: "localhost", port: PORT });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 400,
    height: 1200,
    deviceScaleFactor: 2,
  });

  await page.goto(`http://localhost:${PORT}`);

  const fpsChart = await page.$("#fps");

  await fpsChart.screenshot({
    path: "fpsChart.jpg",
  });

  const downloadChart = await page.$("#download");

  await downloadChart.screenshot({
    path: "downloadChart.jpg",
  });

  await browser.close();

  snowpack.kill();
};

main();
