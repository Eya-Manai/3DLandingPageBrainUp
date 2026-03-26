import * as THREE from "three";
import { createRenderer } from "./core/render.js";
import { createCamera } from "./core/camera.js";
import { createScene } from "./core/scene.js";
import { setUpLight } from "./core/light.js";
import { Ground } from "./world/ground.js";
import { School } from "./world/school.js";
import { Environment } from "./world/environement.js";
import { Mascot } from "./characters/mascot.js";
import { CharacterController } from "./characters/characterController.js";

const canvas = document.getElementById("school-canvas");

const renderer = createRenderer(canvas);
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = createScene();
const camera = createCamera();

new Ground(scene);
new School(scene);
new Environment(scene);
setUpLight(scene);

const mascot = new Mascot(scene);
const controller = new CharacterController(mascot);

controller.onDoorEnter(() => {
  goToLanding();
});

function goToLanding() {
  const intro = document.getElementById("intro-screen");
  const landing = document.getElementById("landing-page");

  intro?.classList.add("fade-out");

  landing?.classList.add("visible");
}

window.__goToLanding = goToLanding;

async function init() {
  await mascot.load();
  mascot.group.position.set(0, 0, 6);
  animate();
}

let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  controller.update(delta);
  mascot.update(delta);

  renderer.render(scene, camera);
}

init();
