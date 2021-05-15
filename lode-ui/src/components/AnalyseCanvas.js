import { useFrame, useThree } from "@react-three/fiber";

function AnalyseCanvas({
  object,
  setCurrentLodLevel,
  setDistanceToObject,
  currentLodLevel,
  distanceToObject,
}) {
  const { camera } = useThree();
  useFrame(() => {
    const newDistance = camera.position.distanceTo(object.position).toFixed(2);
    if (newDistance !== distanceToObject) {
      setDistanceToObject(newDistance);
    }
    const newLevel = object.getCurrentLevel();
    if (newLevel !== currentLodLevel) {
      setCurrentLodLevel(newLevel);
    }
  });
  return null;
}

export default AnalyseCanvas;
