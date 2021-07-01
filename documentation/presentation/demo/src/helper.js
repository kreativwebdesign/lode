import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const setupRenderer = () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
};

export const setupCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 0, 5);
  return camera;
};

export const setupControls = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false;
  controls.enablePan = false;
  return controls;
};

export const setupScene = () => {
  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0xffffff);
  const light = new THREE.AmbientLight(0xffffff);
  scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(directionalLight);
  return scene;
};
