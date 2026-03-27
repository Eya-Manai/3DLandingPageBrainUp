import * as THREE from "three";

const DEG = (d) => (d * Math.PI) / 180;
const mat = (color, rough = 0.5, metal = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

export class FlowerBed {
  constructor(scene, x, z, count = 12) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.build(count);
    this.group.position.set(x, 0, z);
  }

  build(count) {
    const soil = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.12, 1.6),
      mat(0xcbbd93, 0.95),
    );
    this.group.add(soil);

    const colors = [
      0xff6b6b, 0xffd700, 0xff69b4, 0xffffff, 0xff8c00, 0xa855f7, 0x00ccff,
    ];

    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const stemH = 0.28 + Math.random() * 0.14;

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, stemH, 5),
        mat(0x2d6a1a, 0.8),
      );
      const px = (Math.random() - 0.5) * 2.5;
      const pz = (Math.random() - 0.5) * 1.3;
      stem.position.set(px, stemH / 2 + 0.06, pz);
      this.group.add(stem);

      const flower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.13, 0.04, 6),
        mat(color, 0.6),
      );
      flower.position.set(px, stemH + 0.08, pz);
      this.group.add(flower);

      const centre = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 6, 6),
        mat(0xffec80, 0.4),
      );
      centre.position.set(px, stemH + 0.1, pz);
      this.group.add(centre);
    }
  }
}
