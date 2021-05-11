function generateRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomPosition({ positionRanges }) {
  const y = generateRandomIntegerInRange(
    positionRanges.y.min,
    positionRanges.y.max
  );
  const z = generateRandomIntegerInRange(
    positionRanges.z.min,
    positionRanges.z.max
  );
  const absoluteZ = -1 * z + positionRanges.z.max;
  const x = generateRandomIntegerInRange(
    positionRanges.x.min - absoluteZ / 1.3,
    positionRanges.x.max + absoluteZ / 1.3
  );
  return [x, y, z];
}

export default generateRandomPosition;
