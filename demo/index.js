import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getLod } from "./src/gltf-loader";
import { measureFPS } from "./src/measure-fps";
import loadGltfAsync from "./src/async-gltf-loader";

const useOptimized = window.location.search.includes("optimize");

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 10);

const controls = new OrbitControls(camera, renderer.domElement);

const setupOptimizedScene = async (scene) => {
  const duckLod = await getLod(2, "../lode-build/assets/Duck", "duck");
  scene.add(duckLod);

  const airplaneLod = await getLod(
    2,
    "../lode-build/assets/Airplane",
    "airplane"
  );
  scene.add(airplaneLod);
  airplaneLod.levels.forEach((level) => {
    level.object.position.set(5, 0, 0);
    level.object.scale.set(0.01, 0.01, 0.01);
  });

  const cameraLod = await getLod(2, "../lode-build/assets/Camera", "camera");
  scene.add(cameraLod);
  cameraLod.levels.forEach((level) => {
    level.object.position.set(-5, 0, 0);
    level.object.scale.set(1, 1, 1);
  });

  const dragonLod = await getLod(2, "../lode-build/assets/Dragon", "dragon");
  scene.add(dragonLod);
  dragonLod.levels.forEach((level) => {
    level.object.position.set(0, -5, 0);
    level.object.scale.set(0.5, 0.5, 0.5);
  });
};

const setupNonOptimizedScene = async (scene) => {
  const duckGltf = await loadGltfAsync("assets/Duck/duck.gltf");
  scene.add(duckGltf.scene);

  const airplaneGltf = await loadGltfAsync("assets/Airplane/Airplane.gltf");
  scene.add(airplaneGltf.scene);
  airplaneGltf.scene.position.set(5, 0, 0);
  airplaneGltf.scene.scale.set(0.01, 0.01, 0.01);

  const cameraGltf = await loadGltfAsync("assets/Camera/camera.gltf");
  scene.add(cameraGltf.scene);
  cameraGltf.scene.position.set(-5, 0, 0);
  cameraGltf.scene.scale.set(1, 1, 1);

  const dragonGltf = await loadGltfAsync("assets/Dragon/dragon.gltf");
  scene.add(dragonGltf.scene);
  dragonGltf.scene.position.set(0, -5, 0);
  dragonGltf.scene.scale.set(0.5, 0.5, 0.5);
};

// CreateScene function that creates and return the scene
const createScene = async function () {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbbbbbb);

  performance.mark("gltfLoadStart");

  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  scene.add(directionalLight);

  if (useOptimized) {
    await setupOptimizedScene(scene);
  } else {
    setupNonOptimizedScene(scene);
  }

  performance.mark("gltfLoadEnd");
  performance.measure("modelLoading", "gltfLoadStart", "gltfLoadEnd");
  // Return the created scene
  return scene;
};

function render(scene) {
  performance.mark("renderLoopStart");
  renderer.render(scene, camera);
  controls.update();
  performance.mark("renderLoopEnd");
  performance.measure("renderLoop", "renderLoopStart", "renderLoopEnd");
  console.log("::benchmark::fps::" + measureFPS());
}

const main = async () => {
  const scene = await createScene();
  renderer.setAnimationLoop(() => render(scene));

  // for inspector: https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi
  window.scene = scene;
  window.THREE = THREE;

  // the canvas/window resize event handler
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render(scene);
  });
};

main();
