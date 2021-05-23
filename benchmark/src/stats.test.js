import { calculateNinetyFiveConfidenceInterval } from "./stats.js";

describe("calculateNinetyFiveConfidenceInterval", () => {
  it("should calculate confidence interval", () => {
    const { upper, lower } = calculateNinetyFiveConfidenceInterval({
      mean: 30,
      standardDeviation: Math.sqrt(300),
      samples: 100,
    });

    expect(lower).toBeCloseTo(26.605, 2);
    expect(upper).toBeCloseTo(33.394, 2);
  });
});
