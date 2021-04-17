import { GLTFLoader } from "../_snowpack/pkg/three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export const loadGltf = (scene, gltfPath, position, scale) => {
  let resolve = null;
  const promise = new Promise((res) => {
    resolve = res;
  });
  loader.load(
    gltfPath,
    // called when the resource is loaded
    function (gltf) {
      scene.add(gltf.scene);
      gltf.scene.scale.set(...scale);
      gltf.scene.position.set(...position);
      resolve();
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
    }
  );
  return promise;
};

export const loadGltfs = (scene, gltfs) => {
  return Promise.all(
    gltfs.map((gltf) =>
      loadGltf(scene, gltf.gltfPath, gltf.position, gltf.scale)
    )
  );
};
