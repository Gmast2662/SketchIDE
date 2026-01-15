import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: './', // Important for Electron - use relative paths
  define: {
    // Read version from package.json at build time
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(
      process.env.npm_package_version || JSON.parse(readFileSync('./package.json', 'utf-8')).version || '1.0.0'
    ),
    '__APP_VERSION__': JSON.stringify(
      process.env.npm_package_version || JSON.parse(readFileSync('./package.json', 'utf-8')).version || '1.0.0'
    ),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper paths for Electron
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
});
