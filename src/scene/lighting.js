import * as THREE from "three";
import { COLORS } from "../utils/colors.js";

export function createLighting(scene) {
  const ambient = new THREE.AmbientLight(0x1e2d3d, 0.8);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffd6a0, 1.2);
  sun.position.set(-5, 8, 3);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 1024;
  sun.shadow.mapSize.height = 1024;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 26;
  sun.shadow.camera.left = -9;
  sun.shadow.camera.right = 9;
  sun.shadow.camera.top = 9;
  sun.shadow.camera.bottom = -9;
  scene.add(sun);

  const runeLight = new THREE.PointLight(new THREE.Color(COLORS.rune), 1.5, 8);
  runeLight.position.set(0, 3, 0);
  scene.add(runeLight);

  return {
    update(time) {
      runeLight.intensity = 1.3 + Math.sin(time * 1.6) * 0.22;
    },
  };
}
