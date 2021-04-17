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

camera.position.set(0, 0, 30);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 4;

const optimizedGltfBasePath = "./lode-build/assets/";
const nonOptimizedGltfBasePath = "assets/";

const lods = [
  { name: "duck", position: [20, 0, 0] },
  { name: "airplane", position: [-20, 0, 0] },
  { name: "camera", position: [0, 0, 20] },
  { name: "dragon", position: [0, 0, -20] },
];

const setupOptimizedScene = async (scene) => {
  const gltfLods = await Promise.all(
    lods.map((lod) =>
      getLod(2, `${optimizedGltfBasePath}${lod.name}`, lod.name)
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
