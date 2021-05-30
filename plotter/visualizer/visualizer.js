import report from "../../benchmark/tmp/report.json";

const chartLayout = { height: 220, margin: { l: 40, r: 0, t: 0, b: 25 } };
const chartConfig = { staticPlot: true };

const fps = [
  {
    x: ["Baseline", "Optimized"],
    y: [report.baselineMedianFpsMean, report.optimizedMedianFpsMean],
    error_y: {
      type: "data",
      array: [
        report.baselineMedianFpsDeviation,
        report.optimizedMedianFpsDeviation,
      ],
      visible: true,
    },
    type: "bar",
  },
];

Plotly.newPlot("fps", fps, chartLayout, chartConfig);

const download = [
  {
    x: ["Baseline", "Optimized"],
    y: [
      report.totalModelLoadDuration.baseline.mean,
      report.totalModelLoadDuration.optimized.mean,
    ],
    error_y: {
      type: "data",
      array: [
        report.totalModelLoadDuration.baseline.standardDeviation,
        report.totalModelLoadDuration.optimized.standardDeviation,
      ],
      visible: true,
    },
    type: "bar",
  },
];

Plotly.newPlot("download", download, chartLayout, chartConfig);
