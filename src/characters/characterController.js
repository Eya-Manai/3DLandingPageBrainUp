import * as THREE from "three";

export class CharacterController {
  static SPEED = 4;
  static FADE = 0.25;

  static DOOR_X = 0;
  static DOOR_Z = -2.925;
  static DOOR_RANGE = 1.8;

  #mascot;
  #keys = {};
  #current = "";
  #waving = false;

  #onDoorEnter = null;
  #doorTriggered = false;

  constructor(mascot) {
    this.#mascot = mascot;
    this.#bind();
  }

  onDoorEnter(fn) {
    this.#onDoorEnter = fn;
  }

  update(delta) {
    if (!this.#mascot.isLoaded) return;
    this.#move(delta);
    this.#animate();
    this.#checkDoor();
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

      const angle = Math.atan2(dx, dz);
      this.#mascot.group.rotation.y = angle;
    }
  }
  #animate() {
    const moving =
      this.#keys["KeyW"] ||
      this.#keys["KeyS"] ||
      this.#keys["KeyA"] ||
      this.#keys["KeyD"] ||
      this.#keys["ArrowUp"] ||
      this.#keys["ArrowDown"] ||
      this.#keys["ArrowLeft"] ||
      this.#keys["ArrowRight"];

    if (moving) {
      if (this.#waving) {
        this.#waving = false;
      }

      if (this.#current !== "walk") {
        this.#play("walk");
      }

      return;
    }

    if (this.#waving) return;

    if (this.#current !== "idle") {
      this.#play("idle");
    }
  }

  #play(name) {
    const next = this.#mascot.actions[name];
    if (!next) return;
    if (this.#current === name) return;

    const prev = this.#mascot.actions[this.#current];

    next.reset();
    next.enabled = true;
    next.setEffectiveWeight(1);
    next.setEffectiveTimeScale(1);
    next.fadeIn(CharacterController.FADE);
    next.play();

    if (prev) {
      prev.fadeOut(CharacterController.FADE);
    }

    this.#current = name;
  }
  playWaveIntro() {
    this.#waving = true;
    this.#play("wave");

    setTimeout(() => {
      if (this.#waving) {
        this.#waving = false;
        this.#play("idle");
      }
    }, 5000);
  }
  #checkDoor() {
    if (this.#doorTriggered) return;
    if (!this.#onDoorEnter) return;
    const pos = this.#mascot.group.position;
    const dx = pos.x - CharacterController.DOOR_X;
    const dz = pos.z - CharacterController.DOOR_Z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < CharacterController.DOOR_RANGE) {
      this.#doorTriggered = true;
      this.#onDoorEnter();
    }
  }
}
