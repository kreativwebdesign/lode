const fs = require("fs");
const { analyzeTraceEvents } = require("./analyze");

describe("analyzeTraceEvents", () => {
  const loadTrace = (file) => {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  };

  it("aggregates all gpu related information", () => {
    const trace = loadTrace(`test-data/sample-benchmark-trace.json`);
    const groups = analyzeTraceEvents(trace.traceEvents);

    // import trace into chrome dev tools to obtain this number
    const actualGPUTime = 2228;
    const errorTolerance = 2;
    const difference = Math.abs(actualGPUTime - groups.gpu.totalTime);
    expect(difference).toBeLessThan(errorTolerance);
  });
});
