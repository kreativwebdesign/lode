import * as THREE from "../_snowpack/pkg/three.js";
import loadGltfAsync from "./async-gltf-loader.js";

export const getLod = async (levelCount, basePath, fileName) => {
  const lod = new THREE.LOD();
  const lodArtifacts = await Promise.all(
    [...Array(levelCount).keys()].map((_, i) =>
      loadGltfAsync(`${basePath}/${fileName}-lod-${i}/${fileName}.gltf`)
    )
  );

  lodArtifacts.forEach((artifact, i) => {
    lod.addLevel(artifact.scene, i * 20);
  });
  return lod;
};