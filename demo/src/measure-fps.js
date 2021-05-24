const markerName = "lastFrame";
const measureName = "time since last frame";

const isFirstRun = () => !performance.getEntriesByName(markerName)[0];

export function measureFPS() {
  if (isFirstRun()) {
    performance.mark(markerName);
    return 0;
  } else {
    performance.measure(measureName, markerName);
    const performanceEntry = performance.getEntriesByName(measureName)[0];
    const timeSinceLastFrame = performanceEntry.duration;
    performance.clearMeasures(measureName);
    performance.mark(markerName);
    const FPS = 1 / (timeSinceLastFrame / 1000);
    console.log("::benchmark::fps::" + FPS);
  }
}
