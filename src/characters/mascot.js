import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class Mascot {
  group = new THREE.Group();
  isLoaded = false;

  mixer = null;
  actions = {};
  model = null;

  #loader = new GLTFLoader();

  constructor(scene) {
    scene.add(this.group);
  }

  async load() {
    await this.#loadMaster();
    await this.#loadExtras();
    this.isLoaded = true;

    console.log("[Mascot] FULLY READY");
  }

  update(delta) {
    this.mixer?.update(delta);

    this.group.position.y = 0;
  }

  async #loadMaster() {
    const gltf = await this.#loader.loadAsync(
      "/assets/characters/idle_clean.glb",
    );

    this.model = gltf.scene;
    this.group.add(this.model);

    this.model.scale.setScalar(210);

    this.model.traverse((o) => {
      if (o.isMesh || o.isSkinnedMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(this.model);
    this.model.position.y -= box.min.y;

    this.mixer = new THREE.AnimationMixer(this.model);

    let idleClip = gltf.animations[0].clone();

    idleClip.tracks = idleClip.tracks.filter((track) => {
      return !track.name.includes("position");
    });

    idleClip.name = "idle";

    const idleAction = this.mixer.clipAction(idleClip);
    idleAction.play();

    this.actions.idle = idleAction;

    console.log("[Mascot] Idle fixed");
  }

  async #loadExtras() {
    const extras = {
      walk: "/assets/characters/walk_anim_only.glb",
      wave: "/assets/characters/wave_anim_only.glb",
    };

    for (const [name, path] of Object.entries(extras)) {
      try {
        const gltf = await this.#loader.loadAsync(path);

        if (!gltf.animations.length) continue;

        let clip = gltf.animations[0].clone();

        clip.tracks = clip.tracks.filter((track) => {
          return !track.name.includes("position");
        });

        clip.name = name;

        const action = this.mixer.clipAction(clip);

        action.setLoop(name === "wave" ? THREE.LoopOnce : THREE.LoopRepeat);

        action.clampWhenFinished = name === "wave";
        action.enabled = false;

        this.actions[name] = action;

        console.log(`[Mascot] ${name} ready`);
      } catch (e) {
        console.warn(`[Mascot] FAIL ${name}`, e);
      }
    }
  }
}
