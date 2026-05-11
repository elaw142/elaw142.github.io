import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CAMERA_STOPS = [
  { pos: new THREE.Vector3(0, 2.5, 7), target: new THREE.Vector3(0, 3, 0) },
  { pos: new THREE.Vector3(7, 2.5, 0), target: new THREE.Vector3(0, 3, 0) },
  { pos: new THREE.Vector3(0, 2.5, -7), target: new THREE.Vector3(0, 3, 0) },
  { pos: new THREE.Vector3(-7, 2.5, 0), target: new THREE.Vector3(0, 3, 0) },
];

const mobilePosition = new THREE.Vector3(0, 2.35, 8.2);
const mobileTarget = new THREE.Vector3(0, 2.8, 0);
const workingPosition = new THREE.Vector3();
const workingTarget = new THREE.Vector3();

function smoothstep(value) {
  return value * value * (3 - 2 * value);
}

function cameraForProgress(camera, progress) {
  const scaled = progress * (CAMERA_STOPS.length - 1);
  const index = Math.min(CAMERA_STOPS.length - 2, Math.floor(scaled));
  const nextIndex = Math.min(index + 1, CAMERA_STOPS.length - 1);
  const localT = smoothstep(scaled - index);
  const current = CAMERA_STOPS[index];
  const next = CAMERA_STOPS[nextIndex];

  workingPosition.lerpVectors(current.pos, next.pos, localT);
  workingTarget.lerpVectors(current.target, next.target, localT);
  camera.position.copy(workingPosition);
  camera.lookAt(workingTarget);
}

export function createCameraOrbit({ camera, onFaceChange, isMobile }) {
  const state = {
    progress: 0,
    targetProgress: 0,
  };
  let trigger = null;
  let mobileMode = isMobile;

  const setMobileCamera = () => {
    camera.position.copy(mobilePosition);
    camera.lookAt(mobileTarget);
  };

  const enableDesktopScroll = () => {
    trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        state.targetProgress = self.progress;
      },
    });

    state.targetProgress = trigger.progress;
    cameraForProgress(camera, state.progress);
  };

  const refresh = (nextIsMobile) => {
    mobileMode = nextIsMobile;

    if (trigger) {
      trigger.kill();
      trigger = null;
    }

    if (nextIsMobile) {
      state.targetProgress = state.progress;
      setMobileCamera();
      return;
    }

    enableDesktopScroll();
    ScrollTrigger.refresh();
  };

  refresh(isMobile);

  return {
    refresh,
    updateProgress(progress) {
      state.progress = progress;
      state.targetProgress = progress;
      cameraForProgress(camera, state.progress);
    },
    update(delta) {
      if (mobileMode || !trigger) return;

      state.progress = THREE.MathUtils.damp(
        state.progress,
        state.targetProgress,
        5.2,
        delta,
      );

      if (Math.abs(state.progress - state.targetProgress) < 0.0005) {
        state.progress = state.targetProgress;
      }

      cameraForProgress(camera, state.progress);
      onFaceChange(Math.min(3, Math.floor(state.progress * 4)));
    },
    dispose() {
      if (trigger) trigger.kill();
    },
  };
}
