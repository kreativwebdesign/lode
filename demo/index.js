import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();

// define custom nodes based on flag
const useOptimized = window.location.search.includes("optimize");

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 5, 10);

const controls = new OrbitControls(camera, renderer.domElement);

const loadGltf = (scene, gltfPath, position, scale) => {
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

// CreateScene function that creates and return the scene
const createScene = function () {
  // Create a basic BJS Scene object
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbbbbbb);
  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}

  console.log("optimized: " + useOptimized);

  performance.mark("gltfLoadStart");

  const light = new THREE.AmbientLight(0xffffff); // soft white light
  scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  scene.add(directionalLight);

  Promise.all([
    loadGltf(
      scene,
      `assets/Shoe/Shoe-${useOptimized ? "LOD1" : "LOD0"}.gltf`,
      [-5, 0, 0],
      [20, 20, 20]
    ),
    loadGltf(
      scene,
      `assets/Avocado/Avocado-${useOptimized ? "LOD1" : "LOD0"}.gltf`,
      [0, -5, 0],
      [20, 20, 20]
    ),
    loadGltf(
      scene,
      `assets/DamagedHelmet/DamagedHelmet-${
        useOptimized ? "LOD1" : "LOD0"
      }.gltf`,
      [5, 0, 0],
      [2, 2, 2]
    ),
    loadGltf(
      scene,
      `assets/SciFiHelmet/SciFiHelmet-${useOptimized ? "LOD1" : "LOD0"}.gltf`,
      [0, 5, 0],
      [2, 2, 2]
    ),
  ]).then(() => {
    performance.mark("gltfLoadEnd");
    performance.measure("modelLoading", "gltfLoadStart", "gltfLoadEnd");
  });
  // Return the created scene
  return scene;
};

// call the createScene function
const scene = createScene();

let lastCalledTime;

function measureFPS() {
  if (!lastCalledTime) {
    lastCalledTime = performance.now();
    return 0;
  }
  const delta = (performance.now() - lastCalledTime) / 1000;
  lastCalledTime = performance.now();
  return 1 / delta;
}

// run the render loop
function render() {
  performance.mark("renderLoopStart");
  renderer.render(scene, camera);
  controls.update();
  performance.mark("renderLoopEnd");
  performance.measure("renderLoop", "renderLoopStart", "renderLoopEnd");
  console.log("::benchmark::fps::" + measureFPS());
}

renderer.setAnimationLoop(render);
// the canvas/window resize event handler
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
});

// for inspector: https://chrome.google.com/webstore/detail/threejs-inspector/
window.scene = scene;
window.THREE = THREE;
