import { generateHolisticReport } from "./reporter";

describe("reporter", () => {
  it("should aggregate data", () => {
    const reports = [
      {
        optimizedReport: {
          medianFps: 60,
          gpuTotalTime: 2210.9640000000004,
        },
        baselineReport: {
          medianFps: 44.5,
          gpuTotalTime: 2728.3400000000015,
        },
      },
      {
        optimizedReport: {
          medianFps: 60,
          gpuTotalTime: 2145.6670000000004,
        },
        baselineReport: {
          medianFps: 43.5,
          gpuTotalTime: 2718.721000000001,
        },
      },
      {
        optimizedReport: {
          medianFps: 60,
          gpuTotalTime: 2228.0069999999982,
        },
        baselineReport: {
          medianFps: 38,
          gpuTotalTime: 2721.9049999999957,
        },
      },
    ];

    expect(generateHolisticReport(reports)).toEqual({
      baselineGpuTotalTimeMean: 2722.989,
      baselineGpuTotalTimeVariance: 24.012,
      baselineLower: 38.039,
      baselineMedianFpsMean: 42,
      baselineMedianFpsVariance: 12.25,
      baselineUpper: 45.961,
      optimizedGpuTotalTimeMean: 2194.879,
      optimizedGpuTotalTimeVariance: 1889.006,
      optimizedLower: 60,
      optimizedMedianFpsMean: 60,
      optimizedMedianFpsVariance: 0,
      optimizedUpper: 60,
    });
  });
});
