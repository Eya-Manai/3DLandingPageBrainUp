import * as THREE from "three";
import { createRenderer } from "./core/render.js";
import { createCamera } from "./core/camera.js";
import { createScene } from "./core/scene.js";
import { setUpLight } from "./core/light.js";
import { Ground } from "./world/ground.js";

const canvas = document.getElementById("school-canvas");

const renderer = createRenderer(canvas);
const scene = createScene();
const camera = createCamera();
const ground = new Ground(scene);

setUpLight(scene);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
