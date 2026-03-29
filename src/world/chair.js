import * as THREE from "three";

const mat = (color, rough = 0.6, metal = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

// ─────────────────────────────────────────────────────────────
//  Chair  —  realistic park bench
//
//  Matches the reference image:
//    • 5 horizontal wooden slats for the seat
//    • 3 horizontal wooden slats for the backrest
//    • Dark metal frame (two side supports + cross bars)
//    • Flat armrests on each side
//    • Correct proportions: wide, low, park-style
// ─────────────────────────────────────────────────────────────

const WOOD = 0x8b4513; // warm brown wood
const WOOD_L = 0xa0522d; // slightly lighter for slats variation
const METAL = 0x2c2c2c; // near-black dark metal frame

export class Chair {
  constructor(scene, x = 0, z = 0, ry = 0) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.group.position.set(x, 0, z);
    this.group.rotation.y = ry;
    this.#build();
  }

  #build() {
    this.#buildFrame();
    this.#buildSeatSlats();
    this.#buildBackSlats();
    this.#buildArmrests();
  }

  // ── Metal frame ───────────────────────────────────────────────
  #buildFrame() {
    const mMat = mat(METAL, 0.4, 0.7);
    const SEAT_H = 0.88; // height of seat surface
    const BACK_H = 1.72; // height of top of backrest
    const W = 1.55; // half-width between legs
    const D = 0.26; // half-depth (front/back leg offset)

    // Two side support profiles (left & right)
    [-W, W].forEach((sx) => {
      // Front leg (straight down from seat front)
      this.#addBox(mMat, 0.07, SEAT_H, 0.07, sx, SEAT_H / 2, D);

      // Back leg (angled — goes from seat back down and from seat back up to backrest)
      // Lower back leg
      this.#addBox(mMat, 0.07, SEAT_H * 0.9, 0.07, sx, SEAT_H * 0.45, -D);

      // Upper back support (from seat level up to backrest top, angled slightly back)
      const backSupportH = BACK_H - SEAT_H + 0.05;
      const bs = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, backSupportH, 0.07),
        mMat,
      );
      bs.position.set(sx, SEAT_H + backSupportH / 2 - 0.02, -D - 0.06);
      bs.rotation.x = 0.13; // slight backward lean
      bs.castShadow = true;
      this.group.add(bs);

      // Foot cross-bar connecting front and back legs at bottom
      this.#addBox(mMat, 0.07, 0.07, D * 2, sx, 0.14, 0);

      // Armrest support post (thin vertical bar inside each side)
      this.#addBox(mMat, 0.055, 0.28, 0.055, sx, SEAT_H + 0.14, D - 0.05);
    });

    // Front cross-bar (connects left and right front legs)
    this.#addBox(mMat, W * 2, 0.07, 0.07, 0, 0.32, D);
    // Rear cross-bar
    this.#addBox(mMat, W * 2, 0.07, 0.07, 0, 0.32, -D);
    // Mid cross-bar under seat
    this.#addBox(mMat, W * 2, 0.07, 0.07, 0, SEAT_H - 0.06, 0);
  }

  // ── Seat slats (5 horizontal wooden planks) ──────────────────
  #buildSeatSlats() {
    const SEAT_H = 0.88;
    const SLAT_W = 3.2; // full width of bench
    const SLAT_H = 0.065; // plank thickness
    const SLAT_D = 0.1; // plank depth (front-to-back)
    const COUNT = 5;
    const TOTAL_D = 0.54; // total depth of seat
    const GAP = TOTAL_D / (COUNT - 1);

    for (let i = 0; i < COUNT; i++) {
      const col = i % 2 === 0 ? WOOD : WOOD_L;
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(SLAT_W, SLAT_H, SLAT_D),
        mat(col, 0.75),
      );
      slat.position.set(0, SEAT_H, -TOTAL_D / 2 + i * GAP);
      slat.castShadow = true;
      slat.receiveShadow = true;
      this.group.add(slat);
    }
  }

  // ── Backrest slats (3 horizontal planks) ─────────────────────
  #buildBackSlats() {
    const SEAT_H = 0.88;
    const SLAT_W = 3.2;
    const SLAT_H = 0.065;
    const SLAT_D = 0.09;
    const COUNT = 3;
    const BACK_X = -0.32; // Z offset (behind seat)

    const heights = [0.14, 0.42, 0.7]; // offsets above seat level

    heights.forEach((h, i) => {
      const col = i % 2 === 0 ? WOOD : WOOD_L;
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(SLAT_W, SLAT_H, SLAT_D),
        mat(col, 0.75),
      );
      slat.position.set(0, SEAT_H + h, BACK_X);
      slat.rotation.x = 0.13; // match back support lean
      slat.castShadow = true;
      slat.receiveShadow = true;
      this.group.add(slat);
    });
  }

  // ── Armrests ──────────────────────────────────────────────────
  #buildArmrests() {
    const SEAT_H = 0.88;
    const W = 1.55;

    [-W, W].forEach((sx) => {
      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.065, 0.58),
        mat(WOOD, 0.7),
      );
      arm.position.set(sx, SEAT_H + 0.27, -0.05);
      arm.castShadow = true;
      this.group.add(arm);
    });
  }

  // ── Helper: add a simple box mesh ────────────────────────────
  #addBox(material, w, h, d, x, y, z) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    return mesh;
  }
}
