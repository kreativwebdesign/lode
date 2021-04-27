import * as THREE from "three";
import loadGltfAsync from "./src/async-gltf-loader";

const defaultOptions = {
  levelCount: 2,
};

const lodeLoader = {
  levelCount: defaultOptions.levelCount,
  init: function (opts) {
    this.levelCount = opts.levelCount || defaultOptions.levelCount;
  },
  load: async function ({ basePath, artifactName }) {
    const lod = new THREE.LOD();
    const lodArtifacts = await Promise.all(
      [...Array(this.levelCount).keys()].map((_, i) =>
        loadGltfAsync(
          `${basePath}/${artifactName}-lod-${i}/${artifactName}.gltf`
        )
      )
    );

    lodArtifacts.forEach((artifact, i) => {
      lod.addLevel(artifact.scene, i * 20);
    });
    return lod;
  },
};

export default lodeLoader;
