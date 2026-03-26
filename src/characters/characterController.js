import * as THREE from "three";

export class CharacterController {
  static SPEED = 4;
  static FADE = 0.25;

  #mascot;
  #keys = {};
  #current = "";
  #waving = false;

  constructor(mascot) {
    this.#mascot = mascot;
    this.#bind();
  }

  update(delta) {
    if (!this.#mascot.isLoaded) return;

    this.#move(delta);
    this.#animate();
  }

  #bind() {
    window.addEventListener("keydown", (e) => {
      this.#keys[e.code] = true;

      if (e.code === "KeyE" && !this.#waving) {
        this.#waving = true;
        this.#play("wave");

        setTimeout(() => {
          this.#waving = false;
          this.#current = "";
        }, 2500);
      }
    });

    window.addEventListener("keyup", (e) => {
      this.#keys[e.code] = false;
    });
  }

  #move(delta) {
    const sp = CharacterController.SPEED * delta;
    const pos = this.#mascot.group.position;

    let dx = 0,
      dz = 0;

    if (this.#keys["KeyW"] || this.#keys["ArrowUp"]) dz -= 1;
    if (this.#keys["KeyS"] || this.#keys["ArrowDown"]) dz += 1;
    if (this.#keys["KeyA"] || this.#keys["ArrowLeft"]) dx -= 1;
    if (this.#keys["KeyD"] || this.#keys["ArrowRight"]) dx += 1;

    if (dx || dz) {
      const len = Math.hypot(dx, dz);
      dx /= len;
      dz /= len;

      pos.x += dx * sp;
      pos.z += dz * sp;

      // ROTATION
      const angle = Math.atan2(dx, dz);
      this.#mascot.group.rotation.y = angle;
    }
  }

  #animate() {
    if (this.#waving) return;

    const moving =
      this.#keys["KeyW"] ||
      this.#keys["KeyS"] ||
      this.#keys["KeyA"] ||
      this.#keys["KeyD"] ||
      this.#keys["ArrowUp"] ||
      this.#keys["ArrowDown"] ||
      this.#keys["ArrowLeft"] ||
      this.#keys["ArrowRight"];

    const target = moving ? "walk" : "idle";

    if (target !== this.#current) {
      this.#play(target);
    }
  }

  #play(name) {
    const next = this.#mascot.actions[name];
    if (!next) return;

    if (this.#current === name) return;

    const prev = this.#mascot.actions[this.#current];

    next.reset();
    next.enabled = true;
    next.play();

    if (prev) {
      prev.crossFadeTo(next, CharacterController.FADE, true);
    }

    this.#current = name;
  }
}
