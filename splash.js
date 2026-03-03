// Splash Screen Controller
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

// ===== SPLASH SCREEN TOGGLE =====
// Set to true to enable splash screen, false to disable
const ENABLE_SPLASH_SCREEN = true;
// ================================

const SKIP_SPLASH_KEY = "skipSplashOnce";

function shouldSkipSplash() {
  const shouldSkipFromFlag = sessionStorage.getItem(SKIP_SPLASH_KEY) === "1";
  if (shouldSkipFromFlag) {
    sessionStorage.removeItem(SKIP_SPLASH_KEY);
    return true;
  }

  const navigationEntry = performance.getEntriesByType("navigation")[0];
  return navigationEntry?.type === "back_forward";
}

export function initSplashScreen() {
  const splashScreen = document.querySelector(".splash-screen");
  const mainContainer = document.querySelector(".main-container");
  let splashCompletionEmitted = false;

  const emitSplashComplete = () => {
    if (splashCompletionEmitted) return;
    splashCompletionEmitted = true;
    document.dispatchEvent(new CustomEvent("splash:complete"));
  };

  if (!splashScreen || !mainContainer) {
    emitSplashComplete();
    return;
  }

  // If splash screen is disabled, immediately hide it and return
  if (!ENABLE_SPLASH_SCREEN || shouldSkipSplash()) {
    splashScreen.style.display = "none";
    requestAnimationFrame(() => emitSplashComplete());
    return;
  }

  const nameContainer = document.getElementById("splash-name");
  const DRAG_DURATION_MS = 1850;
  const CURSOR_EXIT_DURATION_MS = 700;

  splashScreen.classList.add("window-intro");
  document.body.classList.add("splash-active");

  const dragCursor = document.createElement("div");
  dragCursor.className = "splash-drag-cursor";
  dragCursor.setAttribute("aria-hidden", "true");
  dragCursor.innerHTML = '<span class="cursor-fill"></span>';
  splashScreen.appendChild(dragCursor);

  let activeAnimationFrame = null;

  // Render the name using the Excelorate JSON font as an SVG
  const loader = new FontLoader();
  loader.load("/static/fonts/excelorate_regular.json", (font) => {
    const name = "Elliot Lawrence";
    const shapes = font.generateShapes(name, 140);
    const OUTER_PATH_DETAIL = 36;
    const INNER_PATH_DETAIL = 24;

    // Convert shapes to simple SVG paths (approximating curves with points)
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const paths = [];

    shapes.forEach((shape) => {
      const pts = shape.getPoints(OUTER_PATH_DETAIL);
      if (!pts || pts.length === 0) return;

      // update bounds
      pts.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      });

      const d =
        pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${-p.y}`).join(" ") +
        " Z";
      paths.push(d);

      // holes (if any)
      if (shape.holes && shape.holes.length) {
        shape.holes.forEach((hole) => {
          const hpts = hole.getPoints(INNER_PATH_DETAIL);
          hpts.forEach((p) => {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
          });
          const hd =
            hpts
              .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${-p.y}`)
              .join(" ") + " Z";
          paths.push(hd);
        });
      }
    });

    // Create SVG and inject paths
    if (paths.length && nameContainer) {
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      const width = maxX - minX || 1;
      const height = maxY - minY || 1;
      svg.setAttribute("viewBox", `${minX} ${-maxY} ${width} ${height}`);
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

      paths.forEach((d) => {
        const pathEl = document.createElementNS(svgNS, "path");
        pathEl.setAttribute("d", d);
        pathEl.setAttribute("fill", "#000");
        svg.appendChild(pathEl);
      });

      // clear fallback text and append svg
      nameContainer.innerHTML = "";
      nameContainer.appendChild(svg);
    }
  });

  let splashDismissed = false;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const setDragTransforms = (x, y, cursorAnchorX, cursorAnchorY) => {
    mainContainer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    dragCursor.style.transform = `translate3d(${cursorAnchorX + x}px, ${cursorAnchorY + y}px, 0)`;
  };

  const runExitAnimation = (cursorStartX, cursorY, cursorEndX, onComplete) => {
    const startTime = performance.now();

    const step = (now) => {
      if (splashDismissed) return;

      const progress = Math.min(
        (now - startTime) / CURSOR_EXIT_DURATION_MS,
        1,
      );
      const eased = easeOutCubic(progress);
      const cursorX = cursorStartX + (cursorEndX - cursorStartX) * eased;

      dragCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      dragCursor.style.opacity = `${1 - eased}`;

      if (progress < 1) {
        activeAnimationFrame = requestAnimationFrame(step);
        return;
      }

      onComplete();
    };

    activeAnimationFrame = requestAnimationFrame(step);
  };

  const runDragAnimation = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const startX = (isMobile ? -115 : -90) * (window.innerWidth / 100);
    const startY = (isMobile ? -58 : -48) * (window.innerHeight / 100);
    const cursorAnchorX = isMobile ? 80 : 360;
    const cursorAnchorY = isMobile ? 26 : 56;
    const cursorExitX = isMobile ? -52 : -56;

    const startTime = performance.now();

    const step = (now) => {
      if (splashDismissed) return;

      const progress = Math.min((now - startTime) / DRAG_DURATION_MS, 1);
      const eased = easeOutCubic(progress);
      const x = startX * (1 - eased);
      const y = startY * (1 - eased);

      setDragTransforms(x, y, cursorAnchorX, cursorAnchorY);

      if (progress < 1) {
        activeAnimationFrame = requestAnimationFrame(step);
        return;
      }

      mainContainer.style.transform = "translate3d(0, 0, 0)";

      runExitAnimation(cursorAnchorX, cursorAnchorY, cursorExitX, () => {
        dismissSplash();
      });
    };

    dragCursor.style.opacity = "1";
    activeAnimationFrame = requestAnimationFrame(step);
  };

  const dismissSplash = () => {
    if (splashDismissed) return;
    splashDismissed = true;

    if (activeAnimationFrame !== null) {
      cancelAnimationFrame(activeAnimationFrame);
      activeAnimationFrame = null;
    }

    mainContainer.classList.remove("splash-drag-in");
    mainContainer.style.transform = "translate3d(0, 0, 0)";
    dragCursor.style.opacity = "0";
    splashScreen.classList.add("fade-out");
    emitSplashComplete();

    setTimeout(() => {
      splashScreen.style.display = "none";
      document.body.classList.remove("splash-active");
    }, 1200);
  };

  const startIntroAnimation = () => {
    requestAnimationFrame(() => {
      mainContainer.classList.add("splash-drag-in");
      runDragAnimation();
    });
  };

  // Wait for the page to fully load before playing intro motion
  if (document.readyState === "complete") {
    startIntroAnimation();
  } else {
    window.addEventListener("load", startIntroAnimation, { once: true });
  }

  // Allow user to skip splash screen by clicking on it
  splashScreen.addEventListener("click", () => {
    dismissSplash();
  });
}
