import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const config = {
    base: "/",
    build: {
      outDir: "dist/spa",
      assetsDir: "assets",
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
  };

  // Only add server config in development
  if (command === "serve") {
    config.server = {
      host: "::",
      port: 8080,
    };

    // Add Express plugin only in development
    config.plugins.push({
      name: "express-plugin",
      configureServer: async (server) => {
        try {
          const { createServer } = await import("./server/index.js");
          const app = createServer();
          server.middlewares.use(app);
        } catch (error) {
          console.warn("Server middleware not available:", error.message);
        }
      },
    });
  }

  return config;
});
