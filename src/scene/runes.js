import * as THREE from "three";
import { COLORS } from "../utils/colors.js";

const FACE_TRANSFORMS = [
  { position: [0, 0.55, 0.424], rotationY: 0 },
  { position: [0.624, 0.55, 0], rotationY: Math.PI / 2 },
  { position: [0, 0.55, -0.424], rotationY: Math.PI },
  { position: [-0.624, 0.55, 0], rotationY: -Math.PI / 2 },
];

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addSegment(points, x1, y1, x2, y2) {
  points.push(x1, y1, 0, x2, y2, 0);
}

function addGlyph(points, x, y, scale, variant) {
  const s = scale;

  if (variant === 0) {
    addSegment(points, x, y + s, x, y - s);
    addSegment(points, x - s * 0.7, y, x + s * 0.7, y);
    addSegment(points, x - s * 0.55, y + s * 0.55, x + s * 0.55, y - s * 0.55);
  }

  if (variant === 1) {
    addSegment(points, x - s * 0.8, y + s * 0.8, x + s * 0.55, y + s * 0.8);
    addSegment(points, x + s * 0.55, y + s * 0.8, x - s * 0.35, y - s * 0.2);
    addSegment(points, x - s * 0.35, y - s * 0.2, x + s * 0.8, y - s * 0.2);
    addSegment(points, x, y - s * 0.2, x, y - s * 1.0);
  }

  if (variant === 2) {
    addSegment(points, x - s * 0.85, y - s * 0.85, x, y + s * 0.95);
    addSegment(points, x, y + s * 0.95, x + s * 0.85, y - s * 0.85);
    addSegment(points, x - s * 0.42, y, x + s * 0.42, y);
    addSegment(points, x, y + s * 0.95, x, y + s * 1.3);
  }

  if (variant === 3) {
    addSegment(points, x - s * 0.8, y + s * 0.7, x + s * 0.8, y - s * 0.7);
    addSegment(points, x - s * 0.8, y - s * 0.7, x + s * 0.8, y + s * 0.7);
    addSegment(points, x - s * 0.45, y, x + s * 0.45, y);
    addSegment(points, x, y - s * 0.95, x, y - s * 1.25);
  }

  if (variant === 4) {
    addSegment(points, x - s * 0.75, y + s * 0.8, x - s * 0.75, y - s * 0.75);
    addSegment(points, x - s * 0.75, y - s * 0.75, x + s * 0.75, y);
    addSegment(points, x + s * 0.75, y, x - s * 0.75, y + s * 0.8);
    addSegment(points, x + s * 0.22, y + s * 0.32, x + s * 0.58, y + s * 0.95);
  }
}

function createRuneGeometry(seed) {
  const points = [];
  const rng = seededRandom(seed);
  const rows = [-1.7, -1.08, -0.46, 0.22, 0.95, 1.62];

  rows.forEach((row, index) => {
    const offset = index % 2 === 0 ? -0.18 : 0.18;
    const count = index % 3 === 0 ? 2 : 3;

    for (let i = 0; i < count; i += 1) {
      const step = count === 2 ? 0.38 : 0.3;
      const x = (i - (count - 1) / 2) * step + offset * (rng() - 0.5);
      const y = row + (rng() - 0.5) * 0.12;
      addGlyph(points, x, y, 0.11 + rng() * 0.045, Math.floor(rng() * 5));
    }
  });

  addSegment(points, -0.3, -2.05, 0.3, -2.05);
  addSegment(points, 0, -2.05, 0, 2.05);
  addSegment(points, -0.25, 2.05, 0.25, 2.05);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(points, 3),
  );
  return geometry;
}

function createRuneMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0.26 },
      uColor: { value: new THREE.Color(COLORS.rune) },
    },
    vertexShader: `
      varying float vY;

      void main() {
        vY = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uColor;
      varying float vY;

      void main() {
        float pulse = 0.64 + 0.36 * sin(uTime * 2.2 + vY * 4.0);
        float scan = 1.0 - smoothstep(0.0, 0.035, abs(fract(uTime * 0.18 + vY * 0.18) - 0.5));
        float alpha = (0.12 + uIntensity * 0.88) * pulse + scan * 0.12;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });
}

export function createRunes(parent) {
  const runes = FACE_TRANSFORMS.map((transform, index) => {
    const material = createRuneMaterial();
    const lines = new THREE.LineSegments(createRuneGeometry(index + 3), material);
    lines.position.set(...transform.position);
    lines.rotation.y = transform.rotationY;
    lines.renderOrder = 2;
    parent.add(lines);
    return lines;
  });

  const setActiveFace = (activeFace) => {
    runes.forEach((rune, index) => {
      rune.material.uniforms.uIntensity.value = index === activeFace ? 1 : 0.24;
    });
  };

  const update = (time) => {
    runes.forEach((rune) => {
      rune.material.uniforms.uTime.value = time;
    });
  };

  setActiveFace(0);

  return { runes, setActiveFace, update };
}
