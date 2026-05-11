import * as THREE from "three";
import "./styles/base.css";
import "./styles/hud.css";
import "./styles/mobile.css";
import { sections } from "./hud/content.js";
import { createHud } from "./hud/panels.js";
import { createMobileState } from "./utils/mobile.js";
import { COLORS } from "./utils/colors.js";
import { createMonolith } from "./scene/monolith.js";
import { createEnvironment } from "./scene/environment.js";
import { createLighting } from "./scene/lighting.js";
import { createParticles } from "./scene/particles.js";
import { createRunes } from "./scene/runes.js";
import { createCameraOrbit } from "./scroll/camera-orbit.js";

const canvas = document.querySelector("[data-scene-canvas]");
const hudRoot = document.querySelector("#hud-root");
const tabRoot = document.querySelector("#mobile-tabs");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
renderer.setClearColor(new THREE.Color(COLORS.skyDeep), 1);

let environment;
let cameraOrbit;
let activeFace = 0;

const hud = createHud({
  root: hudRoot,
  tabRoot,
  sections,
  onSelect(index) {
    setActiveFace(index);
  },
});

const mobileState = createMobileState((isMobile) => {
  applyRendererSize();
  environment.setMobile(isMobile);
  cameraOrbit.refresh(isMobile);
});

function setActiveFace(index) {
  const next = Math.max(0, Math.min(sections.length - 1, index));
  if (next === activeFace) return;
  activeFace = next;
  hud.setActive(activeFace);
  runes.setActiveFace(activeFace);
}

function applyRendererSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const maxPixelRatio = mobileState?.value ? 1 : 2;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
}

environment = createEnvironment(scene, mobileState.value);
const lighting = createLighting(scene);
const monolith = createMonolith();
scene.add(monolith.group);

const runes = createRunes(monolith.group);
const particles = createParticles(mobileState.value ? 60 : 160);
scene.add(particles.points);

cameraOrbit = createCameraOrbit({
  camera,
  isMobile: mobileState.value,
  onFaceChange: setActiveFace,
});

applyRendererSize();
window.addEventListener("resize", () => {
  applyRendererSize();
  cameraOrbit.refresh(mobileState.value);
});

const clock = new THREE.Clock();

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  const time = clock.elapsedTime;

  monolith.update(time);

  if (mobileState.value) {
    monolith.group.rotation.y += 0.001;
  } else {
    monolith.group.rotation.y = THREE.MathUtils.damp(
      monolith.group.rotation.y,
      0,
      5,
      delta,
    );
  }

  runes.update(time);
  particles.update(delta, time);
  lighting.update(time);
  cameraOrbit.update(delta);
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

animate();
