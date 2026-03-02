const DEG = (d) => (d * Math.PI) / 180;
const mat = (color, rough = 0.6, metal = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
export class Mascot {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.build();
    scene.add(this.group);
  }

  setPosition(x, y, z) {
    this.group.position.set(x, y, z);
  }

  build() {}
  buildBody() {}
}
