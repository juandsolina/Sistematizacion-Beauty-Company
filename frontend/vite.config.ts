import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve("./node_modules/react"), // 👈 fuerza una sola copia
      "react-dom": path.resolve("./node_modules/react-dom") // 👈 igual
    },
    dedupe: ["react", "react-dom"]
  },
  server: {
    port: 5173,
    host: true
  },
});
