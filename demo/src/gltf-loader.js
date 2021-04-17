import * as THREE from "three";
import loadGltfAsync from "./async-gltf-loader";

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
