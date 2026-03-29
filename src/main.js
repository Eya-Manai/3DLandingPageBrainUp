import * as THREE from "three";
import { createRenderer } from "./core/render.js";
import { createCamera } from "./core/camera.js";
import { createScene } from "./core/scene.js";
import { setUpLight } from "./core/light.js";
import { Ground } from "./world/ground.js";
import { School } from "./world/school.js";
import { Environment } from "./world/environement.js";
import { Sky } from "./world/sky.js";
import { SoundManager } from "./audios/soundManager.js";

import { Mascot } from "./characters/mascot.js";
import { CharacterController } from "./characters/characterController.js";

const canvas = document.getElementById("school-canvas");

const renderer = createRenderer(canvas);
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = createScene();
const camera = createCamera();
const sky = new Sky(scene);
const soundManager = new SoundManager(camera, sky);

// Unlock audio on first user interaction
function unlockAudio() {
  // Remove listeners after first click/key
  window.removeEventListener("click", unlockAudio);

  // Resume Web Audio context and play sounds
  soundManager.unlockAndPlay();
}

// Listen for first interaction
window.addEventListener("click", unlockAudio, { once: true });
new Ground(scene);
new School(scene);
new Environment(scene);
setUpLight(scene);

const mascot = new Mascot(scene);
const controller = new CharacterController(mascot);

controller.onDoorEnter(() => {
  goToLanding();
});

function showIntroDialog() {
  const dialog = document.getElementById("intro-dialog");
  if (!dialog) return;

  dialog.classList.remove("hidden");

  requestAnimationFrame(() => {
    dialog.classList.add("visible");
  });

  setTimeout(() => {
    dialog.classList.remove("visible");
  }, 100000);
}
function updateDialogPosition() {
  const dialog = document.getElementById("intro-dialog");
  if (!dialog || !mascot.model) return;

  const pos = mascot.group.position.clone();
  pos.y += 4;

  pos.project(camera);

  const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;

  dialog.style.left = `${x}px`;
  dialog.style.top = `${y}px`;
}

function goToLanding() {
  const intro = document.getElementById("intro-screen");
  const landing = document.getElementById("landing-page");

  intro?.classList.add("fade-out");
  landing?.classList.add("visible");

  setTimeout(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".rv").forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
  }, 500);
}

window.__goToLanding = goToLanding;

async function init() {
  await mascot.load();
  mascot.group.position.set(0, 0, 12);
  controller.playWaveIntro();
  setTimeout(() => {
    showIntroDialog();
  }, 800);
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
  sky.update(delta);
  updateDialogPosition();

  renderer.render(scene, camera);
}

init();
