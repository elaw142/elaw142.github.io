// Splash Screen Controller
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

// ===== SPLASH SCREEN TOGGLE =====
// Set to true to enable splash screen, false to disable
const ENABLE_SPLASH_SCREEN = false;
// ================================

export function initSplashScreen() {
  const splashScreen = document.querySelector(".splash-screen");

  // If splash screen is disabled, immediately hide it and return
  if (!ENABLE_SPLASH_SCREEN) {
    if (splashScreen) {
      splashScreen.style.display = "none";
    }
    return;
  }

  const nameContainer = document.getElementById("splash-name");

  // Render the name using the Excelorate JSON font as an SVG
  const loader = new FontLoader();
  loader.load("/static/fonts/excelorate_regular.json", (font) => {
    const name = "Elliot Lawrence";
    const shapes = font.generateShapes(name, 140);

    // Convert shapes to simple SVG paths (approximating curves with points)
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const paths = [];

    shapes.forEach((shape) => {
      const pts = shape.getPoints(120);
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
          const hpts = hole.getPoints(80);
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

  // Wait for the page to fully load
  window.addEventListener("load", () => {
    // Keep splash screen visible for ~3 seconds, then fade out
    setTimeout(() => {
      splashScreen.classList.add("fade-out");

      // Remove splash screen from DOM after animation completes
      setTimeout(() => {
        splashScreen.style.display = "none";
      }, 1200);
    }, 2800);
  });

  // Allow user to skip splash screen by clicking on it
  splashScreen.addEventListener("click", () => {
    splashScreen.classList.add("fade-out");
    setTimeout(() => {
      splashScreen.style.display = "none";
    }, 1200);
  });
}
