import * as THREE from "three";
import { measureFPS } from "./src/measure-fps";
import loadGltfAsync from "./src/async-gltf-loader";
import generateRandomPosition from "./src/generate-random-position";
import { getOptimized } from "./src/url-param";
import "./src/optimized-toggle";
import * as lodeLoader from "lode-three";
import manifest from "./lode-build/lode-manifest.json";
import models from "./src/models";

const config = {
  objectCount: 30,
  positionRanges: {
    x: { min: -60, max: 60 },
    y: { min: 0, max: 0 },
    z: { min: -800, max: 75 },
  },
  cameraConstraints: {
    max: 125,
    min: -400,
  },
};

const useOptimized = getOptimized();

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 50, 125);

const lodeContext = lodeLoader.createContext({
  manifest,
  basePath: "./lode-build",
});

const renderObjects = (scene, objs, selector = (obj) => obj) => {
  objs.map(selector).forEach((obj, i) => {
    for (let j = 0; j < config.objectCount; j++) {
      const clone = obj.clone();
      scene.add(clone);
      clone.position.set(...generateRandomPosition(config));
      clone.scale.set(...(models[i].scale || [1, 1, 1]));
      clone.rotation.set(...(models[i].rotation || [0, 0, 0]));
    }
  });
};

const setupOptimizedScene = async (scene) => {
  const gltfLods = await Promise.all(
    models.map((model) =>
      lodeLoader.loadModel({
        lodeContext,
        artifactName: model.name,
      })
    )
  );

  renderObjects(scene, gltfLods, (lod) => lod);
};

const setupNonOptimizedScene = async (scene) => {
  const gltfs = await Promise.all(
    models.map((model) =>
      loadGltfAsync(`${model.name}/${model.name.split("/").pop()}.gltf`)
    )
  );
  renderObjects(scene, gltfs, (gltf) => gltf.scene);
};

// CreateScene function that creates and return the scene
const createScene = async function () {
  const scene = new THREE.Scene();

  performance.mark("gltfLoadStart");

  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(directionalLight);

  if (useOptimized) {
    await setupOptimizedScene(scene);
  } else {
    await setupNonOptimizedScene(scene);
  }

  const geometry = new THREE.PlaneGeometry(100000, 100000);
  const loader = new THREE.TextureLoader();
  const groundTexture = loader.load("assets/grass.jpeg");
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(1000, 1000);
  groundTexture.anisotropy = 16;
  groundTexture.encoding = THREE.sRGBEncoding;
  const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
  const plane = new THREE.Mesh(geometry, groundMaterial);

  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -7;
  scene.add(plane);

  const texture = loader.load("assets/background.jpg", () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
  });

  // notify benchmark when scene is set
  console.log("::benchmark::loadedModels");
  performance.mark("gltfLoadEnd");
  performance.measure("modelLoading", "gltfLoadStart", "gltfLoadEnd");
  // Return the created scene
  return scene;
};

let timeSinceLastUpdate = performance.now();
let direction = -1;
function updateCameraPosition() {
  const delta = performance.now() - timeSinceLastUpdate;
  camera.position.z += (delta / 60) * direction;
  timeSinceLastUpdate = performance.now();
  if (camera.position.z > config.cameraConstraints.max) {
    direction = -1;
  } else if (camera.position.z < config.cameraConstraints.min) {
    direction = 1;
  }
}

function render(scene) {
  performance.mark("renderLoopStart");
  renderer.render(scene, camera);
  //controls.update();
  updateCameraPosition();
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
