import * as THREE from "three";
export function createScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xc9e8f5, 40, 120);
  return scene;
}
