import * as THREE from "three";

const mat = (color, rough = 0.5, metal = 0) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: rough,
    metalness: metal,
    flatShading: true,
  });

export class Chair {
  constructor(scene, x = 0, z = 0) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);
    this.group.position.set(x, 0, z);
    this.build();
  }

  build() {
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.3, 1),
      mat(0xffee8c, 0.8),
    );
    seat.position.y = 1;
    seat.castShadow = true;
    this.group.add(seat);

    const back = new THREE.Mesh(
      new THREE.BoxGeometry(4, 1.5, 0.3),
      mat(0xffee8c, 0.8),
    );
    back.position.set(0, 1.75, -0.35);
    back.castShadow = true;
    this.group.add(back);

    const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 1, 16);
    const legPositions = [
      [-1.8, 0.5, 0.4],
      [1.8, 0.5, 0.4],
      [-1.8, 0.5, -0.4],
      [1.8, 0.5, -0.4],
    ];

    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeo, mat(0xffde21, 0.8));
      leg.position.set(...pos);
      leg.castShadow = true;
      this.group.add(leg);
    });
  }
}
