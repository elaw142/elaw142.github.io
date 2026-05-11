import * as THREE from "three";
import { COLORS } from "../utils/colors.js";

export function createMonolith() {
  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1.2, 6, 0.8, 4, 12, 4);
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i += 1) {
    const y = positions.getY(i);
    const taper = 1 - ((y + 3) / 6) * 0.15;
    const stoneNoise = Math.sin(i * 19.17) * 0.02 + Math.cos(i * 7.83) * 0.018;

    positions.setX(i, positions.getX(i) * taper + stoneNoise);
    positions.setZ(i, positions.getZ(i) + Math.sin(i * 13.29) * 0.026);
  }

  geometry.computeVertexNormals();

  const material = new THREE.MeshToonMaterial({
    color: new THREE.Color(COLORS.stoneMid),
  });

  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#16120f"),
    side: THREE.BackSide,
  });

  const outline = new THREE.Mesh(geometry.clone(), outlineMaterial);
  outline.scale.set(1.05, 1.015, 1.05);
  group.add(outline);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  group.position.y = 1.5;
  group.userData.baseY = 1.5;

  const update = (time) => {
    group.position.y = group.userData.baseY + Math.sin(time * 0.4) * 0.015;
    group.rotation.z = Math.sin(time * 0.3) * 0.003;
    group.rotation.x = Math.sin(time * 0.25) * 0.002;
  };

  return { group, mesh, update };
}
