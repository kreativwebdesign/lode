const markerName = "lastFrame";
const measureName = "time since last frame";

export function buildFpsMeasurement() {
  let isFirstRun = true;
  return () => {
    if (isFirstRun) {
      performance.mark(markerName);
      isFirstRun = false;
      return undefined;
    }
    performance.measure(measureName, markerName);
    const performanceEntry = performance.getEntriesByName(measureName)[0];
    const timeSinceLastFrame = performanceEntry.duration;
    performance.clearMeasures(measureName);
    performance.mark(markerName);
    return 1 / (timeSinceLastFrame / 1000);
  };
}
