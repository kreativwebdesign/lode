import * as THREE from "three";

const $distanceDisplay = document.querySelector("[data-distance-display]");

export const updateDistanceDisplay = (camera) => {
  $distanceDisplay.innerHTML = Math.floor(
    camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
  );
};
