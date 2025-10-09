import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom")
    },
    dedupe: ["react", "react-dom"]
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // NO reescribir, mantener /api
      }
    }
  },
});