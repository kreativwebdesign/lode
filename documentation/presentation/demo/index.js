import loadGltfAsync from "./async-gltf-loader";
import { updateDistanceDisplay } from "./src/distance-display";
import {
  setupRenderer,
  setupCamera,
  setupControls,
  setupScene,
} from "./src/helper";

const renderer = setupRenderer();
const camera = setupCamera();
const controls = setupControls(camera, renderer);

const createScene = async function () {
  const scene = setupScene();

  const gltf = await loadGltfAsync("assets/shiba/shiba.gltf");
  scene.add(gltf.scene);

  return scene;
};

function render(scene) {
  renderer.render(scene, camera);

  controls.update();
  updateDistanceDisplay(camera);
}

const main = async () => {
  const scene = await createScene();
  renderer.setAnimationLoop(() => render(scene));

  // the canvas/window resize event handler
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render(scene);
  });
};

main();
