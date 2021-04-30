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

const loadModel = async ({
  lodeConfig,
  manifest,
  ModelBasePath,
  artifactName,
}) => {
  const lod = new LOD();
  const fileIdentifier = `${lodeConfig.outputFoldername}/${ModelBasePath}/${artifactName}.gltf`;
  const config = manifest[fileIdentifier];
  const lodArtifacts = await Promise.all(
    config.levels.map((_, i) => {
      const filePath = `/${lodeConfig.outputFoldername}/${ModelBasePath}/${artifactName}-lod-${i}/${artifactName}.gltf`;
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

export { loadModel };
