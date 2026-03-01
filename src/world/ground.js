import * as THREE from "three";

const DEG = (d) => (d * Math.PI) / 180;
const mat = (color, rough = 0.5, metal = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  mat(0x6b8c3e, 0.9),
);

export class Ground {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);
    this.build();
  }

  build() {
    this.buildGrass();
    this.buildWalkway();
    this.buildWalkWayDashes();
    this.buildSidePatches();
  }

  buildGrass() {
    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      mat(0x6b8c3e, 0.9),
    );
    grass.rotation.x = -DEG(90);
    grass.receiveShadow = true;
    this.group.add(grass);
  }
  buildWalkway() {
    const walkway = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.05, 60),
      mat(0xd4c5a0, 0.8),
    );
    walkway.position.set(0, 0.02, 10);
    walkway.receiveShadow = true;
    this.group.add(walkway);
  }
  buildWalkWayDashes() {
    const dashGeo = new THREE.BoxGeometry(0.2, 0.06, 0.8);
    const dashMat = mat(0xffffff, 0.7);
    for (let i = -18; i < 20; i += 3) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.position.set(0, 0.03, i);
      this.group.add(dash);
    }
  }
  buildSidePatches() {
    const patchGeo = new THREE.PlaneGeometry(30, 40);
    const patchMat = mat(0x567a2e, 0.9);
    const patchLeft = new THREE.Mesh(patchGeo, patchMat);
    patchLeft.rotation.x = -DEG(90);
    patchLeft.position.set(-18, 0.01, 5);
    this.group.add(patchLeft);
    const patchRight = patchLeft.clone();
    patchRight.position.set(18, 0.01, 5);
    this.group.add(patchRight);
  }
}
