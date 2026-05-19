import * as THREE from "three";

const state = {
  camera: null as THREE.PerspectiveCamera | null,
  sphereRotation: 0,
  sphereCenter: new THREE.Vector3(0, 0, 0),
  sunScreenX: 0,
  sunScreenY: 0,
  spinPaused: false,
};

export function useSceneSync() {
  return state;
}
