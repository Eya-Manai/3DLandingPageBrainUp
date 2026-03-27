import * as THREE from "three";

const DEG = (d) => (d * Math.PI) / 180;
const mat = (color, rough = 0.5, metal = 0, emissive = 0, emI = 0) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: rough,
    metalness: metal,
    emissive,
    emissiveIntensity: emI,
  });

export class Sky {
  #clouds = [];
  #birds = [];

  constructor(scene) {
    this.scene = scene;
    this.#buildClouds();
    this.#buildBirds();
  }

  #buildClouds() {
    const configs = [
      { x: -50, y: 18, z: -40, s: 2.5, speed: 0.02 },
      { x: -25, y: 20, z: -50, s: 2.0, speed: 0.015 },
      { x: 25, y: 20, z: -45, s: 1.8, speed: 0.018 },
      { x: 55, y: 18, z: -55, s: 2.2, speed: 0.02 },
    ];
    configs.forEach((cfg) => {
      const cloud = this.#makeCloud(cfg.s);
      cloud.position.set(cfg.x, cfg.y, cfg.z);
      this.scene.add(cloud);
      this.#clouds.push({ mesh: cloud, speed: cfg.speed, baseX: cfg.x });
    });
  }

  #makeCloud(scale) {
    const group = new THREE.Group();

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });

    const parts = [
      { x: 0, y: 0, r: 1.2 },
      { x: 1.2, y: 0.2, r: 0.9 },
      { x: -1.2, y: 0.2, r: 0.9 },
      { x: 0.5, y: 0.8, r: 0.7 },
    ];

    parts.forEach((p) => {
      const mesh = new THREE.Mesh(
        new THREE.CircleGeometry(p.r * scale, 32),
        material,
      );
      mesh.position.set(p.x * scale, p.y * scale, 0);
      group.add(mesh);
    });

    return group;
  }

  #buildBirds() {
    const birdMat = mat(0x222222, 0.8);

    for (let i = 0; i < 8; i++) {
      const bird = this.#makeBird(birdMat);
      const angle = (i / 8) * Math.PI * 2;
      const radius = 18 + Math.random() * 10;
      bird.position.set(
        Math.cos(angle) * radius,
        22 + Math.random() * 8,
        -20 + Math.sin(angle) * radius * 0.5,
      );
      bird.scale.setScalar(0.55 + Math.random() * 0.3);
      this.scene.add(bird);
      this.#birds.push({
        mesh: bird,
        angle,
        radius,
        speed: 0.18 + Math.random() * 0.12,
        flapSpeed: 4 + Math.random() * 3,
        flapOffset: Math.random() * Math.PI * 2,
        baseY: bird.position.y,
      });
    }
  }

  #makeBird(birdMat) {
    const group = new THREE.Group();

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), birdMat);
    body.scale.set(1, 0.7, 1.5);
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), birdMat);
    head.position.set(0, 0.1, 0.28);
    group.add(head);

    const wingGeo = new THREE.BoxGeometry(0.7, 0.05, 0.3);
    const wingL = new THREE.Mesh(wingGeo, birdMat);
    wingL.position.set(-0.35, 0, 0);
    group.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, birdMat);
    wingR.position.set(0.35, 0, 0);
    group.add(wingR);

    group.userData.wingL = wingL;
    group.userData.wingR = wingR;

    return group;
  }

  update(delta) {
    const t = performance.now() / 1000;

    this.#clouds.forEach((c) => {
      c.mesh.position.x += c.speed * delta * 60;
      if (c.mesh.position.x > 60) c.mesh.position.x = -60;
    });

    this.#birds.forEach((b) => {
      b.angle += b.speed * delta;
      b.mesh.position.x = Math.cos(b.angle) * b.radius;
      b.mesh.position.z = -20 + Math.sin(b.angle) * b.radius * 0.5;
      b.mesh.position.y = b.baseY + Math.sin(t * 0.8 + b.flapOffset) * 0.8;

      // Face direction of travel
      b.mesh.rotation.y = -b.angle + Math.PI / 2;

      const flapAngle = Math.sin(t * b.flapSpeed + b.flapOffset) * 0.45;
      b.mesh.userData.wingL.rotation.z = flapAngle;
      b.mesh.userData.wingR.rotation.z = -flapAngle;
    });
  }
}
