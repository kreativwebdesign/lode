const markerName = "lastFrame";
const measureName = "time since last frame";
performance.mark(markerName);
export function measureFPS() {
  performance.measure(measureName, markerName);
  const performanceEntry = performance.getEntriesByName(measureName)[0];
  const timeSinceLastFrame = performanceEntry.duration;
  performance.clearMeasures();
  performance.mark(markerName);
  return 1 / (timeSinceLastFrame / 1000);
}
