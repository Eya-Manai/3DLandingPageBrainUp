import * as THREE from "three";
export function setUpLight(scene) {
  const sky = new THREE.HemisphereLight(0x87ceeb, 0x8b9d6a, 1.2);
  scene.add(sky);

  // ─── 2. SUN (main directional light)
  const sun = new THREE.DirectionalLight(0xfff5cc, 2.5);
  sun.position.set(20, 35, 15);

  // Shadow setup
  sun.castShadow = true;
  sun.shadow.mapSize.width = 4096; // shadow map resolution (higher = sharper)
  sun.shadow.mapSize.height = 4096;
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 150;

  // Shadow frustum — must encompass your whole scene
  sun.shadow.camera.left = -40;
  sun.shadow.camera.right = 40;
  sun.shadow.camera.top = 40;
  sun.shadow.camera.bottom = -40;

  sun.shadow.radius = 3; // shadow blur (PCFSoft only)

  scene.add(sun);

  // ─── 3. FILL LIGHT (softens shadows from opposite side)
  const fill = new THREE.DirectionalLight(0xffd4a0, 0.6);
  fill.position.set(-10, 5, -10);
  scene.add(fill);

  // ─── 4. WINDOW GLOW LIGHTS (warm indoor light leaking out)
  // Added per-window in School.js, referenced here for context
  // const windowLight = new THREE.PointLight(0xFFD080, 0.8, 5)
  // windowLight.position.set(x, y, z)

  return { sky, sun, fill };
}
