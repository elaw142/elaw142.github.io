import restart from "vite-plugin-restart";

const cleanUrlAliases = {
  "/cv": "/cv/index.html",
  "/cv/": "/cv/index.html",
  "/playground": "/playground/index.html",
  "/playground/": "/playground/index.html",
};

function cleanUrlRoutingPlugin() {
  const rewriteRequest = (req) => {
    if (!req.url) return;
    const [pathname, query = ""] = req.url.split("?");
    const target = cleanUrlAliases[pathname];
    if (!target) return;
    req.url = query ? `${target}?${query}` : target;
  };

  return {
    name: "clean-url-routing",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewriteRequest(req);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewriteRequest(req);
        next();
      });
    },
  };
}

export default {
  root: "", // Sources files (typically where index.html is)
  appType: "mpa", // Disable SPA fallback to index.html so /playground and /cv resolve as separate pages
  publicDir: "./public/", // Path from "root" to static assets (files that are served as they are)
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
  },
  plugins: [
    cleanUrlRoutingPlugin(),
    restart({ restart: ["../public/**"] }), // Restart server on static file change
  ],
};
