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
      baselineLower: 38.039,
      baselineMedianFpsMean: 42,
      baselineMedianFpsVariance: 12.25,
      baselineUpper: 45.961,
      optimizedLower: 60,
      optimizedMedianFpsMean: 60,
      optimizedMedianFpsVariance: 0,
      optimizedUpper: 60,

      gpuTotalTime: {
        optimized: {
          mean: 2194.879,
          variance: 1889.006,
        },
        baseline: {
          mean: 2722.989,
          variance: 24.012,
        },
      },
      medianRenderLoopDuration: {
        optimized: {
          mean: 0.717,
          variance: 0.121,
        },
        baseline: {
          mean: 0.876,
          variance: 0.142,
        },
      },

      totalGpuEvents: {
        optimized: {
          mean: 346.667,
          variance: 13694.333,
        },
        baseline: {
          mean: 181.333,
          variance: 11334.333,
        },
      },

      totalModelLoadDuration: {
        optimized: {
          mean: 415.068,
          variance: 26699.602,
        },
        baseline: {
          mean: 260.632,
          variance: 8653.976,
        },
      },

      totalRenders: {
        optimized: {
          mean: 220,
          variance: 3819,
        },
        baseline: {
          mean: 114.333,
          variance: 3236.333,
        },
      },
    });
  });
});
