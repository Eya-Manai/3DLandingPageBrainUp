import * as THREE from "three";

const DEG = (d) => (d * Math.PI) / 180;

const mat = (color, rough = 0.55, metal = 0, emissive = 0, emI = 0) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: rough,
    metalness: metal,
    emissive,
    emissiveIntensity: emI,
  });

const C = {
  skin: 0xffcca0,
  skinDark: 0xf0b090,
  hair: 0x3d2b1f,
  shirt: 0x1a8fe3,
  shirtDark: 0x0d7bc8,
  pants: 0x2e3568,
  pantsDark: 0x1e2550,
  shoe: 0x1a1a2a,
  backpack: 0xf37933,
  backpackDrk: 0xcc6010,
  capBadge: 0xffcc00,
  eyeWhite: 0xffffff,
  iris: 0x4a8fd8,
  pupil: 0x1a1a2e,
  brow: 0x3d2b1f,
  cheek: 0xff8a6e,
};

export class Mascot {
  group;

  leftArmPivot;
  rightArmPivot;
  leftLegPivot;
  rightLegPivot;
  headGroup;

  pupilL;
  pupilR;
  browL;
  browR;

  #scene;

  constructor(scene) {
    this.#scene = scene;
    this.group = new THREE.Group();
    this.group.name = "mascot";
    this.#build();
    scene.add(this.group);
  }

  setPosition(x, y, z) {
    this.group.position.set(x, y, z);
  }

  setScale(s) {
    this.group.scale.setScalar(s);
  }

  setFacingDirection(dir) {
    this.group.scale.x =
      dir >= 0 ? Math.abs(this.group.scale.x) : -Math.abs(this.group.scale.x);
  }

  #build() {
    this.#buildBackpack();
    this.#buildLeftArm();
    this.#buildLegs();
    this.#buildTorso();
    this.#buildRightArm();
    this.#buildNeckAndHead();
  }

  #buildBackpack() {
    const g = new THREE.Group();
    g.name = "backpack";

    const bag = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.38, 0.12),
      mat(C.backpack, 0.7),
    );
    bag.position.set(0.22, 1.22, -0.22);
    bag.castShadow = true;
    g.add(bag);

    const flap = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.1, 0.1),
      mat(C.backpackDrk, 0.7),
    );
    flap.position.set(0.22, 1.44, -0.2);
    g.add(flap);

    const strapV = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.32, 6),
      mat(C.backpackDrk, 0.8),
    );
    strapV.position.set(0.22, 1.22, -0.16);
    g.add(strapV);

    const strapH = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.22, 6),
      mat(C.backpackDrk, 0.8),
    );
    strapH.rotation.z = DEG(90);
    strapH.position.set(0.22, 1.22, -0.16);
    g.add(strapH);

    this.group.add(g);
  }

  #buildLeftArm() {
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.name = "leftArmPivot";
    this.leftArmPivot.position.set(-0.42, 1.52, 0);

    const upperArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.085, 0.28, 6, 8),
      mat(C.skin, 0.65),
    );
    upperArm.position.set(0, -0.22, 0);
    upperArm.castShadow = true;
    this.leftArmPivot.add(upperArm);

    const hand = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 12, 12),
      mat(C.skin, 0.65),
    );
    hand.position.set(0, -0.5, 0);
    this.leftArmPivot.add(hand);

    this.group.add(this.leftArmPivot);
  }

  #buildLegs() {
    const hipY = 0.82;
    const hipOffX = 0.16;

    this.leftLegPivot = new THREE.Group();
    this.leftLegPivot.name = "leftLegPivot";
    this.leftLegPivot.position.set(-hipOffX, hipY, 0);

    const leftThigh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.1, 0.36, 6, 8),
      mat(C.pants, 0.7),
    );
    leftThigh.position.set(0, -0.28, 0);
    leftThigh.castShadow = true;
    this.leftLegPivot.add(leftThigh);

    const leftShoe = this.#makeShoe();
    leftShoe.position.set(0, -0.58, 0.05);
    this.leftLegPivot.add(leftShoe);

    this.group.add(this.leftLegPivot);

    this.rightLegPivot = new THREE.Group();
    this.rightLegPivot.name = "rightLegPivot";
    this.rightLegPivot.position.set(hipOffX, hipY, 0);

    const rightThigh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.1, 0.36, 6, 8),
      mat(C.pants, 0.7),
    );
    rightThigh.position.set(0, -0.28, 0);
    rightThigh.castShadow = true;
    this.rightLegPivot.add(rightThigh);

    const rightShoe = this.#makeShoe();
    rightShoe.position.set(0, -0.58, 0.05);
    this.rightLegPivot.add(rightShoe);

    this.group.add(this.rightLegPivot);
  }

  #makeShoe() {
    const g = new THREE.Group();

    const sole = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 8),
      mat(C.shoe, 0.8),
    );
    sole.scale.set(0.85, 0.45, 1.45);
    g.add(sole);

    const shine = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 8, 8),
      mat(0xffffff, 0.3, 0, 0xffffff, 0.25),
    );
    shine.position.set(-0.03, 0.04, 0.1);
    g.add(shine);

    return g;
  }

  #buildTorso() {
    const g = new THREE.Group();
    g.name = "torso";

    const shirt = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.34, 0.55, 8, 16),
      mat(C.shirt, 0.65),
    );
    shirt.position.set(0, 1.22, 0);
    shirt.castShadow = true;
    g.add(shirt);

    const collarL = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.16, 0.04),
      mat(0xffffff, 0.4),
    );
    collarL.position.set(-0.06, 1.52, 0.3);
    collarL.rotation.z = DEG(20);
    g.add(collarL);

    const collarR = collarL.clone();
    collarR.position.set(0.06, 1.52, 0.3);
    collarR.rotation.z = DEG(-20);
    g.add(collarR);

    const badge = new THREE.Mesh(
      new THREE.CircleGeometry(0.1, 16),
      mat(0xffffff, 0.4, 0, 0xffffff, 0.1),
    );
    badge.position.set(-0.19, 1.28, 0.35);
    g.add(badge);

    this.group.add(g);
  }

  #buildRightArm() {
    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.name = "rightArmPivot";
    this.rightArmPivot.position.set(0.42, 1.52, 0);

    const upperArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.085, 0.28, 6, 8),
      mat(C.skin, 0.65),
    );
    upperArm.position.set(0, -0.22, 0);
    upperArm.castShadow = true;
    this.rightArmPivot.add(upperArm);

    const hand = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 12, 12),
      mat(C.skin, 0.65),
    );
    hand.position.set(0, -0.5, 0);
    this.rightArmPivot.add(hand);

    this.group.add(this.rightArmPivot);
  }

  #buildNeckAndHead() {
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.12, 0.15, 10),
      mat(C.skin, 0.65),
    );
    neck.position.set(0, 1.65, 0);
    this.group.add(neck);

    this.headGroup = new THREE.Group();
    this.headGroup.name = "headGroup";
    this.headGroup.position.set(0, 1.9, 0);
    this.group.add(this.headGroup);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.36, 32, 24),
      mat(C.skin, 0.65),
    );
    head.scale.set(1.08, 1.0, 1.0);
    head.castShadow = true;
    this.headGroup.add(head);

    this.#buildEars();
    this.#buildHair();
    this.#buildFace();
    this.#buildCap();
  }

  #buildEars() {
    const earGeo = new THREE.SphereGeometry(0.1, 10, 10);
    earGeo.scale(0.85, 1.1, 0.6); // flatten into ear shape

    const earMat = mat(C.skin, 0.65);
    const innerMat = mat(C.skinDark, 0.7);

    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(earGeo, earMat);
      ear.position.set(side * 0.38, 0, 0);
      this.headGroup.add(ear);

      const inner = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 8, 8),
        innerMat,
      );
      inner.scale.set(0.7, 0.9, 0.5);
      inner.position.set(side * 0.42, 0, 0);
      this.headGroup.add(inner);
    }
  }

  #buildHair() {
    const hairMat = mat(C.hair, 0.85);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.375, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.6),
      hairMat,
    );
    dome.position.set(0, 0.04, -0.02);
    dome.castShadow = true;
    this.headGroup.add(dome);

    for (const side of [-1, 1]) {
      const tuft = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 10, 10),
        hairMat,
      );
      tuft.scale.set(0.9, 1.3, 0.7);
      tuft.position.set(side * 0.34, 0.16, -0.05);
      this.headGroup.add(tuft);
    }
  }

  #buildFace() {
    const eyeWhiteGeo = new THREE.SphereGeometry(0.085, 16, 12);
    const eyeWhiteMat = mat(C.eyeWhite, 0.2);

    const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeL.position.set(-0.13, 0.02, 0.32);
    eyeL.scale.set(1, 1.15, 0.6);
    this.headGroup.add(eyeL);

    const eyeR = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat.clone());
    eyeR.position.set(0.13, 0.02, 0.32);
    eyeR.scale.set(1, 1.15, 0.6);
    this.headGroup.add(eyeR);

    const irisGeo = new THREE.SphereGeometry(0.052, 14, 10);
    const irisMat = mat(C.iris, 0.3);

    const irisL = new THREE.Mesh(irisGeo, irisMat);
    irisL.position.set(-0.13, 0.02, 0.365);
    irisL.scale.set(1, 1, 0.55);
    this.headGroup.add(irisL);

    const irisR = new THREE.Mesh(irisGeo, irisMat.clone());
    irisR.position.set(0.13, 0.02, 0.365);
    irisR.scale.set(1, 1, 0.55);
    this.headGroup.add(irisR);

    const pupilGeo = new THREE.SphereGeometry(0.03, 10, 8);
    const pupilMat = mat(C.pupil, 0.1);

    this.pupilL = new THREE.Mesh(pupilGeo, pupilMat);
    this.pupilL.position.set(-0.13, 0.02, 0.39);
    this.pupilL.scale.set(1, 1, 0.4);
    this.headGroup.add(this.pupilL);

    this.pupilR = new THREE.Mesh(pupilGeo, pupilMat.clone());
    this.pupilR.position.set(0.13, 0.02, 0.39);
    this.pupilR.scale.set(1, 1, 0.4);
    this.headGroup.add(this.pupilR);

    const shineMat = mat(0xffffff, 0.0, 0, 0xffffff, 1.2);
    const shineGeo = new THREE.SphereGeometry(0.016, 8, 6);
    for (const x of [-0.115, 0.145]) {
      const shine = new THREE.Mesh(shineGeo, shineMat);
      shine.position.set(x, 0.055, 0.4);
      this.headGroup.add(shine);
    }

    const browGeo = new THREE.CapsuleGeometry(0.012, 0.1, 4, 6);
    const browMat = mat(C.brow, 0.9);

    this.browL = new THREE.Mesh(browGeo, browMat);
    this.browL.position.set(-0.13, 0.115, 0.33);
    this.browL.rotation.z = DEG(-10);
    this.browL.scale.set(1, 1, 0.5);
    this.headGroup.add(this.browL);

    this.browR = new THREE.Mesh(browGeo, browMat.clone());
    this.browR.position.set(0.13, 0.115, 0.33);
    this.browR.rotation.z = DEG(10);
    this.browR.scale.set(1, 1, 0.5);
    this.headGroup.add(this.browR);

    const nose = new THREE.Mesh(
      new THREE.SphereGeometry(0.038, 10, 8),
      mat(C.skinDark, 0.7),
    );
    nose.scale.set(1, 0.7, 0.9);
    nose.position.set(0, -0.04, 0.355);
    this.headGroup.add(nose);

    const mouth = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.018, 8, 16, Math.PI),
      mat(0xc0724a, 0.7),
    );
    mouth.position.set(0, -0.1, 0.34);
    mouth.rotation.z = DEG(180);
    mouth.scale.z = 0.4;
    this.headGroup.add(mouth);

    const cheekGeo = new THREE.SphereGeometry(0.075, 10, 8);
    const cheekMat = mat(C.cheek, 0.9, 0, C.cheek, 0.15);

    for (const side of [-1, 1]) {
      const cheek = new THREE.Mesh(cheekGeo, cheekMat.clone());
      cheek.scale.set(1.1, 0.65, 0.35);
      cheek.position.set(side * 0.22, -0.06, 0.3);
      this.headGroup.add(cheek);
    }
  }

  #buildCap() {
    const capMat = mat(C.shirt, 0.6);
    const capDarkMat = mat(C.shirtDark, 0.6);

    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(0.37, 0.38, 0.14, 24),
      capMat,
    );
    band.position.set(0, 0.22, 0);
    this.headGroup.add(band);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
      capMat,
    );
    dome.position.set(0, 0.28, 0);
    this.headGroup.add(dome);

    const brim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.04, 24),
      capDarkMat,
    );
    brim.position.set(-0.12, 0.2, 0.22);
    brim.rotation.z = DEG(-10);
    brim.rotation.x = DEG(-18);
    this.headGroup.add(brim);

    const badge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.03, 16),
      mat(C.capBadge, 0.4, 0.3),
    );
    badge.position.set(0, 0.34, 0.28);
    badge.rotation.x = DEG(-25);
    this.headGroup.add(badge);
  }
}
