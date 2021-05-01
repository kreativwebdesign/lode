export const calculateNinetyFiveConfidenceInterval = ({
  mean,
  variance,
  samples,
}) => {
  const x = mean;
  const zUpper = 1.96;
  const zLower = -zUpper;
  const standardDeviation = Math.sqrt(variance);
  const n = Math.sqrt(samples);

  return {
    upper: x + zUpper * (standardDeviation / n),
    lower: x + zLower * (standardDeviation / n),
  };
};
