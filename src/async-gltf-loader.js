import { GLTFLoader } from "../_snowpack/pkg/three/examples/jsm/loaders/GLTFLoader.js";

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

export default loadGltfAsync;
