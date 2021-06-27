import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import loadGltfAsync from "./async-gltf-loader";

const renderer = new THREE.WebGLRenderer({ antialias: true });
const $distanceDisplay = document.querySelector("[data-distance-display]");

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.enablePan = false;

// CreateScene function that creates and return the scene
const createScene = async function () {
  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0xffffff);
  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(directionalLight);

  const gltf = await loadGltfAsync("assets/duck/duck.gltf");
  gltf.scene.position.y = -1;
  scene.add(gltf.scene);

  return scene;
};

function render(scene) {
  renderer.render(scene, camera);

  controls.update();
  $distanceDisplay.innerHTML = Math.floor(
    camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
  );
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
