export const calculateNinetyFiveConfidenceInterval = ({
  mean,
  standardDeviation,
  samples,
}) => {
  const x = mean;
  const zUpper = 1.96;
  const zLower = -zUpper;
  const n = Math.sqrt(samples);

  return {
    upper: x + zUpper * (standardDeviation / n),
    lower: x + zLower * (standardDeviation / n),
  };
};
