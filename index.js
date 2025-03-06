import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

/**
 * Base
 */
// Debug
const gui = new GUI();
gui.hide(); // Hide the GUI by default

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 *  Axes Helper
 */
const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("./textures/matcaps/7.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 *  Fonts
 */
const fontLoader = new FontLoader();

// Font loading
fontLoader.load("./fonts/excelorate_regular.json", (font) => {
  const textGeometry = new TextGeometry("Elliot Lawrence", {
    font,
    size: 0.5,
    depth: 0.2, // Slightly deeper for better 3D effect
    curveSegments: 4, // Increased for smoother curves
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3, // Increased for smoother bevel
  });

  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
  });
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  const donutGeometry = new THREE.SphereGeometry(0.05);

  for (let i = 0; i < 1000; i++) {
    const donut = new THREE.Mesh(
      donutGeometry,
      i % 2 === 0 ? material : wireframeMaterial
    );
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;
    donut.rotation.x = Math.random() * Math.PI * 2;
    donut.rotation.y = Math.random() * Math.PI * 2;
    donut.rotation.z = Math.random() * Math.PI * 2;
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    scene.add(donut);
  }
});

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2.5; // Positioned slightly further back
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, // Enable transparency
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // Transparent background

// Calculate the aspect ratio of the main-container
const mainContainer = document.querySelector(".main-container");
const updateSizes = () => {
  const rect = mainContainer.getBoundingClientRect();
  sizes.width = rect.width;
  sizes.height = rect.height - 20; // Account for the window-header height (approx 20px)
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// Initial size update
updateSizes();

// Update sizes on window resize
window.addEventListener("resize", updateSizes);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05; // Smoother damping
controls.enableZoom = true;
controls.minDistance = 1;
controls.maxDistance = 10;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Optional: Add some gentle rotation to the scene
  scene.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelector(".github-window").classList.add("visible");
    setTimeout(() => {
      document.querySelector(".cv-window").classList.add("visible");
    }, 500); // Stagger the CV window by 0.5 seconds for a playful effect
  }, 2500); // Initial delay of 2.5 seconds
});