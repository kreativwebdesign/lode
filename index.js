import * as THREE from "./_snowpack/pkg/three.js";
import { OrbitControls } from "./_snowpack/pkg/three/examples/jsm/controls/OrbitControls.js";
import { measureFPS } from "./src/measure-fps.js";
import loadGltfAsync from "./src/async-gltf-loader.js";
import { getOptimized } from "./src/url-param.js";
import "./src/optimized-toggle.js";
import * as lodeLoader from "./_snowpack/pkg/lode-three.js";
import manifest from "./lode-build/main-lode-config.json.proxy.js";
import lodeConfig from "./lode-cli.config.json.proxy.js";

const useOptimized = getOptimized();

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 125);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 4;
const nonOptimizedGltfBasePath = "assets/";

const lods = [
  { basePath: "assets/duck", name: "duck", position: [30, 0, 0] },
  { basePath: "assets/airplane", name: "airplane", position: [-30, 0, 0] },
  { basePath: "assets/skull", name: "skull", position: [0, 0, 30] },
  { basePath: "assets/dragon", name: "dragon", position: [0, 0, -30] },
];

const setupOptimizedScene = async (scene) => {
  const gltfLods = await Promise.all(
    lods.map((lod) =>
      lodeLoader.loadModel({
        manifest,
        lodeConfig,
        ModelBasePath: lod.basePath,
        artifactName: lod.name,
      })
    )
  );

  gltfLods.forEach((lod, i) => {
    scene.add(lod);
    lod.position.set(...lods[i].position);
  });
};

const setupNonOptimizedScene = async (scene) => {
  const gltfs = await Promise.all(
    lods.map((lod) =>
      loadGltfAsync(`${nonOptimizedGltfBasePath}${lod.name}/${lod.name}.gltf`)
    )
  );
  gltfs.forEach((gltf, i) => {
    scene.add(gltf.scene);
    gltf.scene.position.set(...lods[i].position);
  });
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
    await setupNonOptimizedScene(scene);
  }

  // notify benchmark when scene is set
  console.log("::benchmark::loadedModels");
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
