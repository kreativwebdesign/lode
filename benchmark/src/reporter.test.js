import { generateHolisticReport } from "./reporter";

describe("reporter", () => {
  it("should aggregate data", () => {
    const reports = [
      {
        optimizedReport: {
          medianFps: 60,
          gpuTotalTime: 2210.9640000000004,
          debug: {
            totalGpuEvents: 465,
            medianRenderLoopDuration: 0.3949999991164077,
            totalRenders: 285,
            totalModelLoadDuration: 254.11499999972875,
          },
        },
        baselineReport: {
          medianFps: 44.5,
          gpuTotalTime: 2728.3400000000015,
          debug: {
            totalGpuEvents: 304,
            medianRenderLoopDuration: 0.4750000007334165,
            totalRenders: 180,
            totalModelLoadDuration: 153.32500000113214,
          },
        },
      },
      {
        optimizedReport: {
          medianFps: 60,
          gpuTotalTime: 2145.6670000000004,
          debug: {
            totalGpuEvents: 344,
            medianRenderLoopDuration: 0.6700000012642704,
            totalRenders: 213,
            totalModelLoadDuration: 410.28000000005704,
          },
        },
        baselineReport: {
          medianFps: 43.5,
          gpuTotalTime: 2718.721000000001,
          debug: {
            totalGpuEvents: 127,
            medianRenderLoopDuration: 0.9300000001530861,
            totalRenders: 83,
            totalModelLoadDuration: 318.5200000007171,
          },
        },
      },
      {
        optimizedReport: {
          medianFps: 60,
          gpuTotalTime: 2228.0069999999982,
          debug: {
            totalGpuEvents: 231,
            medianRenderLoopDuration: 1.0849999998754356,
            totalRenders: 162,
            totalModelLoadDuration: 580.8100000012928,
          },
        },
        baselineReport: {
          medianFps: 38,
          gpuTotalTime: 2721.9049999999957,
          debug: {
            totalGpuEvents: 113,
            medianRenderLoopDuration: 1.2225000000398722,
            totalRenders: 80,
            totalModelLoadDuration: 310.05000000004657,
          },
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

      baselineMedianRenderLoopDurationMean: 0.876,
      baselineMedianRenderLoopDurationVariance: 0.142,
      baselineTotalGpuEventsMean: 181.333,
      baselineTotalGpuEventsVariance: 11334.333,
      baselineTotalModelLoadDurationMean: 260.632,
      baselineTotalModelLoadDurationVariance: 8653.976,
      baselineTotalRendersMean: 114.333,
      baselineTotalRendersVariance: 3236.333,
      optimizedMedianRenderLoopDurationMean: 0.717,
      optimizedMedianRenderLoopDurationVariance: 0.121,
      optimizedTotalGpuEventsMean: 346.667,
      optimizedTotalGpuEventsVariance: 13694.333,
      optimizedTotalModelLoadDurationMean: 415.068,
      optimizedTotalModelLoadDurationVariance: 26699.602,
      optimizedTotalRendersMean: 220,
      optimizedTotalRendersVariance: 3819,
    });
  });
});
