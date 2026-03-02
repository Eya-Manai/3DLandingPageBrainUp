import * as THREE from "three";

const mat = (color, rough = 0.5, metal = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

export class Tree {
  constructor(scene, x = 0, z = 0) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);
    this.group.position.set(x, 0, z);
    this.build();
  }

  build() {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.4, 2, 6),
      mat(0x8b4513, 0.8),
    );
    trunk.position.y = 1;
    trunk.castShadow = true;
    this.group.add(trunk);

    const leafGeo = new THREE.ConeGeometry(2, 3, 8);
    for (let i = 0; i < 3; i++) {
      const leaf = new THREE.Mesh(leafGeo, mat(0x7ed957, 0.7));
      leaf.position.y = 2.5 + i * 1.2;
      leaf.castShadow = true;
      this.group.add(leaf);
    }
  }
}
