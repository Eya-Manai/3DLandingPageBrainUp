import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ─────────────────────────────────────────────────────────────
//  Mascot  —  CORRECT SCALE VERSION
//
//  Why scale=100 (not 1.0, not 0.01):
//
//  Your GLB has TWO compounding scale factors:
//    1. Armature node: scale=[0.01, 0.01, 0.01]  (baked by Blender)
//    2. Bone translations: in centimetres (Hips at 1.45cm, etc.)
//
//  So the character at model.scale=1.0 is:
//    bones_in_cm × armature_scale(0.01) = 0.0056 world units = 5.6mm
//
//  To reach 1.7m (world units) we need to multiply by:
//    1.7 / 0.0056 ≈ 300
//
//  We use scale=100 as a round number — gives ~56cm character height
//  which looks right for a child in your scene scale.
//  If too small, increase. If too large, decrease.
// ─────────────────────────────────────────────────────────────

export class Mascot {
  group = new THREE.Group();
  isLoaded = false;

  mixer = null;
  actions = {};
  model = null;

  #loader = new GLTFLoader();

  constructor(scene) {
    this.group.name = "mascot";
    scene.add(this.group);
  }

  async load() {
    await this.#loadMaster();
    await this.#loadExtraClips();
    this.isLoaded = true;
    console.log(
      "[Mascot] Ready. Actions:",
      Object.keys(this.actions).join(", "),
    );
  }

  update(delta) {
    this.mixer?.update(delta);
  }

  setFacingDirection(dir) {
    const s = Math.abs(this.group.scale.x);
    this.group.scale.x = dir >= 0 ? s : -s;
  }

  async #loadMaster() {
    const gltf = await this.#loader.loadAsync(
      "/assets/characters/idle_clean.glb",
    );
    this.model = gltf.scene;

    this.model.traverse((node) => {
      if (node.isSkinnedMesh || node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.frustumCulled = false;
      }
    });

    this.model.scale.setScalar(210);
    this.group.add(this.model);

    // Ground: lift feet to Y=0
    const box = new THREE.Box3().setFromObject(this.model);
    this.model.position.y -= box.min.y;

    const h = (box.max.y - box.min.y).toFixed(2);
    console.log(`[Mascot] Visible! Height = ${h} world units`);

    this.mixer = new THREE.AnimationMixer(this.model);
    const clip = gltf.animations[0].clone();
    clip.name = "idle";
    const action = this.mixer.clipAction(clip, this.model);
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.enabled = true;
    action.setEffectiveWeight(1);
    action.play();
    this.actions.idle = action;

    console.log("[Mascot] Master loaded — idle playing");
  }

  async #loadExtraClips() {
    const extras = {
      walk: "/assets/characters/walk_anim_only.glb",
      wave: "/assets/characters/wave_anim_only.glb",
    };

    for (const [name, path] of Object.entries(extras)) {
      try {
        const gltf = await this.#loader.loadAsync(path);

        if (!gltf.animations.length) {
          console.warn(`[Mascot] No animation in ${path}`);
          continue;
        }

        const clip = gltf.animations[0].clone();
        clip.name = name;

        const action = this.mixer.clipAction(clip, this.model);
        action.setLoop(
          name === "wave" ? THREE.LoopOnce : THREE.LoopRepeat,
          Infinity,
        );
        if (name === "wave") action.clampWhenFinished = true;

        action.enabled = true;
        action.setEffectiveWeight(0);
        action.play();

        this.actions[name] = action;
        console.log(`[Mascot] "${name}" armed — ${clip.tracks.length} tracks`);
      } catch (err) {
        console.warn(`[Mascot] Failed "${name}":`, err.message);
      }
    }
  }
}
