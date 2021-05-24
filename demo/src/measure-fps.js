const markerName = "lastFrame";
const measureName = "time since last frame";
export function measureFPS() {
  try {
    performance.measure(measureName, markerName);
    const performanceEntry = performance.getEntriesByName(measureName)[0];
    const timeSinceLastFrame = performanceEntry.duration;
    performance.clearMeasures(measureName);
    performance.mark(markerName);
    const FPS = 1 / (timeSinceLastFrame / 1000);
    console.log("::benchmark::fps::" + FPS);
  } catch (e) {
    performance.mark(markerName);
    return 0;
  }
}
