// ─────────────────────────────────────────────────────────────
//  CharacterController
//
//  Owns all input handling, movement, and animation switching.
//  Mascot only loads — CharacterController drives it.
//
//  Usage in main.js:
//    const controller = new CharacterController(mascot)
//    // in loop: controller.update(delta)
// ─────────────────────────────────────────────────────────────

export class CharacterController {
  // ── Config ───────────────────────────────────────────────────
  static WALK_SPEED = 0.08; // world units per frame at 60fps
  static FADE_TIME = 0.25; // animation crossfade seconds

  // ── State ────────────────────────────────────────────────────
  #mascot;
  #keys = { up: false, down: false, left: false, right: false };
  #currentAnim = "";
  #waving = false;

  constructor(mascot) {
    this.#mascot = mascot;
    this.#bindInput();
  }

  // ── Call every frame from main.js ────────────────────────────
  update(delta) {
    if (!this.#mascot.isLoaded) return;

    this.#move();
    this.#updateAnimation();
  }

  // ── Input ────────────────────────────────────────────────────
  #bindInput() {
    const press = (e) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") this.#keys.up = true;
      if (e.code === "ArrowDown" || e.code === "KeyS") this.#keys.down = true;
      if (e.code === "ArrowLeft" || e.code === "KeyA") this.#keys.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") this.#keys.right = true;

      if (e.code === "KeyE" && !this.#waving) {
        this.#waving = true;
        this.#playAnim("wave");
        setTimeout(() => {
          this.#waving = false;
          this.#currentAnim = ""; // force re-evaluate on next frame
        }, 2600);
      }
    };

    const release = (e) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") this.#keys.up = false;
      if (e.code === "ArrowDown" || e.code === "KeyS") this.#keys.down = false;
      if (e.code === "ArrowLeft" || e.code === "KeyA") this.#keys.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD")
        this.#keys.right = false;
    };

    window.addEventListener("keydown", press);
    window.addEventListener("keyup", release);
  }

  // ── Movement ─────────────────────────────────────────────────
  #move() {
    const sp = CharacterController.WALK_SPEED;

    if (this.#keys.up) this.#mascot.group.position.z -= sp;
    if (this.#keys.down) this.#mascot.group.position.z += sp;

    if (this.#keys.left) {
      this.#mascot.group.position.x -= sp;
      this.#mascot.setFacingDirection(-1);
    }
    if (this.#keys.right) {
      this.#mascot.group.position.x += sp;
      this.#mascot.setFacingDirection(1);
    }
  }

  // ── Animation switching ───────────────────────────────────────
  #updateAnimation() {
    if (this.#waving) return;

    const moving =
      this.#keys.up || this.#keys.down || this.#keys.left || this.#keys.right;

    const target = moving ? "walk" : "idle";
    if (target !== this.#currentAnim) {
      this.#playAnim(target);
    }
  }

  // ── Cross-fade between clips ──────────────────────────────────
  //
  //  The animation was "hidden" because of how Three.js blending works:
  //  if you call fadeIn() on a new action without also explicitly
  //  setting its weight and enabling it, the mixer keeps running
  //  the old action at weight 1.0 and the new one never surfaces.
  //
  //  Correct pattern for cross-fading with pre-armed actions:
  //    1. Set incoming weight to 0
  //    2. Enable it
  //    3. reset() — rewind to t=0
  //    4. fadeIn() — ramps weight from 0 → 1 over fadeTime
  //    5. fadeOut() on the outgoing — ramps its weight 1 → 0
  //
  #playAnim(name) {
    const actions = this.#mascot.actions;
    const next = actions[name];

    if (!next) {
      console.warn(`[Controller] No action "${name}"`);
      return;
    }

    const prev = actions[this.#currentAnim];
    const fade = CharacterController.FADE_TIME;

    // Prepare incoming action
    next.enabled = true;
    next.setEffectiveTimeScale(1);
    next.setEffectiveWeight(1);
    next.time = 0;
    next.fadeIn(fade);

    // Fade out previous action
    if (prev && prev !== next) {
      prev.fadeOut(fade);
    }

    this.#currentAnim = name;
    console.log(`[Controller] → "${name}"`);
  }
}
