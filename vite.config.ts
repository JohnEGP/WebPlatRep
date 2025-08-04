import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [react()];

  // Only add Express plugin in development
  if (mode === "development") {
    plugins.push(expressPlugin());
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    base: "/",
    build: {
      outDir: "dist/spa",
      assetsDir: "assets",
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
  };
});

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    async configureServer(server) {
      try {
        // Dynamically import server only during development
        const { createServer } = await import("./server/index.js");
        const app = createServer();
        server.middlewares.use(app);
      } catch (error) {
        console.warn("Could not load server middleware:", error);
      }
    },
  };
}
