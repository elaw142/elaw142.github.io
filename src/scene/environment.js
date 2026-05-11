import * as THREE from "three";
import { COLORS } from "../utils/colors.js";

function random(seed) {
  let value = seed;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createEnvironment(scene, isMobile) {
  scene.background = new THREE.Color(COLORS.skyDeep);
  scene.fog = new THREE.FogExp2(
    new THREE.Color(COLORS.skyDeep),
    isMobile ? 0.052 : 0.035,
  );

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshToonMaterial({ color: new THREE.Color(COLORS.ground) }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const rng = random(42);
  const mossGeometry = new THREE.IcosahedronGeometry(0.18, 0);
  const mossMaterial = new THREE.MeshToonMaterial({
    color: new THREE.Color(COLORS.mossMid),
  });
  const moss = new THREE.InstancedMesh(mossGeometry, mossMaterial, isMobile ? 24 : 48);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < moss.count; i += 1) {
    const radius = 0.85 + rng() * 3.2;
    const angle = rng() * Math.PI * 2;
    dummy.position.set(Math.cos(angle) * radius, 0.045, Math.sin(angle) * radius);
    dummy.rotation.set(rng() * 0.2, rng() * Math.PI, rng() * 0.2);
    dummy.scale.set(0.5 + rng() * 1.5, 0.08 + rng() * 0.06, 0.55 + rng() * 1.7);
    dummy.updateMatrix();
    moss.setMatrixAt(i, dummy.matrix);
  }

  moss.castShadow = true;
  moss.receiveShadow = true;
  scene.add(moss);

  const pillarGeometry = new THREE.BoxGeometry(0.8, 3.2, 0.7, 1, 2, 1);
  const pillarMaterial = new THREE.MeshToonMaterial({
    color: new THREE.Color(COLORS.stoneDark),
  });
  const pillars = new THREE.InstancedMesh(pillarGeometry, pillarMaterial, 4);
  const pillarData = [
    [-8, 1.1, -7, 0.5, 0.9],
    [8.5, 1.35, -8, -0.25, 1.15],
    [-10, 0.95, 5.5, -0.1, 0.75],
    [9.5, 1.15, 5.8, 0.28, 1],
  ];

  pillarData.forEach(([x, y, z, rotY, scaleY], index) => {
    dummy.position.set(x, y, z);
    dummy.rotation.set(0.08, rotY, -0.04);
    dummy.scale.set(1, scaleY, 1);
    dummy.updateMatrix();
    pillars.setMatrixAt(index, dummy.matrix);
  });

  pillars.castShadow = true;
  pillars.receiveShadow = true;
  scene.add(pillars);

  return {
    setMobile(nextIsMobile) {
      scene.fog.density = nextIsMobile ? 0.052 : 0.035;
    },
  };
}
