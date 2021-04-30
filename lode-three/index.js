import * as THREE from "three";
import loadGltfAsync from "./src/async-gltf-loader";

export const loadModel = async ({
  manifest,
  relativePathToLodeOutputFolder,
  ModelBasePath,
  artifactName,
}) => {
  const lod = new THREE.LOD();
  const fileIdentifier = ModelBasePath;
  const config = manifest[fileIdentifier];
  const lodArtifacts = await Promise.all(
    config.levels.map((_, i) => {
      const filePath = `${relativePathToLodeOutputFolder}/${ModelBasePath}/${artifactName}-lod-${i}/${artifactName}.gltf`;
      return loadGltfAsync(filePath);
    })
  );
  lodArtifacts.forEach((artifact, i) => {
    const threshold =
      i === 0
        ? 0
        : config.levels[i - 1].threshold === -1
        ? Infinity
        : config.levels[i - 1].threshold;
    lod.addLevel(artifact.scene, threshold);
  });
  return lod;
};
