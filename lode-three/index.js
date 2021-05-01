import * as THREE from "three";
import loadGltfAsync from "./src/async-gltf-loader";

export const createContext = ({ basePath, manifest }) => ({
  basePath,
  manifest,
});

export const loadModel = async ({ artifactName, lodeContext }) => {
  const lod = new THREE.LOD();
  const config = lodeContext.manifest[artifactName];
  const name = artifactName.split("/").pop();
  const lodArtifacts = await Promise.all(
    config.levels.map((_, i) => {
      const filePath = `${lodeContext.basePath}/${artifactName}/lod-${i}/${name}.gltf`;
      return loadGltfAsync(filePath);
    })
  );

  const thresholds = [
    0,
    ...config.levels.map((level, i) => {
      const prevThreshold = config.levels[i - 1]?.threshold || 0;
      const isInfinity = level.threshold === -1;
      const threshold = isInfinity ? -1 : prevThreshold + level.threshold;
      return threshold;
    }),
  ];
  lodArtifacts.forEach((artifact, i) => {
    if (i === 0) {
      lod.addLevel(artifact.scene, 0);
    } else {
      const threshold = thresholds[i] === -1 ? Infinity : thresholds[i];
      lod.addLevel(artifact.scene, threshold);
    }
  });
  return lod;
};
