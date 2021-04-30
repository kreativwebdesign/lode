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
