import report from "../../benchmark/tmp/report.json";

const data = [
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

Plotly.newPlot("fps", data, { height: 300 }, { staticPlot: true });
