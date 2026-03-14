import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class Mascot {
  group = new THREE.Group();
  isLoaded = false;

  #scene;
  #loader = new GLTFLoader();

  constructor(scene) {
    this.#scene = scene;
    this.group.name = "mascot";
    scene.add(this.group);
  }

  async load() {
    await this.#loadCharacter();
    this.isLoaded = true;
    console.log("[Mascot] Character loaded");
  }

  async #loadCharacter() {
    const gltf = await this.#loader.loadAsync("/assets/characters/scene.gltf");

    const model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const oldMaterial = child.material;

        child.material = new THREE.MeshStandardMaterial({
          map: oldMaterial.map || null,
          color: 0xffffff,
        });
      }
    });

    model.scale.set(2, 2, 2);
    model.position.set(0, 2, 10);

    this.group.add(model);
  }
  #load(path) {
    return new Promise((resolve, reject) => {
      this.#loader.load(path, resolve, undefined, reject);
    });
  }
}
