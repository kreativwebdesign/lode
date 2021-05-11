import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { measureFPS } from "./src/measure-fps";
import loadGltfAsync from "./src/async-gltf-loader";
import { getOptimized } from "./src/url-param";
import "./src/optimized-toggle";
import * as lodeLoader from "lode-three";
import manifest from "./lode-build/lode-manifest.json";

const config = {
  objectCount: 20,
  positionRanges: {
    x: { min: -60, max: 60 },
    y: { min: 0, max: 0 },
    z: { min: -1000, max: 75 },
  },
};

function generateRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomPosition() {
  const { positionRanges } = config;
  const y = generateRandomIntegerInRange(
    positionRanges.y.min,
    positionRanges.y.max
  );
  const z = generateRandomIntegerInRange(
    positionRanges.z.min,
    positionRanges.z.max
  );
  const absoluteZ = -1 * z + positionRanges.z.max;
  const x = generateRandomIntegerInRange(
    positionRanges.x.min - absoluteZ / 1.3,
    positionRanges.x.max + absoluteZ / 1.3
  );
  return [x, y, z];
}

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

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 4;

const lodeContext = lodeLoader.createContext({
  manifest,
  basePath: "./lode-build",
});

const lods = [
  {
    name: "assets/duck",
    scale: [3, 3, 3],
  },
  {
    name: "assets/airplane",
  },
  {
    name: "assets/skull",
  },
  {
    name: "assets/dragon",
  },
  {
    name: "assets/boat",
  },
  {
    name: "assets/armadillo",
  },
  {
    name: "assets/apricot",
  },
  {
    name: "assets/frank",
    scale: [0.05, 0.05, 0.05],
  },
  {
    name: "assets/head",
    scale: [2, 2, 2],
  },
  {
    name: "assets/skull2",
    scale: [3, 3, 3],
  },
  {
    name: "assets/shiba",
    scale: [5, 5, 5],
  },
  {
    name: "assets/human",
    scale: [0.05, 0.05, 0.05],
  },
];

const renderObjects = (scene, objs, selector = (obj) => obj) => {
  objs.map(selector).forEach((obj, i) => {
    for (let j = 0; j < config.objectCount; j++) {
      const clone = obj.clone();
      scene.add(clone);
      clone.position.set(...generateRandomPosition());
      clone.scale.set(...(lods[i].scale || [1, 1, 1]));
    }
  });
};

const setupOptimizedScene = async (scene) => {
  const gltfLods = await Promise.all(
    lods.map((lod) =>
      lodeLoader.loadModel({
        lodeContext,
        artifactName: lod.name,
      })
    )
  );

  renderObjects(scene, gltfLods, (lod) => lod);
};

const setupNonOptimizedScene = async (scene) => {
  const gltfs = await Promise.all(
    lods.map((lod) =>
      loadGltfAsync(`${lod.name}/${lod.name.split("/").pop()}.gltf`)
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
  plane.position.y = -5;
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
