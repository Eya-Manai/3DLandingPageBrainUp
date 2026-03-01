import * as THREE from "three";
export function createRenderer(canvas) {
  const render = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
  });
  render.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  render.setSize(window.innerWidth, window.innerHeight);
  render.shadowMap.enabled = true;
  render.shadowMap.type = THREE.PCFSoftShadowMap;
  render.toneMapping = THREE.ACESFilmicToneMapping;
  render.toneMappingExposure = 1.25;

  render.setClearColor(0x87ceeb, 1);

  window.addEventListener("resize", () => {
    render.setSize(window.innerWidth, window.innerHeight);
  });

  return render;
}
