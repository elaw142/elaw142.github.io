import * as THREE from "three";
import { COLORS } from "../utils/colors.js";

export function createParticles(count) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const radius = Math.random() * 2.6;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 5.8 + 0.1;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    speeds[i] = 0.06 + Math.random() * 0.12;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: new THREE.Color(COLORS.rune),
    size: 0.035,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);

  const update = (delta, time) => {
    const position = geometry.attributes.position;

    for (let i = 0; i < count; i += 1) {
      const yIndex = i * 3 + 1;
      const xIndex = i * 3;
      const zIndex = i * 3 + 2;

      positions[yIndex] += speeds[i] * delta;
      positions[xIndex] += Math.sin(time * 0.18 + i) * 0.0006;
      positions[zIndex] += Math.cos(time * 0.16 + i * 0.5) * 0.0006;

      if (positions[yIndex] > 6.2) {
        const radius = Math.random() * 2.2;
        const angle = Math.random() * Math.PI * 2;
        positions[xIndex] = Math.cos(angle) * radius;
        positions[yIndex] = 0.12;
        positions[zIndex] = Math.sin(angle) * radius;
      }
    }

    position.needsUpdate = true;
  };

  return { points, update };
}
