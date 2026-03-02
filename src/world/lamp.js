import * as THREE from "three";
const mat = (color, metal = 0.3) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.4,
    metalness: metal,
  });
export class Lamp {
  constructor(scene, x = 0, z = 0) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);
    this.group.position.set(x, 0, z);
    this.build(scene);
  }

  build(scene) {
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 5, 12),
      mat(0x888888),
    );
    pole.position.y = 2.5;
    this.group.add(pole);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      mat(0xffee8c, 0.8),
    );
    head.position.y = 5;
    this.group.add(head);

    const light = new THREE.PointLight(0xffee8c, 1.2, 15);
    light.position.y = 5;
    light.castShadow = true;
    scene.add(light);
  }
}
