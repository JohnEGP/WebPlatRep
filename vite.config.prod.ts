import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Production-only Vite config (no server dependencies)
export default defineConfig({
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
});
