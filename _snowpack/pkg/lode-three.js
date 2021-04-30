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

const createContext = ({ basePath, manifest }) => ({
  basePath,
  manifest,
});

const loadModel = async ({ artifactName, lodeContext }) => {
  const lod = new LOD();
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

export { createContext, loadModel };
