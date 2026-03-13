import * as THREE from "three";

const DEG = (d) => (d * Math.PI) / 180;
const mat = (color, rough = 0.5, metal = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

export class School {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);
    this.build();
    this.group.position.set(0, 0, -8);
    scene.add(this.group);
  }

  build() {
    this.buildMainBuilding();
    this.buildRoof();
    this.buildColumns();
    this.buildSteps();
    this.buildDoor();
    this.buildWindows();
    this.buildBellTower();
    this.buildWings();
    this.buildSign();
  }

  buildMainBuilding() {
    const geo = new THREE.BoxGeometry(22, 9, 10);
    const mesh = new THREE.Mesh(geo, mat(0xfffafa, 0.7));
    mesh.position.y = 4.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);
  }

  buildRoof() {
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(23, 0.8, 11),
      mat(0x5b7cff, 0.5, 0.1),
    );
    slab.position.y = 9.5;
    slab.castShadow = true;
    this.group.add(slab);

    const peak = new THREE.Mesh(
      new THREE.CylinderGeometry(0, 5, 3, 4),
      mat(0x5b7cff, 0.5, 0.1),
    );
    peak.rotation.y = DEG(45);
    peak.position.y = 11.3;
    peak.castShadow = true;
    this.group.add(peak);
  }

  buildColumns() {
    for (let x = -9; x <= 9; x += 3) {
      if (x === 0) continue;
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.4, 8, 12),
        mat(0xffffff, 0.6),
      );
      col.position.set(x, 0, 5.1);
      col.castShadow = true;
      this.group.add(col);

      const capital = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.3, 0.9),
        mat(0xffffff, 0.6),
      );
      capital.position.set(x, 8.15, 5.1);
      this.group.add(capital);
    }
  }

  buildSteps() {
    for (let i = 0; i < 4; i++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(12, 0.25, 1.2),
        mat(0xd4c090, 0.7),
      );
      step.position.set(0, -i * 0.25 + 0.1, 5.6 + i * 0.6);
      step.castShadow = true;
      this.group.add(step);
    }
  }

  buildDoor() {
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 3.5, 0.15),
      mat(0x5b7cff, 0.8),
    );
    door.position.set(0, 1.75, 5.075);
    this.group.add(door);

    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.18, 8, 24, Math.PI),
      mat(0xede0c0, 0.6),
    );
    arch.rotation.z = DEG(180);
    arch.position.set(0, 3.5, 5.04);
    this.group.add(arch);
  }

  buildWindows() {
    const positions = [
      [-7, 6],
      [-4, 6],
      [4, 6],
      [7, 6],
      [-7, 3],
      [-4, 3],
      [4, 3],
      [7, 3],
    ];

    positions.forEach(([wx, wy]) => {
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 2.4, 0.18),
        mat(0xd4c090, 0.6),
      );
      frame.position.set(wx, wy, 5.0);
      this.group.add(frame);

      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 2.0, 0.1),
        new THREE.MeshStandardMaterial({
          color: 0x88ccff,
          roughness: 0.05,
          metalness: 0.1,
          transparent: true,
          opacity: 0.7,
          emissive: 0x88ccff,
          emissiveIntensity: 0.3,
        }),
      );
      glass.position.set(wx, wy, 5.06);
      this.group.add(glass);

      const hBar = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.06, 0.14),
        mat(0xd4c090, 0.6),
      );
      hBar.position.set(wx, wy, 5.08);
      this.group.add(hBar);

      const vBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 2.0, 0.14),
        mat(0xd4c090, 0.6),
      );
      vBar.position.set(wx, wy, 5.08);
      this.group.add(vBar);

      const light = new THREE.PointLight(0xffd080, 0.8, 5);
      light.position.set(wx, wy, 4.5);
      this.group.add(light);
    });
  }
  buildBellTower() {
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3.5, 3),
      mat(0xfffaaf, 0.6),
    );
    tower.position.set(0, 12.5, 0);
    tower.castShadow = true;
    this.group.add(tower);

    const clock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 0.2, 32),
      mat(0xffffff, 0.6),
    );
    clock.rotation.x = DEG(90);
    clock.position.set(0, 12.8, 1.6);
    this.group.add(clock);

    const clockBorder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.0, 0.05, 32),
      mat(0x333333, 0.4),
    );

    clockBorder.rotation.x = DEG(90);
    clockBorder.position.set(0, 12.8, 1.63);
    this.group.add(clockBorder);

    const hourHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.6, 0.05),
      mat(0x000000, 0.3),
    );

    hourHand.position.set(0, 12.8, 1.75);
    hourHand.rotation.z = DEG(-45);
    this.group.add(hourHand);

    const minuteHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.9, 0.05),
      mat(0x000000, 0.3),
    );

    minuteHand.position.set(0.2, 12.8, 1.76);
    minuteHand.rotation.z = DEG(120);

    this.group.add(minuteHand);

    const bell = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.6, 0.5, 16, 1, true),
      mat(0xb8860b, 0.2, 0.7),
    );
    bell.position.set(0, 13.5, 0);
    this.bell = bell;
    this.group.add(bell);

    const roof = new THREE.Mesh(
      new THREE.CylinderGeometry(0, 1.8, 2, 4),
      mat(0x5b7cff, 0.5),
    );
    roof.rotation.y = DEG(45);
    roof.position.set(0, 15.3, 0);
    roof.castShadow = true;
    this.group.add(roof);
  }

  buildSign() {
    const sign = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.7, 0.2),
      mat(0xd4c090, 0.4, 0.2),
    );
    sign.position.set(0, 9.9, 5.1);
    this.group.add(sign);

    const glow = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 0.5, 0.1),
      new THREE.MeshStandardMaterial({
        color: 0xe6c229,
        emissive: 0xe6c229,
        emissiveIntensity: 1.5,
      }),
    );
    glow.position.set(0, 9.9, 5.21);
    this.group.add(glow);
  }
  buildWingWindows(centerX) {
    const positions = [
      [-1.5, 4.5],
      [1.5, 4.5],
      [-1.5, 2.2],
      [1.5, 2.2],
    ];

    positions.forEach(([offsetX, offsetY]) => {
      const wx = centerX + offsetX;
      const wy = offsetY;

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2, 0.15),
        mat(0xd4c090, 0.6),
      );
      frame.position.set(wx, wy, 4);
      this.group.add(frame);

      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.6, 0.08),
        new THREE.MeshStandardMaterial({
          color: 0x88ccff,
          roughness: 0.05,
          metalness: 0.1,
          transparent: true,
          opacity: 0.7,
          emissive: 0x88ccff,
          emissiveIntensity: 0.3,
        }),
      );
      glass.position.set(wx, wy, 4.05);
      this.group.add(glass);

      const hBar = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.05, 0.1),
        mat(0xd4c090, 0.6),
      );
      hBar.position.set(wx, wy, 4.07);
      this.group.add(hBar);

      const vBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 1.6, 0.1),
        mat(0xd4c090, 0.6),
      );
      vBar.position.set(wx, wy, 4.07);
      this.group.add(vBar);

      const light = new THREE.PointLight(0xffd080, 0.6, 4);
      light.position.set(wx, wy, 3.5);
      this.group.add(light);
    });
  }

  buildWings() {
    [-1, 1].forEach((side) => {
      const wing = new THREE.Mesh(
        new THREE.BoxGeometry(6, 7, 8),
        mat(0xfffafa, 0.7),
      );
      wing.position.set(side * 14, 3.5, 0);
      wing.castShadow = true;
      wing.receiveShadow = true;
      this.group.add(wing);

      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(6.5, 0.5, 8.5),
        mat(0x5b7cff, 0.5, 0.1),
      );
      roof.position.set(side * 14, 7.25, 0);
      roof.castShadow = true;
      this.group.add(roof);
      this.buildWingWindows(side * 14);
    });
  }
}
