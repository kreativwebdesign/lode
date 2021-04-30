import * as THREE from "three";
import loadGltfAsync from "./src/async-gltf-loader";

export const loadModel = async ({
  manifest,
  relativePathToLodeOutputFolder,
  modelBasePath,
  artifactName,
}) => {
  const lod = new THREE.LOD();
  const fileIdentifier = ModelBasePath;
  const config = manifest[fileIdentifier];
  const lodArtifacts = await Promise.all(
    config.levels.map((_, i) => {
      const filePath = `${relativePathToLodeOutputFolder}/${modelBasePath}/${artifactName}-lod-${i}/${artifactName}.gltf`;
      return loadGltfAsync(filePath);
    })
  );
  lodArtifacts.forEach((artifact, i) => {
    if (i === 0) {
      lod.addLevel(artifact.scene, 0);
    } else {
      const threshold =
        config.levels[i - 1].threshold === -1
          ? Infinity
          : config.levels[i - 1].threshold;
      lod.addLevel(artifact.scene, threshold);
    }
  });
  return lod;
};
