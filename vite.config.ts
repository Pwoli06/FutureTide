import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so GitHub Pages project sites resolve assets without a hardcoded repo name.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
