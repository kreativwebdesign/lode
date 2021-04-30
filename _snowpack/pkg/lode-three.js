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
  manifest,
  relativePathToLodeOutputFolder,
  modelBasePath,
  artifactName,
}) => {
  const lod = new LOD();
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

export { loadModel };
