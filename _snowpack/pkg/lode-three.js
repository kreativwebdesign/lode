import { L as LOD } from './common/three.module-6492b9ea.js';
import { G as GLTFLoader } from './common/GLTFLoader-3e3b6855.js';

const loader = new GLTFLoader();

const loadGltfAsync = (url) => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  loader.load(
    url,
    (gltf) => resolve(gltf),
    () => {},
    (err) => reject(err)
  );

  return promise;
};

const defaultOptions = {
  levelCount: 2,
};

const lodeLoader = {
  levelCount: defaultOptions.levelCount,
  init: function (opts) {
    this.levelCount = opts.levelCount || defaultOptions.levelCount;
  },
  load: async function ({ basePath, artifactName }) {
    const lod = new LOD();
    const lodArtifacts = await Promise.all(
      [...Array(this.levelCount).keys()].map((_, i) =>
        loadGltfAsync(
          `${basePath}/${artifactName}/${artifactName}-lod-${i}/${artifactName}.gltf`
        )
      )
    );

    lodArtifacts.forEach((artifact, i) => {
      lod.addLevel(artifact.scene, i * 15);
    });
    return lod;
  },
};

export default lodeLoader;
