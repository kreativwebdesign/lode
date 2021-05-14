function sumDistance(agg, l) {
  return agg + l.threshold;
}

function populateDistance(model) {
  const levels = model?.levels.map((level, i, arr) => ({
    ...level,
    distance:
      level.threshold === -1
        ? Infinity
        : arr.slice(0, i + 1).reduce(sumDistance, 0),
  }));
  return levels;
}

export default populateDistance;